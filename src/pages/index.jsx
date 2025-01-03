import React, { useContext, useEffect } from 'react';
import Graphin, {
  Utils,
  Behaviors,
  GraphinContext,
  GraphinData,
} from '@antv/graphin';
import './image-node';
import logo from '@/assets/logo.png';

import { pick } from 'lodash-es';
import MapPlace from './map/index';

const { FitView, BrushSelect, DragCanvas, ClickSelect, Hoverable } =
  Behaviors;

const data = {
  nodes: [
    {
      id: 'node4',
      label: '自定义节点',
      x: 222,
      y: 190,
      type: 'image-node',
      size: 80,
      img: logo,
    },
    {
      id: 'node3',
      label: '网图',
      x: 222,
      y: 190,
      type: 'image',
      size: 80,
      img: 'https://files.catbox.moe/8xirfu.png',
    },
    {
      id: 'node1',
      label: 'node1',
      x: 100,
      y: 200,
      linkPoints: {
        bottom: true,
      },
      // 该节点可选的连接点集合，该点有两个可选的连接点
      anchorPoints: [
        [0, 1],
        [0.5, 1],
      ],
      // size: 80,
      // type: 'image',
    },
    {
      id: 'node2',
      label: '本地图',
      x: 300,
      y: 400,
      // 该节点可选的连接点集合，该点有两个可选的连接点
      anchorPoints: [
        [0.5, 0],
        [1, 0.5],
      ],
      size: 80,
      type: 'image',
      img: logo,
    },
  ],
  edges: [
    {
      source: 'node1',
      target: 'node2',
      // 该边连入 source 点的第 0 个 anchorPoint，
      sourceAnchor: 0,
      // 该边连入 target 点的第 0 个 anchorPoint，
      targetAnchor: 0,
      style: {
        // endArrow: true,
      },
    },
    {
      source: 'node2',
      target: 'node1',
      // 该边连入 source 点的第 1 个 anchorPoint，
      sourceAnchor: 1,
      // 该边连入 source 点的第 1 个 anchorPoint，
      targetAnchor: 1,
      style: {
        // endArrow: true,
      },
    },
  ],
};
// const data = Utils.mock(4).circle().graphin();
const layout = {
  type: 'concentric',
  minNodeSpacing: 50,
};

console.log('network', data);

export default () => {
  const graphinRef = React.createRef();
  useEffect(() => {
    const a = 1 ?? 0;
    console.log(
      'test',
      graphinRef.current?.data,
      a,
      pick(graphinRef.current, 'test'),
    );
  }, []);
  return (
    <div style={{ border: '1px solid #ccc' }}>
      <MapPlace />
      {/*<Graphin*/}
      {/*  ref={graphinRef}*/}
      {/*  // theme={{ mode: 'dark' }}*/}
      {/*  groupByTypes={false}*/}
      {/*  // modes={{*/}
      {/*  //   default: ['drag-canvas', 'zoom-canvas', 'clickSelected'],*/}
      {/*  // }}*/}
      {/*  data={data}*/}
      {/*  layout={layout}*/}
      {/*  defaultNode={{*/}
      {/*    type: 'rect',*/}
      {/*  }}*/}
      {/*  nodeStateStyles={{*/}
      {/*    status: {*/}
      {/*      highlight: {*/}
      {/*        keyshape: {*/}
      {/*          stroke: 'red',*/}
      {/*          strokeOpacity: 1,*/}
      {/*        },*/}
      {/*      },*/}
      {/*    },*/}
      {/*  }}*/}
      {/*  edgeStateStyles={{*/}
      {/*    status: {*/}
      {/*      hover: {*/}
      {/*        halo: {*/}
      {/*          stroke: 'yellow',*/}
      {/*        },*/}
      {/*      },*/}
      {/*    },*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ClickSelect />*/}
      {/*  <Hoverable bindType={'edge'} />*/}
      {/*  <Hoverable bindType={'node'} />*/}
      {/*  /!* <ZoomCanvas disabled /> *!/*/}
      {/*</Graphin>*/}
    </div>
  );
};
