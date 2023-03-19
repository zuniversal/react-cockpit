import { MeasuringStrategy } from '@dnd-kit/core';
import {
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useWindowSize } from '@react-hook/window-size';
import { Card, Toast } from 'antd-mobile';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import { useFollow } from '../../hooks/useFollow';
import { useRequest } from '../../hooks/useRequest';
import { GridContainer } from './Sortable/GridContainer';
import { Handle } from './Sortable/Handle';
import styles from './Sortable/Item.module.less';
import { Remove } from './Sortable/Remove';
import { Sortable } from './Sortable/Sortable';
import { sendBuriedPoint } from '../../utils/index';
import moment from 'moment';
export function AppList() {
  const { user } = useCurrentApp();
  const [editing, setEditing] = useState(false);
  const [windowWidth, windowHeight] = useWindowSize();
  const wrapperWidth = windowWidth - 20;
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });
  const navigate = useNavigate();

  const { followList, updateFollowList, token, appList } = user;

  const requestSort = useRequest('/sysUserFlowIndicator/sort');
  const { unAllFollow } = useFollow();

  const inited = useRef(false);
  const [indicatorIds, setIndicatorIds] = useState<
    {
      id: string;
      index: number;
    }[]
  >([]);
  const [arr, setArr] = useState(
    appList.map((item) => {
      return followList.filter((item1) => {
        return item1.parentId === item.id;
      });
    }),
  );

  const oldArr = appList.map((item) => {
    return followList.filter((item1) => {
      return item1.parentId === item.id;
    });
  });
  useEffect(() => {
    if (!inited.current) {
      inited.current = true;
      setIndicatorIds(
        Array.from({ length: arr.flat().length }, (v, k) => {
          return {
            id: arr.flat()[k].id,
            index: k + 1,
          };
        }),
      );
    }
  }, []);
  const onSearchbarFocus = useCallback(() => {
    navigate('/search');
  }, [navigate]);

  const onSortChange = useCallback(
    async ({ items }: any) => {
      const arr = items.map((item) => {
        return followList[item - 1].title;
      });
      // 事件埋点
      sendBuriedPoint(
        '关注',
        '/home',
        '排序',
        moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
        arr,
      );

      const nextIndicators: { id: string; index: number }[] = [];
      const nextFollowList = [];
      try {
        items.forEach((item) => {
          const prev = indicatorIds.find((item2) => item2.index === item);
          if (prev) {
            nextIndicators.push({ id: prev.id, index: item });
            nextFollowList.push(followList.find((item) => item.id === prev.id));
          }
        });
        setIndicatorIds(nextIndicators);
        await requestSort(
          { indicatorIds: nextIndicators.map((item) => item.id).join(',') },
          { method: 'GET' },
        );
        updateFollowList(nextFollowList);
      } catch (e: any) {
        Toast.show({
          content: e.message,
          duration: 1.5,
        });
      }
    },
    [requestSort, followList, indicatorIds, updateFollowList],
  );
  const [delList, setDelList] = useState(Array);
  // 物理删除
  const delArr = () => {
    // false 编辑    true 完成
    setEditing(!editing); //第一次变成true
    if (editing) {
      unAllFollow({ ids: delList } as any);
      setDelList([]);
    }
  };

  // 逻辑删除
  const onRemove = useCallback(
    async (e, i) => {
      const { index } = e;
      const nextIndicators = indicatorIds.filter((it) => {
        if (it.id !== oldArr[i][index - 1].id) {
          return it;
        } else {
          delList.push(it.id);
        }
      });
      setIndicatorIds(nextIndicators);
    },
    [followList, indicatorIds],
  );

  return (
    <div
      style={{
        background: '#F4F4F4',
        minHeight: windowHeight,
      }}
    >
      <div
        style={{
          padding: 10,
        }}
      >
        {followList.length > 0 && (
          <Card
            title="已关注指标"
            style={{ padding: 0, marginBottom: 12 }}
            headerStyle={{
              paddingLeft: 12,
              paddingRight: 12,
            }}
            bodyStyle={{ padding: 0 }}
            extra={
              <>
                <div
                  style={{
                    color: 'rgba(110, 148, 242, 1)',
                  }}
                  onClick={delArr}
                >
                  {editing ? '完成' : '编辑'}
                </div>
              </>
            }
          >
            {arr.map((item, i) => {
              return (
                <div key={i}>
                  {item.length !== 0 ? (
                    <div>
                      <p style={{ margin: '5px 0 0 16px' }}>
                        {item[i].parentName}
                      </p>
                      <Sortable
                        isDisabled={() => {
                          if (!editing) {
                            return true;
                          }
                          return false;
                        }}
                        handle={editing}
                        itemCount={item.length}
                        adjustScale
                        Container={(props: any) => (
                          <GridContainer {...props} columns={3} />
                        )}
                        strategy={rectSortingStrategy}
                        wrapperStyle={() => ({
                          backgroundColor: '#fff',
                          width: wrapperWidth / 3,
                          height: wrapperWidth / 3,
                        })}
                        animateLayoutChanges={animateLayoutChanges}
                        measuring={{
                          droppable: { strategy: MeasuringStrategy.Always },
                        }}
                        removable={editing}
                        onRemove={(e) => onRemove(e, i)}
                        onChange={onSortChange}
                        renderItem={({
                          dragOverlay,
                          dragging,
                          sorting,
                          index,
                          fadeIn,
                          listeners,
                          ref,
                          style,
                          transform,
                          transition,
                          value,
                          wrapperStyle,
                          color,
                          disabled,
                          removable,
                          handle,
                          onRemove,
                          handleProps,
                        }) => {
                          return (
                            <li
                              className={classNames(
                                styles.Wrapper,
                                fadeIn && styles.fadeIn,
                                sorting && styles.sorting,
                                dragOverlay && styles.dragOverlay,
                              )}
                              style={
                                {
                                  ...wrapperStyle,
                                  transition: [
                                    transition,
                                    wrapperStyle?.transition,
                                  ]
                                    .filter(Boolean)
                                    .join(', '),
                                  '--translate-x': transform
                                    ? `${Math.round(transform.x)}px`
                                    : undefined,
                                  '--translate-y': transform
                                    ? `${Math.round(transform.y)}px`
                                    : undefined,
                                  '--scale-x': transform?.scaleX
                                    ? `${transform.scaleX}`
                                    : undefined,
                                  '--scale-y': transform?.scaleY
                                    ? `${transform.scaleY}`
                                    : undefined,
                                  '--index': index,
                                  '--color': color,
                                } as React.CSSProperties
                              }
                              ref={ref}
                            >
                              <div
                                className={classNames(
                                  styles.Item,
                                  dragging && styles.dragging,
                                  handle && styles.withHandle,
                                  dragOverlay && styles.dragOverlay,
                                  disabled && styles.disabled,
                                  color && styles.color,
                                )}
                                style={style}
                                data-cypress="draggable-item"
                                {...(!handle ? listeners : undefined)}
                                tabIndex={!handle ? 0 : undefined}
                              >
                                {(() => {
                                  const indicatorId = item[index];

                                  const item1 = followList.find(
                                    (app) => app.id === indicatorId?.id,
                                  );
                                  if (!item1) {
                                    return null;
                                  }

                                  return (
                                    <>
                                      <div
                                        style={{
                                          borderRadius: 8,
                                          width: 36,
                                          height: 36,
                                          display: 'flex',
                                          justifyContent: 'center',
                                          alignItems: 'center',
                                          boxSizing: 'border-box',
                                          backgroundColor: '#678EF2',
                                        }}
                                      >
                                        <img
                                          className={styles.icon}
                                          src={item1.icon}
                                          style={{
                                            display: 'block',
                                            width: 20,
                                            height: 20,
                                          }}
                                          alt=""
                                        />
                                      </div>
                                      <div
                                        style={{
                                          fontSize: 14,
                                          height: 32,
                                          lineHeight: '32px',
                                        }}
                                      >
                                        {item1.indicatorName}
                                      </div>
                                    </>
                                  );
                                })()}
                                {(handle || removable) && (
                                  <div
                                    className={styles.Actions}
                                    style={{
                                      position: 'absolute',
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      top: 0,
                                    }}
                                  >
                                    {handle ? (
                                      <Handle
                                        showicon={'false'}
                                        style={{
                                          padding: 10,
                                          position: 'absolute',
                                          width: '100%',
                                          height: '100%',
                                        }}
                                        {...handleProps}
                                        {...listeners}
                                      />
                                    ) : null}
                                    {removable ? (
                                      <Remove
                                        className={styles.Remove}
                                        onClick={onRemove}
                                        style={{
                                          position: 'absolute',
                                          top: 10,
                                          right: 10,
                                          height: 40,
                                          padding: 10,
                                          marginRight: 5,
                                        }}
                                      />
                                    ) : null}
                                  </div>
                                )}
                              </div>
                            </li>
                          );
                        }}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
          </Card>
        )}

        <Card
          bodyStyle={{ padding: 0 }}
          style={{ padding: 0, marginBottom: 12 }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          />
          <div
            onClick={onSearchbarFocus}
            style={{
              width: wrapperWidth / 3,
              height: wrapperWidth / 3,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                borderRadius: 8,
                width: 36,
                height: 36,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
                backgroundColor: '#678EF2',
              }}
            >
              <img
                className={styles.icon}
                src={require('../../assets/metricsicons/m0002.svg')}
                style={{
                  display: 'block',
                  width: 20,
                  height: 20,
                }}
                alt=""
              />
            </div>
            <div
              style={{
                fontSize: 14,
                height: 32,
                lineHeight: '32px',
              }}
            >
              添加指标
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
