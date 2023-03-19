import { ActionSheet, Button, Empty, InfiniteScroll, Toast } from 'antd-mobile';
import { ToastHandler } from 'antd-mobile/es/components/toast';
import { arrayMoveImmutable } from 'array-move';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { isButtonElement } from 'react-router-dom/dist/dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

// import { useCurrentApp } from '../contexts/apps/CurrentAppContext'
import { useModel } from 'umi';
import { useFollow } from '../../hooks/useFollow';
import { useRequest } from '../../hooks/useRequest';
import { debounce } from '../../utils';
import { MetricCard } from './MetricCard';
import styles from './styles.module.less';
import { sendBuriedPoint } from '../../utils/index';
import moment from 'moment';

const SortableItem = SortableElement<any>((props) => <MetricCard {...props} />);

const SortableList = SortableContainer(({ items, ...itemProps }) => {
  return (
    <div>
      {items.map((item, index) => (
        <SortableItem
          key={`item-${item.metricId}`}
          index={index}
          {...item}
          {...itemProps}
        />
      ))}
    </div>
  );
});

function DefaultList(props) {
  const { items, ...cardProps } = props;
  try {
    // return items.map((item) => {
    return items.slice(0, 13).map((item) => {
      // return [items[0]].map((item) => {
      return <MetricCard key={item.metricId} {...item} {...cardProps} />;
    });
  } catch (error) {}
}

