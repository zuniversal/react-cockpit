import { MeasuringStrategy } from '@dnd-kit/core';
import {
  SortableContext,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ActionSheet, Button, Card } from 'antd-mobile';
import { ChatCheckOutline } from 'antd-mobile-icons';
import classNames from 'classnames';
import moment from 'moment';
import { forwardRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppLoader } from '../../contexts/apps/AppLoader';
import { useCurrentApp } from '../../contexts/apps/CurrentAppContext';
import styles from './FollowList.module.less';
import { MetricCardTitle } from './MetricCardTitle';
import { Sortable } from './Sortable/Sortable';
import { sendBuriedPoint } from '../../utils/index';
const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

function Item(props: any) {
  const {
    item,
    date,
    sorting,
    navigateToDetail,
    setUnfollowVisible,
    setUnfollowTitle,
  } = props;
  const { user, apps } = useCurrentApp();
  const { token } = user;
  return (
    <Card
      key={item.metricId}
      headerStyle={{
        borderBottomWidth: 0,
        paddingTop: 20,
        alignItems: 'flex-start',
      }}
      title={<MetricCardTitle date={item.updateTime} item={item} />}
      extra={
        <Button
          onClick={() => {
            setUnfollowVisible(true);
            setUnfollowTitle(`您是否不再关注${item.title}`);
          }}
          style={{
            height: 25,
            '--background-color': 'transparent',
            '--text-color': 'rgba(147, 150, 169, 1)',
            paddingTop: 0,
            paddingBottom: 0,
            '--border-color': 'rgba(211, 211, 211, 1)',
            fontSize: 12,
            '--border-radius': '20px',
          }}
        >
          <ChatCheckOutline color="rgba(147, 150, 169, 1)" />
          已关注
        </Button>
      }
      style={{ marginBottom: 12 }}
    >
      {!sorting && (
        <AppLoader
          appName={item.appName}
          mode="card"
          user={user}
          apps={apps}
          navigateToDetail={navigateToDetail}
        />
      )}
    </Card>
  );
}

export const Container = forwardRef<HTMLDivElement, any>(
  ({ children, style }: any, ref) => {
    return (
      <div ref={ref} style={style}>
        {children}
      </div>
    );
  },
);

export function FollowList() {
  const [unfollowVisible, setUnfollowVisible] = useState(false);
  const [unfollowTitle, setUnfollowTitle] = useState('');
  const { user, date } = useCurrentApp();

  const { currentMetricGroup, appList } = user;

  const currentAppList = useMemo(() => {
    const current = appList.find((item) => item.id === currentMetricGroup[0]);
    return (current.children || [])
      .filter((item) => {
        return !!item.frontComponent && !!item.title;
      })
      .map((item) => {
        const { frontComponent, title, indicatorDesc: desc } = item;
        const metricId = frontComponent.slice('/metrics/'.length);
        return {
          metricId,
          appName: metricId,
          title,
          desc,
        };
      });
  }, [currentMetricGroup, appList]);

  console.log({ currentAppList });

  const navigate = useNavigate();
  return (
    <div
      style={{
        background: '#F4F4F4',
        padding: 10,
      }}
    >
      <Sortable
        itemCount={currentAppList.length}
        adjustScale
        strategy={verticalListSortingStrategy}
        animateLayoutChanges={animateLayoutChanges}
        activationConstraint={{
          delay: 250,
          tolerance: 5,
        }}
        style={{
          display: 'block',
        }}
        Container={Container}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
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
          const item = currentAppList[index];
          const navigateToDetail = (params = {}, options = {}) => {
            const url = new URL(location.origin);
            url.pathname = `/metrics/${item.metricId}/detail`;
            for (const key in params) {
              url.searchParams.set(key, params[key]);
            }
            navigate(url.toString().slice(location.origin.length), options);
          };

          return (
            <div
              className={classNames(
                styles.Wrapper,
                styles.WrapperOverride,
                fadeIn && styles.fadeIn,
                sorting && styles.sorting,
                dragOverlay && styles.dragOverlay,
              )}
              style={
                {
                  ...wrapperStyle,
                  transition: [transition, wrapperStyle?.transition]
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
                  styles.ItemOverride,
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
                <Item
                  sorting={sorting}
                  item={item}
                  date={date}
                  navigateToDetail={navigateToDetail}
                  setUnfollowVisible={setUnfollowVisible}
                  setUnfollowTitle={setUnfollowTitle}
                />
              </div>
            </div>
          );
        }}
      />

      <ActionSheet
        extra={unfollowTitle}
        cancelText="取消"
        visible={unfollowVisible}
        actions={[
          { text: '不再关注', key: 'unfollow', danger: true },
          { text: '仍然关注', key: 'follow' },
        ]}
        onAction={(action) => {
          setUnfollowVisible(false);

          if (action.key === 'unfollow') {
            // TODO 取消关注
            console.log(action);
          }
        }}
        onClose={() => {
          setUnfollowVisible(false);
        }}
      />
    </div>
  );
}
