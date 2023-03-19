import { useWindowWidth } from '@react-hook/window-size';
import { Collapse, Popup } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { useState, useEffect, useMemo } from 'react';

import { useCurrentApp, useRequest } from '@/tamp';
import { useModel } from 'umi';
import styles from './specificScenarios.module.less';

export const SpecificScenarios = (props) => {
  const { user } = useCurrentApp();
  const { token } = user;

  const [data, setData] = useState([]);
  // 初始选中状态
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<(string | null)[]>();
  useEffect(() => {
    getDataFirst();
  }, []);

  // 获取数据
  const requestDate = useRequest('/scenedetail/sceneDetail/queryTreeList');
  async function getDataFirst() {
    const res = await requestDate(null, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'X-Access-Token': token,
      },
    });
    setData(res.treeList);
    setValue(Array(res.treeList[0].slotTitle));
  }
  // 获取列表展示数据的索引值
  const getIndex = useMemo(() => {
    let num;
    if (data && value) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].slotTitle === value[0]) {
          num = i;
        }
      }
      return num;
    }

    return 0;
  }, [value]);

  function dataList(data) {
    if (data[getIndex] != undefined) {
      return (
        data[getIndex].children &&
        data[getIndex].children.map((item) => {
          return (
            <Collapse.Panel key={item.slotTitle} title={item.slotTitle}>
              {item.children
                ? item.children.map((items, i) => {
                    return (
                      <li
                        key={i}
                        onClick={() => props.scenCallBack(items.slotTitle)}
                      >
                        {items.slotTitle}
                      </li>
                    );
                  })
                : ''}
            </Collapse.Panel>
          );
        })
      );
    }
  }

  function onChange(val) {
    data &&
      data.map((item) => {
        if (item.slotTitle === value[0]) {
          item.children &&
            item.children.map((item1) => {
              if (item1.slotTitle === val) {
                if (!item1.children) {
                  props.scenCallBack(item1.slotTitle);
                }
              }
            });
        }
      });
  }
  return (
    <>
      <div className={styles.scencTitle}>
        <span>具体场景</span>
        <div onClick={() => props.scenCallBack()}>取消</div>
      </div>
      <div className={styles.scencBigTitle}>
        <span>指标场景</span>
        <div onClick={() => setVisible(true)}>
          {value}
          <RightOutline />
        </div>
      </div>

      <Popup
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        position="right"
        bodyStyle={{
          height: '95vh',
          width: useWindowWidth(),
          top: '5vh',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        <div className={styles.scencTitle}>
          <span>具体场景</span>
          <div
            onClick={() => {
              setVisible(false);
            }}
          >
            取消
          </div>
        </div>
        {data && (
          <div className={styles.scen}>
            {data.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setValue([item.slotTitle]);
                    setVisible(false);
                  }}
                >
                  {item.slotTitle}
                </div>
              );
            })}
          </div>
        )}
      </Popup>

      {/* 二级展示 */}

      <Collapse accordion className={styles.outBox} onChange={onChange}>
        {data[0] && dataList(data)}
      </Collapse>
    </>
  );
};
