import React, { useState } from 'react';

import { DemoDualAxes } from './Pie';
import { DemoDualAxes1 } from './Pie1';
import style1 from './detailMode.module.less';

export function DetailMode() {
  const [title, setTitle] = useState<string>('');

  //   const getChildTitle = (val: string) => {
  //     setTitle(val)
  //   }

  return (
    <>
      <div className={style1.box}>
        <div className={style1.topBox}>
          <div className={style1.topBox_list}>
            <DemoDualAxes />
          </div>
          <div className={style1.legendList} style={{ padding: '6px 16%' }}>
            <div>
              <span style={{ background: '#707E9D' }} />
              其他费用
            </div>
            <div>
              <span style={{ background: '#5FCABB' }} />
              福利费用
            </div>
            <div>
              <span style={{ background: '#5183FD' }} />
              薪资成本
            </div>
          </div>
        </div>
        <div className={style1.bottomBox}>
          <DemoDualAxes1 />

          <div className={style1.legendList} style={{ padding: '6px 16%' }}>
            <div>
              <span style={{ background: '#707E9D' }} />
              其他费用
            </div>
            <div>
              <span style={{ background: '#5FCABB' }} />
              福利费用
            </div>
            <div>
              <span style={{ background: '#5183FD' }} />
              薪资成本
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailMode;
