import { useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

// import { useCurrentApp } from '../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { formatDateValue } from '../utils/index';

function stringify(params: Record<string, any>) {
  const url = new URL(location.origin);
  for (const key in params) {
    url.searchParams.set(key, params[key]);
  }

  return url.search.slice(1);
}

export function useRequest<T = any>(
  apiPath: string,
): (params?: Record<string, any>, init?: RequestInit) => Promise<T> {
  // const { user, indicator } = useCurrentApp()
  const { user, indicator } = useModel('user');
  const { token, chooseDate, setToken, apiEndpoint, dateType } = user;
  const aborter = useRef(new AbortController());
  const indicatorUpdateTime = indicator?.updateTime;
  const formattedChooseDate = useMemo(() => {
    let date = chooseDate;
    if (indicatorUpdateTime) {
      const indicatorUpdateDate = new Date(indicatorUpdateTime);

      if (`${indicatorUpdateDate}` !== 'Invalid Date') {
        if (date.getTime() > indicatorUpdateDate.getTime()) {
          date = indicatorUpdateDate;
        }
      }
    }
    const y = date.getFullYear();
    const m = formatDateValue(date.getMonth() + 1);
    const d = formatDateValue(date.getDate());
    return `${y}-${m}-${d}`;
  }, [chooseDate, indicatorUpdateTime]);

  const [searchParams] = useSearchParams();

  return useCallback(
    async (params: Record<string, any> = {}, init: RequestInit = {}) => {
      aborter.current.abort();
      try {
        let url = `${apiEndpoint}${
          apiPath.startsWith('/') ? '' : '/'
        }${apiPath}`;

        const mergedParams = {
          chooseDate: searchParams.get('chooseDate'),
          dateType: searchParams.get('dateType'),
          ...params,
        };

        if (typeof mergedParams.dateType !== 'string') {
          mergedParams.dateType = dateType;
        }

        if (typeof mergedParams.chooseDate !== 'string') {
          mergedParams.chooseDate = formattedChooseDate;
        }

        let body = stringify(mergedParams);

        // console.log(body)
        const method = init.method || 'POST';
        if (method === 'GET') {
          url += `?${body}`;
          body = undefined;
        }
        const res = await fetch(url, {
          method,
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            ...init.headers,
            ...(token
              ? {
                  'X-Access-Token': token,
                }
              : {}),
          },
          body,
        });
        if (!res.ok) {
          if (res.status === 401) {
            setToken(null);
          }
          throw new Error(await res.text());
        }
        const json = await res.json();
        if (json.success) {
          return json.result;
        } else {
          if (json.code === 401) {
            setToken(null);
          }
          throw new Error(json.message);
        }
      } catch (e) {
        throw e;
      }
    },
    [
      apiPath,
      token,
      setToken,
      apiEndpoint,
      formattedChooseDate,
      searchParams,
      dateType,
    ],
  );
}
