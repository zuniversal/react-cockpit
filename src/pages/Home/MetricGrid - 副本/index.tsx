import { Card } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCurrentApp } from '../../../contexts/apps/CurrentAppContext';
import { useFollow } from '../../../hooks/useFollow';
// import { removeMertic, updateSort } from '../../../services/home'
import { formatData, formatGridData, preventSelect } from './config';
import styles from './index.module.less';
import { useModel } from 'umi';
import Grid from './Grid';

const CardExtra = (props) => (
  <div className={styles.actionBtnWrapper}>
    <div className={styles.actionBtn} onClick={props.onAddMetric}>
      添加指标
    </div>
    {props.editing ? (
      <div className={styles.actionBtn} onClick={props.onEndEdit}>
        完成
      </div>
    ) : (
      <div className={styles.actionBtn} onClick={props.onStartEdit}>
        编辑
      </div>
    )}
  </div>
);

const MetricGrid = (props) => {
  const { unfollow, unAllFollow } = useFollow();
  const { user } = useModel('user');
  const { userInfo } = user.userInfo;
  const { updateFollowList } = user;
  useEffect(() => {
    preventSelect();
  }, []);
  const formatRes = formatGridData(user);
  const [originList, setOriginList] = useState(formatRes);
  const [removeList, setRemoveList] = useState([]);
  console.log(' removeList ： ', originList, removeList);
  const onRemove = (params) => {
    console.log(' onRemove    ： ', params); //
    const { removeItem, filterData, groupIndex } = params;

    const sortListRes = originList.map((item, index) =>
      index === groupIndex ? { ...item, focusList: filterData } : item,
    );
    console.log(' sortListRes  dataList  ： ', sortListRes); //
    setOriginList(sortListRes);
    setRemoveList([...removeList, removeItem]);
  };
  console.log(' originList, originData  ： ', originList, removeList);

  const navigate = useNavigate();
  const onAddMetric = () => {
    navigate('/search');
  };

  const [editing, setEditing] = useState(false);
  const onStartEdit = () => {
    setEditing(true);
  };
  const onEndEdit = async () => {
    console.log(' onEndEdit    ： ', editing, originList);
    setEditing(false);
    const sortResList = [];
    originList.forEach((v) => sortResList.push(...v.focusList));
    console.log(' sortResList ： ', sortResList, removeList);
    const params = {
      userId: userInfo.id,
      indicatorIds: removeList.map((v) => v.id).join(),
    };
    console.log('  params ：', params);
    if (removeList.length) {
      // const removeRes = await removeMertic(params)
      // removeList.forEach(unfollow)
      unAllFollow({ ids: removeList.map((v) => v.id).join() });
    }
    // const updateRes = await updateSort({
    //   indicatorIds: sortResList.map((v) => v.id).join(),
    // })
    updateFollowList(sortResList);
    setRemoveList([]);
  };
  const onSortEnd = (params) => {
    console.log(' onSortEnd    ： ', params);
    const { groupIndex, sortRes } = params;
    const sortListRes = originList.map((item, index) =>
      // index === groupIndex ? { ...item, child: sortRes } : item
      index === groupIndex ? { ...item, focusList: sortRes } : item,
    );
    console.log(' sortListRes  dataList  ： ', sortListRes); //
    setOriginList(sortListRes);
  };
  const onRemoveItem = (params) => {
    console.log(' onRemoveItem    ： ', params); //
    const { removeRes, groupIndex, removeItem } = params;

    const sortListRes = originList.map((item, index) =>
      index === groupIndex ? removeRes : item,
    );
    console.log(
      ' sortListRes  dataList  ： ',
      sortListRes,
      removeItem,
      removeList,
    );
    // setOriginList(sortListRes);
    setRemoveList([...removeList, removeItem]);
  };

  const extra = (
    <CardExtra
      editing={editing}
      onAddMetric={onAddMetric}
      onEndEdit={onEndEdit}
      onStartEdit={onStartEdit}
    />
  );

  return (
    <div className={styles.metricGrid}>
      <div className={styles.headerRow}>
        <div className={styles.actionWrapper}>
          <div className={styles.title}>已关注指标</div>
          <div className={styles.btnWrapper}>{extra}</div>
        </div>
      </div>
      <Card bodyStyle={{ padding: 0 }}>
        {originList.map((item, groupIndex) => (
          <div className="" key={item.id}>
            {item.focusList.length ? (
              <div className={styles.subTitle}>{item.indicatorName}</div>
            ) : null}
            <Grid
              dataSource={item.focusList}
              onRemoveItem={onRemoveItem}
              onSortEnd={onSortEnd}
              groupIndex={groupIndex}
              editing={editing}
            />
          </div>
        ))}
      </Card>
    </div>
  );
};

export default MetricGrid;
