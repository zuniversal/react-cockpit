import { Card, WaterMark, Badge, Button, Modal } from 'antd-mobile';
import { RightOutline, QuestionCircleFill } from 'antd-mobile-icons';
import moment from 'moment';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'umi';

import Intersect from '@/assets/me/Intersect.svg';
import avatar1 from '@/assets/me/avatar.svg';
import date from '@/assets/me/date.svg';
import dateActive from '@/assets/me/dateActive.svg';
import message from '@/assets/me/message.svg';
import no1 from '@/assets/me/no1.svg';
import no2 from '@/assets/me/no2.svg';
import no3 from '@/assets/me/no3.svg';
import repeat from '@/assets/me/repeat.svg';
import empty from '@/assets/me/version/noData.svg';

import skinIcon from '@/assets/me/skin.svg';
import versionIcon from '@/assets/me/version.svg';
import powerIcon from '@/assets/me/power.svg';
import helpIcon from '@/assets/me/help.svg';
import questionIcon from '@/assets/me/question.svg';

import { DatePicker } from '@/components/datePicker';
// import { useCurrentApp } from '@/contexts/apps/CurrentAppContext'
// import { useRequest } from '@/hooks/useRequest'
import { sendBuriedPoint } from '@/utils/index';
import { Empty } from '@/apps/empty/index';
import style from './index.module.less';
import { useModel } from 'umi';
import { getCurrentVersion, getRankingUserList } from '@/services/me';
import { useCurrentApp, useRequest } from '@/tamp';

const menusData = [
  {
    title: '皮肤中心',
    imgUrl: skinIcon,
    router: '/skinCenter',
  },
  {
    title: '版本信息',
    imgUrl: versionIcon,
    router: '/version',
  },
  {
    title: '权限说明',
    imgUrl: powerIcon,
    router: '/power',
  },
  {
    title: '问题帮助',
    imgUrl: helpIcon,
    router: '/help',
  },
  {
    title: '用户体验调研',
    imgUrl: questionIcon,
    router: '/userExperienceSurvey',
  },
];