export function FollowList() {
  const [unfollowVisible, setUnfollowVisible] = useState({
    visible: false,
    item: null,
  });
  const [unfollowTitle, setUnfollowTitle] = useState('');
  // const { user, indicator } = useCurrentApp()
  const { user, indicator } = useModel('user');
  const { currentOriginFollowList, updateFollowList } = user;
  const { unfollow } = useFollow();
  const [cardMode, setCardMode] = useState<'default' | 'sorting'>('default');
  const List = cardMode === 'default' ? DefaultList : SortableList;
  const requestSort = useRequest('/sysUserFlowIndicator/sort');
  const [hasMore, setHasMore] = useState(true);
  const [allOriginFollowListData, setAllOriginFollowListData] = useState(
    split_array(currentOriginFollowList, 1),
  );
  const [currentOriginFollowListNewData, setCurrentOriginFollowListNewData] =
    useState(allOriginFollowListData[0]);
  const [pageNum, setPageNum] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const array = [];
    currentOriginFollowListNewData &&
      currentOriginFollowListNewData.forEach((item) => {
        currentOriginFollowList.forEach((element) => {
          if (item.id === element.id) {
            array.push(item);
          }
        });
      });
    setCurrentOriginFollowListNewData(array);
  }, [currentOriginFollowList]);

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
    let id;
    const response = requestStart({
      pageName: '关注页',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      requestUrl: '/Home',
      accessDepth: 'level1',
      requestUrlReal: '/Home',
      platform: 'ckpt',
    });
    response.then((data) => {
      id = data;
    });
    return () => {
      requestEnd({
        ID: id,
      });
      console.log('退出关注页面');
    };
  }, []);

  function split_array(arr, len) {
    const a_len = arr.length;
    const result = [];
    for (let i = 0; i < a_len; i += len) {
      result.push(arr.slice(i, i + len));
    }
    return result;
  }

  function getData() {
    setPageNum(pageNum + 1);
    return allOriginFollowListData[pageNum + 1] || [];
  }

  async function loadMore() {
    const append = await getData();
    setCurrentOriginFollowListNewData((val) => {
      try {
        return [...val, ...append];
      } catch (error) {}
    });
    setHasMore(append.length > 0);
  }

  const toaster = useRef<ToastHandler>();
  useEffect(() => {
    if (cardMode === 'sorting') {
      toaster.current = Toast.show({
        content: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: '#eee' }}>
              拖动卡片进行排序
            </div>
            <div style={{ width: 20 }} />
            <Button
              onClick={() => {
                setCardMode('default');
                toaster.current?.close();
              }}
              style={{
                padding: '5px',
                height: '30px',
                fontSize: '12px',
                '--background-color': '#4c9ffe',
                '--border-color': '#4c9ffe',
                color: '#fff',
              }}
            >
              完成
            </Button>
          </div>
        ),
        position: 'bottom',
        maskClassName: styles.toaster,
        duration: 0,
      });
    }

    return () => {
      toaster.current?.close();
    };
  }, [cardMode]);

  const onSortEnd = useCallback(
    async ({ oldIndex, newIndex }: any) => {
      try {
        const items: any[] = arrayMoveImmutable(
          currentOriginFollowList,
          oldIndex,
          newIndex,
        );
        updateFollowList(items);

        await requestSort(
          { indicatorIds: items.map((item) => item.id).join(',') },
          { method: 'GET' },
        );
      } catch (e: any) {
        Toast.show({
          content: e.message,
          duration: 1.5,
        });
      }
    },
    [currentOriginFollowList, requestSort, updateFollowList],
  );

  return (
    <div
      style={{
        background: '#F4F4F4',
        padding: 10,
      }}
    >
      {currentOriginFollowList.length === 0 && (
        <div
          style={{
            minHeight: '90vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Empty
            image={require('../../assets/icons/empty1.svg')}
            imageStyle={{ width: '35vw' }}
            description={
              <div>
                <div
                  style={{
                    textAlign: 'center',
                    lineHeight: '60px',
                    fontSize: 18,
                    color: '#34343F',
                    fontWeight: 'bold',
                  }}
                >
                  请添加指标
                </div>
                <div style={{ textAlign: 'center', lineHeight: '22px' }}>
                  <div>您还没有关注指标</div>
                  <div>请前往指标库关注</div>
                </div>
                <Button
                  onClick={() => {
                    navigate('/search');
                  }}
                  style={{
                    width: '175px',
                    height: '44px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    '--background-color': '#678EF2',
                    '--border-color': '#678EF2',
                    color: '#fff',
                    marginTop: '120px',
                  }}
                >
                  指标库添加
                </Button>
              </div>
            }
          />
        </div>
      )}
      <List
        items={currentOriginFollowList}
        // items={currentOriginFollowListNewData}
        setCardMode={setCardMode}
        cardMode={cardMode}
        lockAxis="y"
        onSortEnd={onSortEnd}
        setUnfollowVisible={setUnfollowVisible}
        setUnfollowTitle={setUnfollowTitle}
        pressDelay={300}
        onSortStart={() => {
          console.log(' onSortStart ： ');
          document.oncontextmenu = function (e) {
            e.preventDefault();
          };
          document.onselectstart = function (e) {
            e.preventDefault();
          };
          //安卓
          document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
          });
          window.ontouchstart = function (e) {
            e.preventDefault();
          };
          document.body.addEventListener('touchstart', function () {});
          document.body.onbeforecopy = function () {
            window.getSelection().removeAllRanges();
          };
          document.body.oncopy = function () {
            window.getSelection().removeAllRanges();
            return false;
          };
        }}
      />
      {/* <InfiniteScroll loadMore={loadMore} hasMore={hasMore} /> */}
      <ActionSheet
        extra={unfollowTitle}
        cancelText="取消"
        visible={unfollowVisible.visible}
        actions={[
          { text: '不再关注', key: 'unfollow', danger: true },
          { text: '仍然关注', key: 'follow' },
        ]}
        onAction={(action) => {
          setUnfollowVisible({ visible: false, item: null });
          if (action.key === 'unfollow') {
            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '取消关注',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `${unfollowVisible.item.indicatorName} 取消关注`,
            );

            Toast.show('正在取消关注...');
            unfollow(unfollowVisible.item);
          } else if (action.key === 'follow') {
            // 事件埋点
            sendBuriedPoint(
              '关注',
              '/home',
              '取消关注',
              moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
              `${unfollowVisible.item.indicatorName} 仍然关注`,
            );
          }
        }}
        onClose={() => setUnfollowVisible({ visible: false, item: null })}
      />
    </div>
  );
}
