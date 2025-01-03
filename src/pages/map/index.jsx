import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from 'react-leaflet';
import tween from '@tweenjs/tween.js';
import { Button, Col, Row, Space } from 'antd';
import { PauseOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { generateUUID } from 'three/src/math/MathUtils';

const generateTestData = (numPoints) => {
  let path = [];
  for (let i = 0; i < numPoints; i++) {
    let lat = 24.5 + Math.random() * 3; // 在24.5到27.5之间生成随机纬度
    let lng = 120 + Math.random() * 2; // 在120到122之间生成随机经度
    path.push({ lat: lat.toFixed(3), lng: lng.toFixed(3) });
  }
  return path;
};

// 生成10个测试数据点
const testData = generateTestData(10);
console.log(testData);

const defaultIcon = '/images/mid_top_bg.png';
const mock = [
  {
    name: 'A',
    duration: 1000,
    status: 'pause',
    path: [
      { lat: 24.05, lng: 120, iconUrl: '/images/icon-1024.png' },
      { lat: 24.8, lng: 120.01, iconUrl: '/images/logobg.png' },
      { lat: 24.1, lng: 118.03, iconUrl: '/images/ring0.png' },
    ].map((i, index) => ({
      ...i,
      index,
    })),
  },
  {
    name: 'B',
    duration: 2000,
    status: 'pause',
    path: [
      {
        lat: '26.666',
        lng: '120.857',
      },
      {
        lat: '26.786',
        lng: '120.196',
      },
      {
        lat: '24.746',
        lng: '120.977',
      },
    ].map((i, index) => ({
      ...i,
      index,
      iconUrl: '/images/logobg.png',
    })),
  },
  {
    name: 'C',
    duration: 500,
    status: 'pause',
    path: testData.map((i, index) => ({
      ...i,
      index,
    })),
  },
];

const AnimatePath = ({
  active,
  path,
  duration,
  status,
  onComplete,
}) => {
  const [points, setPoints] = useState([]);
  const [initPoints, setInitPoints] = useState([]);
  const [links, setLinks] = useState([]);
  const animateRef = useRef();

  useEffect(() => {
    if (path.length >= 2) {
      const group = new tween.Group();
      let first;
      setInitPoints([path[0], path[path.length - 1]]);
      setLinks([]);

      const tweenArr = [];
      path.forEach((item, index) => {
        const lastItem = path[index + 1];
        // console.log('lastItem', lastItem, 'item', item, index);

        if (lastItem) {
          const tw = new tween.Tween({ ...item }, group);
          tw.to(lastItem, duration)
            .onStart((obj) => {
              console.log('开始', obj, index);
              animateRef.current = tw;
            })
            .onUpdate((point) => {
              setLinks((prev) => [
                ...prev,
                {
                  id: generateUUID(),
                  from: item,
                  to: point,
                  color: index % 2 ? 'red' : 'blue',
                },
              ]);
            })
            .onComplete((obj) => {
              console.log('完成', item, lastItem);
              setPoints((prev) => [
                ...prev,
                { ...obj, iconUrl: lastItem.iconUrl },
              ]);
              const isLast = index === path.length - 2;
              if (isLast) {
                animateRef.current = first;
              }
              onComplete &&
                onComplete({
                  obj,
                  index,
                  isLast,
                });
            });
          tweenArr.push(tw);
        }
      });
      console.log({ group, tweenArr });

      function animate(time) {
        group.update(time);
        requestAnimationFrame(animate);
      }
      // 串联动画
      for (let i = 0; i < tweenArr.length - 1; i++) {
        tweenArr[i].chain(tweenArr[i + 1]);
      }
      animateRef.current = tweenArr[0];
      first = tweenArr[0];
      animate();
    }
    return () => {
      setInitPoints([]);
      setLinks([]);
      setPoints([]);
    };
  }, [path]);
  // console.log({ points, links });

  useEffect(() => {
    const ref = animateRef.current;
    if (!ref) return;
    if (status === 'start') {
      console.log('sart', ref);
      if (ref.isPaused()) {
        ref.resume();
      } else {
        ref.start();
        setLinks([]);
        setPoints([]);
      }
    } else if (status === 'pause') {
      ref.pause();
    }
  }, [status]);
  return (
    <>
      {[...initPoints, ...points].map((point, index) => {
        return (
          <Marker
            key={index}
            icon={
              point.iconUrl
                ? L.icon({
                    iconUrl: point.iconUrl,
                    iconSize: active ? [35, 35] : [30, 30],
                  })
                : L.divIcon({
                    html: `<div style="background: yellow;border-radius: 50%;width: 20px;height: 20px;text-align: center;line-height: 20px">
                          ${point.index}
                          </div>`,
                  })
            }
            position={[point.lat, point.lng]}
          ></Marker>
        );
      })}
      {links.map((link, index) => {
        return (
          <Polyline
            key={link.id + active}
            color={active ? 'yellow' : link.color}
            positions={[
              [link.from.lat, link.from.lng],
              [link.to.lat, link.to.lng],
            ]}
          ></Polyline>
        );
      })}
    </>
  );
};

export default () => {
  const [mockData, setMockData] = useState(mock);
  const [active, setActive] = useState(mockData[0].name);

  const handleStart = () => {};
  const handlePause = () => {};
  return (
    <div style={{ border: '1px solid #ccc' }}>
      <Space style={{ margin: 2 }}>
        <Button onClick={handleStart}>开始</Button>
        <Button onClick={handlePause}>暂停</Button>
      </Space>
      <Row>
        <Col span={6}>
          {mockData.map((item, index) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                padding: 4,
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 20,
                background:
                  active === item.name ? 'lightblue' : 'none',
              }}
              onClick={() => setActive(item.name)}
            >
              {item.name}
              <span
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  mockData[index].status =
                    item.status === 'pause' ? 'start' : 'pause';
                  setMockData([...mockData]);
                }}
              >
                {item.status === 'pause' ? (
                  <PlaySquareOutlined />
                ) : (
                  <PauseOutlined />
                )}
              </span>
            </div>
          ))}
        </Col>
        <Col span={18}>
          <MapContainer
            center={[24.505, 120]}
            zoom={7}
            scrollWheelZoom
            style={{ height: 650, width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {mockData.map((item) => {
              return (
                <AnimatePath
                  key={item.name}
                  path={item.path}
                  duration={item.duration}
                  status={item.status}
                  active={active === item.name}
                  onComplete={({ isLast }) => {
                    if (isLast) {
                      item.status = 'pause';
                      setMockData([...mockData]);
                    }
                  }}
                />
              );
            })}
            {/*<Marker position={[24.505, 120]}>*/}
            {/*  <Popup>*/}
            {/*    A pretty CSS3 popup. <br /> Easily customizable.*/}
            {/*  </Popup>*/}
            {/*</Marker>*/}
          </MapContainer>
        </Col>
      </Row>
    </div>
  );
};
