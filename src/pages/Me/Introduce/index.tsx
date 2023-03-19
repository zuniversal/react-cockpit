import { Swiper, WaterMark } from 'antd-mobile';
import { useState, useEffect, useMemo, useRef } from 'react';
// import { useCurrentApp } from '@/contexts/apps/CurrentAppContext';
// import { useRequest } from '@/hooks/useRequest';
import { useCurrentApp, useRequest } from '@/tamp';
import { getUrlParams } from '@/utils';
import style from './index.module.less';
import { useModel } from 'umi';

function Introduce() {
  const url = '/sys/version/function/getVersionFunctionByVersionId';
  const requestDate = useRequest(url);
  const [data, setData] = useState(null);
  // const { user, indicator } = useCurrentApp();
  const { user, indicator } = useModel('user');
  const { userInfo, token } = user;
  const { realname, username } = userInfo.userInfo;
  const { versionIntroList, getVersionIntroListAsync } = useModel('me');
  useEffect(() => {
    getVersionIntroListAsync({ versionId: getUrlParams('id') });
  }, []);

  const textProps = {
    content: `${realname} ${username.substring(
      username.length - 4,
      username.length,
    )}`,
    gapX: 100,
    gapY: 100,
    fontSize: 12,
    fontColor: 'rgba(220, 221, 225, .6)',
    rotate: 0,
  };

  const [props, setProps] = useState<{ [key: string]: any }>(textProps);
  const type = getUrlParams('type');
  // 页面埋点
  const { chooseDate, dateType } = user;
  const requestStart = useRequest(
    '/datapageaccesslog/dataPageAccessLog/addLog',
  );
  const requestEnd = useRequest(
    '/datapageaccesslog/dataPageAccessLog/updateEndTime',
  );
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
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return `${y}-${m}-${d}`;
  }, [chooseDate, indicatorUpdateTime]);
  useEffect(() => {
    console.log('进入版本介绍页面');
    const response = requestStart({
      pageName: '功能介绍页面',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level3',
      requestUrl: '/introduce',
      requestUrlReal: window.location.pathname,
      platform: 'ckpt',
    });
    let id;
    response.then((data) => {
      id = data;
    });
    return () => {
      requestEnd({
        ID: id,
      });
      console.log('退出版本介绍页面');
    };
  }, []);

  // async function getData() {
  //   const res = await requestDate(
  //     {
  //       versionId: getUrlParams('id'),
  //     },
  //     {
  //       method: 'GET',
  //       headers: {
  //         'content-type': 'application/json',
  //         'X-Access-Token': token,
  //       },
  //     }
  //   )
  //   setData(res)
  // }

  const [tabIndex, setTabIndex] = useState(0);

  function handleOnChange(index) {
    setTabIndex(index);
  }

  function handleClick() {
    location.href = versionIntroList[tabIndex].pageUrl;
  }
  const imgRef = useRef();
  const [point, setPoint] = useState([]);
  // 获取触摸点
  function handuleTouchStart(e) {
    if (e.touches.length >= 2) {
      setPoint(e.touches);
    }
    return [];
  }
  // 移动缩放图片
  function handuleTouchMove(e) {
    if (point.length != 0 && e.touches.length >= 2) {
      const start = Math.abs(point[0].pageY - point[1].pageY); //100 300     200
      const end = Math.abs(e.touches[0].pageY - e.touches[1].pageY); //0  500  500
      const imgSize = Math.abs(end - start) * 0.1;
      if (end > start) {
        imgRef.current.style.height = `${imgRef.current.height + imgSize}px`;
      } else if (end < start) {
        imgRef.current.style.height = `${imgRef.current.height - imgSize}px`;
      }
    }
  }
  return (
    <div className={style.introduceBox}>
      <div
        className={style.introduceImg}
        onTouchStart={(e) => handuleTouchStart(e)}
        onTouchMove={(e) => handuleTouchMove(e)}
      >
        <Swiper onIndexChange={handleOnChange}>
          {versionIntroList &&
            versionIntroList.map((item, index) => {
              return (
                <Swiper.Item key={index}>
                  <img src={item.imgUrl} ref={imgRef} />
                </Swiper.Item>
              );
            })}
        </Swiper>
      </div>

      {versionIntroList && (
        <>
          <div className={style.introduceCon}>
            <div className={style.pageNumber}>
              {tabIndex + 1 > 9 ? tabIndex + 1 : `0${tabIndex + 1}`}
            </div>
            <div className={style.pageTitle}>
              {versionIntroList[tabIndex] && versionIntroList[tabIndex].title}
            </div>
            {type !== 'history' && (
              <div className={style.pageTry} onClick={handleClick}>
                试一试 &gt;
              </div>
            )}
          </div>
          <div
            className={style.introduceContent}
            dangerouslySetInnerHTML={{
              __html:
                versionIntroList[tabIndex] &&
                versionIntroList[tabIndex].content,
            }}
          ></div>
        </>
      )}
      <WaterMark {...props} />
    </div>
  );
}

export default Introduce;
