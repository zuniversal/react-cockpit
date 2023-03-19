import {
  TextArea,
  List,
  Button,
  WaterMark,
  Toast,
  Popup,
  ImageUploader,
} from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import { ImageUploadItem } from 'antd-mobile/es/components/image-uploader';
import lrz from 'lrz';
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// import { useCurrentApp } from '../../contexts/apps/CurrentAppContext'
// import { useRequest } from '../../hooks/useRequest'
import { useCurrentApp, useRequest } from '@/tamp';
import { useModel } from 'umi';
import styles from './index.module.less';
import { SpecificScenarios } from './specificScenarios';

function ProblemFeedback() {
  const [bodyHeight, setBodyHeight] = useState(0);
  const navigate = useNavigate();
  const { user, indicator } = useModel('user');
  // const { user, indicator } = useCurrentApp()
  const { userInfo, token } = user;
  const { addFeedbackAsync } = useModel('me');
  const { realname, username } = userInfo.userInfo;
  const [isFlag, setIsFlag] = useState(false); // 提交按钮做防重复点击

  useEffect(() => {
    setBodyHeight(document.body.clientHeight);
  }, []);

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
    console.log('进入问题反馈页面');
    const response = requestStart({
      pageName: '问题反馈',
      requestParam: JSON.stringify({
        chooseDate: formattedChooseDate,
        dateType,
      }),
      accessDepth: 'level3',
      requestUrl: '/problemFeedback',
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
      console.log('退出问题反馈页面');
    };
  }, []);

  function handleClick(url) {
    navigate(url);
  }
  const [title, setTitle] = useState();
  const [longTextArea, setLongTextArea] = useState();
  const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(1);
  const [type, setType] = useState();

  // 场景弹窗的返回数据
  function scenCallBack(value) {
    setVisible(false);
    value && setType(value);
  }

  // 文件图片
  async function uploadData(file) {
    const rst = await lrz(file, { quality: 0.1 });
    const formData = new FormData();
    formData.append('biz', 'temp');
    formData.append('file', rst.file);
    const res = await fetch('api/sys/common/upload', {
      method: 'POST',
      headers: {
        'X-Access-Token': token,
      },
      body: formData,
    });
    const json = await res.json();
    if (!json.success) {
      Toast.show(json.detailInfo);
    }
    return {
      url: json.message,
    };
  }

  // 提交反馈内容
  async function getData() {
    const img = [];
    fileList &&
      fileList.map((item) => {
        img.push(item.url);
      });
    const res = await fetch('api/feedback/feedbackProblem/addUserFeedBack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': token,
      },
      body: JSON.stringify({
        // 此处提交带标题的保存
        problemName: title,
        problemContent: longTextArea,
        imgUrlPicture: img.join(),
        scene: type,
      }),
    });
    const json = await res.json();
    Toast.show({
      content: json.message,
    });
    setIsFlag(false);
    if (json.success) {
      sessionStorage.clear();
      handleClick('/help');
    }
  }
  const submit = async () => {
    const img = [];
    fileList &&
      fileList.map((item) => {
        img.push(item.url);
      });
    const res = await addFeedbackAsync({
      problemName: title,
      problemContent: longTextArea,
      imgUrlPicture: img.join(),
      scene: type,
    });
    console.log(' await的结果： ： ');
  };
  // 水印
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

  // 提示框
  function message() {
    if (!title) {
      Toast.show({
        content: '反馈主题不能为空',
        position: 'top',
      });
    } else if (!longTextArea) {
      Toast.show({
        content: '反馈内容不能为空',
        position: 'top',
      });
    } else {
      if (!isFlag) {
        setIsFlag(true);

        getData();
      } else {
        Toast.show({
          content: '请勿重复提交',
        });
      }
    }
  }
  const [props, setProps] = useState<{ [key: string]: any }>(textProps);

  return (
    <div className={styles.topBox} style={{ height: bodyHeight + 'px' }}>
      {/* 问题反馈 */}
      <div className={styles.topBox_textArea}>
        <TextArea
          placeholder="请输入反馈主题"
          showCount
          style={{
            '--font-size': '14px',
            height: '89px',

            borderBottom: '1px solid #f5f5f5',
          }}
          defaultValue={title}
          onChange={() => setTitle(event.target.value)}
          maxLength={20}
          rows={3}
        />
        <TextArea
          placeholder="请输入您遇到的问题或建议"
          showCount
          style={{
            '--font-size': '14px',
            paddingTop: '15px',
            height: '217px',
            borderBottom: '1px solid #f5f5f5',
          }}
          defaultValue={longTextArea}
          onChange={() => setLongTextArea(event.target.value)}
          maxLength={400}
          rows={9}
        />
        {/* 备注 */}
        <div className={styles.topBox_bottom}>
          <div className={styles.topBox_input}>添加图片说明（选填）</div>
          <span>{fileList.length}/4</span>
        </div>
        {/* 图片上传 */}
        <ImageUploader
          value={fileList}
          onChange={setFileList}
          upload={uploadData}
          style={{ '--cell-size': '104px' }}
          multiple
          showFailed={false}
          maxCount={4}
          onCountExceed={(exceed) => {
            Toast.show(`最多选择4张图片，你多选了${exceed}张`);
          }}
        />
      </div>
      {/* 具体场景选择 */}
      <div className={styles.bottomBox_select}>
        <List
          style={{
            color: '#000',
            '--font-size': '14px',
            borderTop: '5px solid #f5f5f5',
            marginTop: '15px',
          }}
        >
          <List.Item
            onClick={() => {
              setVisible(true);
              setKey(key + 1);
            }}
            extra={<RightOutline />}
            arrow=""
          >
            具体场景
            <span className={styles.bottomBox_select_span}>
              {type || '点击选择'}
            </span>
          </List.Item>
        </List>
      </div>
      {/* 提交按钮 */}
      <Button
        block
        type="submit"
        color="primary"
        size="large"
        style={{ '--border-radius': '8px' }}
        onClick={message}
      >
        提交
      </Button>
      <Popup
        visible={visible}
        key={key}
        onMaskClick={() => {
          setVisible(false);
        }}
        bodyStyle={{
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minHeight: '95vh',
        }}
      >
        <SpecificScenarios scenCallBack={scenCallBack} />
        <WaterMark {...props} />
      </Popup>
      <WaterMark {...props} />
    </div>
  );
}

export default ProblemFeedback;
