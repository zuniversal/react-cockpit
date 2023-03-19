import { PubSub } from 'pubsub-js';
import { useEffect } from 'react';
import { useModel } from 'umi';

export default function ReactWebsocket(props) {
  const { userInfo } = useModel('user');
  console.log(' userInfo ： ', userInfo);
  const NOLOG = localStorage.getItem('NOLOG') || 'n';
  if (!userInfo) return props.children;
  const {
    userInfo: { id = null },
  } = userInfo;
  let websocket,
    lockReconnect = false,
    isOpen: boolean = false, //连接状态
    lastHeartcheckTime = new Date(), //最后一次心跳时间
    heartBeatTime = 40, //心跳重建时间
    reconnectTimeOut = null; //重连计时器
  const createWebSocket = (url) => {
    //不重复创建
    if (isOpen) return;
    websocket = new WebSocket(url, [localStorage.getItem('token')]);
    websocket.onopen = function () {
      heartCheck.start();
      lastHeartcheckTime = new Date();
      console.log('websocket连接成功');
      isOpen = true;
    };
    websocket.onerror = function (e) {
      //出错关闭socket
      console.log(e, 'websocket 报错啦!');
      closeWebSocket();
    };
    websocket.onclose = function (e) {
      console.log(
        'websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean,
      );
      isOpen = false;
      lockReconnect = false;
      //断开后重连
      reconnect(url);
    };
    websocket.onmessage = function (event) {
      //event 为服务端传输的消息，在这里可以处理
      const data = JSON.parse(event.data);
      lockReconnect = true;
      const { msgType = 0, cmd, frame } = data;
      //心跳
      if (cmd === 'heartcheck') {
        lastHeartcheckTime = new Date();
      } else if (cmd === 'user' && msgType === '3' && frame === '1') {
        PubSub.publish('message', data);
      } else if (msgType === '5') {
        //msgType=5 告诉前端需要刷新页面
        PubSub.publish('isRefresh', msgType);
      }
    };
  };
  let reconnect = (url) => {
    if (lockReconnect) return;
    //没连接上会一直重连，设置延迟避免请求过多
    reconnectTimeOut && clearTimeout(reconnectTimeOut);
    reconnectTimeOut = setTimeout(function () {
      console.log('重新连接 websocket中,请稍后.');
      heartCheck.reset();
      createWebSocket(url);
      lockReconnect = false;
    }, 2000);
  };
  let heartCheck = {
    timeout: 20000, //20秒
    timeoutObj: null,
    reset() {
      //清除计时器,并且重置状态
      clearInterval(this.timeoutObj);
      return this;
    },
    start() {
      this.timeoutObj = setInterval(function () {
        //这里发送一个心跳，后端收到后，返回一个心跳消息，
        //onmessage拿到返回的心跳就说明连接正常
        const { readyState = 0 } = websocket;
        //心跳监测
        if ((new Date() - lastHeartcheckTime) / 1000 > heartBeatTime) {
          heartCheck.reset();
          closeWebSocket();
          return;
        }
        //连接正常才发送心跳  1 是连接正常
        if (readyState === 1) {
          const { pathname, search } = location;
          websocket.send(pathname === '/' ? '/Home' : pathname + search);
        } else {
          heartCheck.reset();
          closeWebSocket();
        }
      }, this.timeout);
    },
  };
  //关闭连接
  const closeWebSocket = () => {
    console.log('关闭 webscoket');
    lockReconnect = false;
    websocket && websocket.close();
  };

  useEffect(() => {
    createWebSocket(
      `${process.env.WX_WEBSOCKET_URL}/websocket/${id}/ckpt/${NOLOG}`,
    );
  }, []);

  return props.children;
}
