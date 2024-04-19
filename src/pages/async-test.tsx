/* eslint-disable no-undef */
import React, {useEffect, useRef, useState} from 'react';
import {Button, Space} from "antd";

function sleep(n: number) {
  return new Promise(resolve => {
    setTimeout(resolve, n)
  })
}

const App = () => {
  const [play, setPlay] = useState(false)
  const playRef = useRef(play); // 创建一个ref来存储play状态的当前值

  useEffect(() => {
    playRef.current = play; // 每当play状态更新时，更新ref的值
  }, [play]);

  const logText = async (n: number) => {
    for (let i = 0; i < n; i++) {
      console.log({i, c: playRef.current, play})
      if (!playRef.current) return
      await sleep(1000)
    }
  }

  useEffect(() => {
    if (play) {
      logText(10)
    }
  }, [play]);

  return (
    <Space className="App" align={'center'} style={{width: '100%', justifyContent: 'center'}}>
      <Button type={'primary'} onClick={() => setPlay(true)}>start</Button>
      <Button danger onClick={() => setPlay(false)}>stop</Button>
      {play ? '运行' : '停止'}
    </Space>
  );
};

export default App;