function Me(defProps) {
  console.log(' MeMe ： ', defProps); //
  const { user, indicator } = useModel('user');
  const { userInfo, token } = user;
  console.log(' userInfo ： ', userInfo, useModel('user')); //
  useEffect(() => {
    // console.log(' meData.getRankingUserAsync.run ： ', meData.getRankingUserAsync.run({
    //   name: 'zyb',
    // })   )//
    // meData.getRepoAsync()
  }, []);
  const [order, setOrder] = useState(1);
  const navigate = useNavigate();
  // const { user, indicator } = useCurrentApp();
  // const { userInfo, token } = user
  const url = '/datapageaccesslog/dataPageAccessLog/rankingUserList';
  const urlUser = '/datapageaccesslog/dataPageAccessLog/rankingUser';
  const requestDate = useRequest(url);
  const requestDateUser = useRequest(urlUser);
  const requestVersion = useRequest('/sys/version/getSysPortalVersion');
  const [currentData, setCurrentData] = useState();
  interface dataTopFace {
    visitNumber: string;
    visitTime: string;
    ranking: string;
  }
  // const [currentDataTop, setCurrentDataTop] = useState<dataTopFace>()
  const { realname, username, avatar, post } = userInfo.userInfo;
  const [list, setList] = useState([]);
  // const [version, setVersion] = useState();
  const [visible, setVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const modalHtml = `<p>访问次数：用户进入经营驾驶舱即算一次，2分钟之内多次进入不重复计数</p>
  <p>访问时长：用户在经营驾驶舱访问的时长</p>
  <p>排名刷新频率：每5分钟</p>`;
  const textProps = {
    content: `${realname} ${username?.substring(
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

  const {
    // currentData,
    version,

    currentDataTop,
    getRankingUserAsync,

    getRankingUserListAsync,
    allNoticeList,
    getAllNoticeAsync,
    getCurrentVersionAsync,
    getLastestVersionAsync,
  } = useModel('me');
  console.log(' useModel ： ', useModel('me')); //
  // meData.getRankingUserAsync
  useEffect(() => {
    getRankingUserAsync({
      orderBy: order,
      visitTime: moment(new Date(changeDateTime.current)).format('YYYYMM'),
    });
    getRankingUserListAsync({
      orderBy: order,
      visitTime: moment(new Date(changeDateTime.current)).format('YYYYMM'),
    });
    getAllNoticeAsync({
      id: userInfo.userInfo.id,
    });
    getCurrentVersionAsync({ productType: 1 });
    getLastestVersionAsync();
  }, []);

  const { dateType } = user;
  // const currentTime = new Date()
  const currentTime = useMemo(() => {
    return new Date();
  }, []);
  const [changeDate, setChangeDate] = useState(currentTime);

  const changeDateTime = useRef(changeDate);
  // async function getData(status = false) {
  //   const res = await requestDate(
  //     {
  //       orderBy: order,
  //       visitTime: moment(new Date(changeDateTime.current)).format('YYYYMM'),
  //     },
  //     {
  //       method: 'GET',
  //       headers: {
  //         'content-type': 'application/json',
  //         'X-Access-Token': token,
  //       },
  //     },
  //   );
  //   // setCurrentData(res)
  // }
  async function getData(status = false) {
    // setCurrentData(res)
    const res = await getRankingUserList({
      orderBy: order,
      visitTime: moment(new Date(changeDateTime.current)).format('YYYYMM'),
    });
    console.log(' getRankingUserList res ：', res); //
    setCurrentData(res);
  }
  async function getDataUser() {
    const res = await requestDateUser(
      {
        orderBy: '1',
        visitTime: moment(new Date(changeDateTime.current)).format('YYYYMM'),
      },
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'X-Access-Token': token,
        },
      },
    );
    // setCurrentDataTop(res)
  }
  const isCurrent = useMemo(() => {
    return (
      moment(new Date(changeDate)).format('YYYYMM') ===
      moment(new Date(currentTime)).format('YYYYMM')
    );
  }, [changeDate, currentTime]);
  useEffect(() => {
    changeDateTime.current = changeDate;
    getData();
  }, [changeDate]);
  useEffect(() => {
    // getDataUser();
    // getData1();
    // getCurrentVersion();
    // getVersion();
  }, []);
  // 页面埋点

  const requestStart = useRequest(
    '/datapageaccesslog/dataPageAccessLog/addLog',
  );
  const requestEnd = useRequest(
    '/datapageaccesslog/dataPageAccessLog/updateEndTime',
  );
  const indicatorUpdateTime = indicator?.updateTime;
  const formattedChooseDate = useMemo(() => {
    let date = changeDate;
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
  }, [changeDate, indicatorUpdateTime]);

  useEffect(() => {
    console.log('进入我的页面');
    const response = requestStart({
      pageName: '我的页面',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level1',
      requestUrl: '/me',
      requestUrlReal: window.location.pathname,
      platform: 'ckpt',
    });
    let id;
    response.then((data) => {
      id = data;
    });
    window.scrollTo(0, 0);
    return () => {
      requestEnd({
        ID: id,
      });
      console.log('退出关注页面');
    };
  }, []);

  // async function getVersion() {
  //   const res = await fetch(
  //     '/api/sys/annountCement/lastVersionUpdateBulletFrame',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Access-Token': token,
  //       },
  //     },
  //   );
  // }

  // // 获取当前版本信息
  // async function getCurrentVersion() {
  //   const res = await requestVersion(
  //     {
  //       productType: 1,
  //     },
  //     {
  //       method: 'GET',
  //       headers: {
  //         'content-type': 'application/json',
  //         'X-Access-Token': token,
  //       },
  //     },
  //   );
  //   setVersion(res.releaseVersion);
  // }

  function handleOnClickSort() {
    // 事件埋点
    sendBuriedPoint(
      '我的',
      'me',
      '排序',
      moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
      `我的 ${order === 1 ? '升序' : '降序'}`,
    );
    if (currentData && currentData.length) {
      const newData = JSON.parse(JSON.stringify(currentData));
      newData.sort(function (a, b) {
        if (order === 1) {
          return b.ranking - a.ranking;
        } else {
          return a.ranking - b.ranking;
        }
      });

      setCurrentData(newData);
      if (order === 1) {
        setOrder(2);
      } else {
        setOrder(1);
      }
    }
  }

  function handleOnPage(url) {
    navigate(url);
  }
  // 查询所有类型消息通知
  const requestDate1 = useRequest(
    '/sys/sysAnnouncementSend/getMyAnnouncementSend',
  );
  // async function getData1() {
  //   const res = await requestDate1(
  //     {
  //       id: userInfo.userInfo.id,
  //     },
  //     {
  //       method: 'GET',
  //       headers: {
  //         'content-type': 'application/json',
  //         'X-Access-Token': token,
  //       },
  //     },
  //   );
  //   setList(res);
  // }
  function getNewsNum(allNoticeList) {
    let num = 0;
    if (list.records !== undefined) {
      list.records.map((item) => {
        if (item.readFlag === '0') {
          num++;
        }
      });
    }
    localStorage.setItem('newsAmount', `${num}`);
    return num;
  }
  return (
    <>
      {/* 头部 */}
      <div className={style.meHeader}>
        <div className={style.info}>
          <img src={avatar ? avatar : avatar1} />
          <div>
            <div className={style.name}>{realname}</div>
            <div>岗位：{post ? post : '暂无'}</div>
          </div>
        </div>
        <div className={style.summary}>
          <div>
            <div className={style.number}>
              {currentDataTop && currentDataTop.visitNumber}
            </div>
            <div>当月访问次数</div>
          </div>
          <div>
            <div className={style.number}>
              {currentDataTop && currentDataTop.visitTime}m
            </div>
            <div>当月访问时长</div>
          </div>
          <div>
            <div className={style.number}>
              {currentDataTop && currentDataTop.ranking}
            </div>
            <div>综合排名</div>
          </div>
        </div>
      </div>

      {/* 排名 */}
      <div className={style.ranking}>
        <div className={style.rankingTop}>
          <div className={style.rankingTitle}>
            <Button
              style={{
                height: 24,
                width: 22,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                '--border-color': 'transparent',
                '--background-color': 'transparent',
                marginRight: '3px',
              }}
              onClick={() => {
                setVisible(true);
              }}
            >
              <QuestionCircleFill
                fontSize={16}
                color="rgba(139, 146, 158, 1)"
              />
            </Button>
            <span>
              {isCurrent
                ? '当'
                : Number(moment(new Date(changeDate)).format('MM'))}
              月访问排名
            </span>
            <span className={style.titleTips}>根据访问次数排名</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div
              className={`${style.rankingBtn}  ${
                !isCurrent ? style.rankingBtnAction : ''
              }`}
              onClick={() => {
                setDatePickerVisible(true);
              }}
            >
              <img src={isCurrent ? date : dateActive} />
              <span>历史</span>
            </div>
            <div className={style.rankingBtn} onClick={handleOnClickSort}>
              <img src={repeat} />
              <span>{order === 1 ? '降' : '升'}序</span>
            </div>
          </div>
        </div>

        <div className={style.rankingListBox}>
          {currentData && currentData.length ? (
            currentData.map((item, index) => {
              return (
                <div
                  className={
                    currentDataTop && currentDataTop.userId === item.userId
                      ? `${style.rankingList} ${style.rankingListActive}`
                      : style.rankingList
                  }
                  key={index}
                >
                  <div className={style.listLeft}>
                    {item.ranking === 1 && (
                      <img className={style.noImg} src={no1} />
                    )}
                    {item.ranking === 2 && (
                      <img className={style.noImg} src={no2} />
                    )}
                    {item.ranking === 3 && (
                      <img className={style.noImg} src={no3} />
                    )}
                    {![1, 2, 3].includes(item.ranking) && (
                      <span>{item.ranking}</span>
                    )}
                    <img
                      className={style.listAvatar}
                      src={item.avatar || Intersect}
                    />
                    <div>
                      <div className={style.listName}>{item.realName}</div>
                      <div>
                        {item.sectorName
                          ? item.sectorName.length <= 9
                            ? item.sectorName
                            : `${item.sectorName.substring(0, 9)}...`
                          : '暂无'}
                      </div>
                    </div>
                  </div>
                  <div className={style.listRight}>
                    <div className={style.listRightCon}>
                      <div className={style.rightTitle}>
                        {item.visitNumber}
                        <span>次</span>
                      </div>
                      <div>月访问</div>
                    </div>
                    <div>
                      <div className={style.rightTitle}>
                        {item.visitTime}
                        <span>m</span>
                      </div>
                      <div>月访问</div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <Empty src={empty} marginTop="40">
              暂无用户访问数据
            </Empty>
          )}
        </div>
      </div>
      {/* 导航菜单 */}
      <div className={style.navLists}>
        <Card
          title={
            <div
              style={{
                fontWeight: 'normal',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img src={message} style={{ marginRight: '8px' }} />
              消息通知
              {/* 这里加入消息未读数量  */}
              {getNewsNum(allNoticeList) === 0 ? (
                ''
              ) : (
                <Badge content={getNewsNum(allNoticeList)} bordered />
              )}
            </div>
          }
          extra={<RightOutline />}
          onHeaderClick={() => handleOnPage('/notify')}
        />
      </div>

      <div className={style.navLists}>
        {menusData.map((item, index) => {
          return (
            <Card
              key={index}
              title={
                <div
                  style={{
                    fontWeight: 'normal',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <img src={item.imgUrl} style={{ marginRight: '8px' }} />
                  {item.title}
                </div>
              }
              extra={
                <div>
                  {item.title === '版本信息' ? `Version ${version}` : ''}
                  <RightOutline />
                </div>
              }
              onHeaderClick={() => handleOnPage(item.router)}
            />
          );
        })}
      </div>

      <Modal
        visible={visible}
        title={
          <div style={{ textAlign: 'left' }}>
            <QuestionCircleFill fontSize={18} color="rgba(139, 146, 158, 1)" />
          </div>
        }
        content={
          <div
            dangerouslySetInnerHTML={{ __html: modalHtml }}
            style={{
              fontWeight: 500,
              minWidth: 233,
              minHeight: 50,
              marginBottom: 12,
            }}
          />
        }
        closeOnAction
        onClose={() => {
          setVisible(false);
        }}
        actions={[
          {
            key: 'confirm',
            text: '我知道了',
          },
        ]}
      />

      <DatePicker
        visible={datePickerVisible}
        value={changeDate}
        dateType="b"
        onClose={(val) => {
          setDatePickerVisible(val);
        }}
        onChange={(val) => {
          setChangeDate(val);
        }}
      />

      <WaterMark {...props} />
    </>
  );
}

export default Me;
