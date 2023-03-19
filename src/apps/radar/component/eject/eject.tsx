import { useEffect, useState } from 'react'
import style1 from './eject.module.less'
import { Button, Popup } from 'antd-mobile'
import { telPhone, icon } from '../../importFile'

export function Eject(props) {
  const [dataDetail, setDataDetail] = useState() //拉取催办数据
  useEffect(() => {
    if (props.visible) {
      setDataDetail(props.ejectData)
    }
  }, [props.ejectData])
  return (
    <Popup
      visible={props.visible}
      showCloseButton
      onClose={() => {
        props.closeExhibition(false)
      }}
      bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        minHeight: '500px',
      }}
    >
      <div className={style1.popup}>
        <h2>{props.ejectData.title}</h2>
        <h4 style={{ margin: 0, marginBottom: '12px' }}>
          一级部门名称 - 二级部门名称 - 三级部门名称
        </h4>
        <div style={{ height: '280px', overflow: 'auto' }}>
          {dataDetail &&
            dataDetail.children.map((item, index) => {
              return (
                <div key={index}>
                  <h6
                    style={{
                      fontSize: 10,
                      fontWeight: 400,
                      color: '#999999',
                    }}
                  >
                    {item.company}
                  </h6>
                  <div className={style1.outBox}>
                    {/* 左侧 */}
                    <div className={style1.leftBox}>
                      <img src={item.picture} alt="" />
                      <span>{item.name}</span>
                    </div>
                    {/* 中间 */}
                    <div className={style1.centerBox}>
                      <img src={telPhone} />
                      <span>{item.phone}</span>
                    </div>
                    {/* 右侧 */}
                    <div className={style1.rightBox}>
                      <Button size="small">拨打</Button>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
        {/* 底部催办按钮 */}
        <div className={style1.bottomBox}>
          <div>
            <img src={icon} alt="" />
            <span>催办信息将以短信与经营驾驶舱消息通知进行提醒</span>
          </div>
          <div>
            <Button
              block
              onClick={() => {
                let arr = JSON.parse(localStorage.getItem('hair'))
                arr[props.dial[1]][props.dial[0]] = true
                props.propsHair(arr)
                localStorage.setItem('hair', JSON.stringify(arr))
                props.closeExhibition(false)
              }}
            >
              确定催办
            </Button>
          </div>
        </div>
      </div>
    </Popup>
  )
}
