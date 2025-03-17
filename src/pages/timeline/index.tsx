import React, { useRef, useState } from 'react';
import {
  Timeline,
  TimelineState,
} from '@xzdarcy/react-timeline-editor';
import './index.less';
import { cloneDeep } from 'lodash-es';
import {
  CustomTimelineAction,
  CusTomTimelineRow,
  mockData,
  mockEffect,
  scale,
  scaleWidth,
  startLeft,
} from '@/pages/timeline/mock';
import { Switch } from 'antd';
import {
  CustomRender0,
  CustomRender1,
} from '@/pages/timeline/custom';
import TimelinePlayer from '@/pages/timeline/player';
import { Link } from 'umi';

const defaultEditorData = cloneDeep(mockData);

const TimelineEditor = () => {
  const [data, setData] = useState(defaultEditorData);
  const [allow, setAllow] = useState(true);
  const domRef = useRef<HTMLDivElement>(null);
  const timelineState = useRef<TimelineState>(null);
  const autoScrollWhenPlay = useRef<boolean>(true);

  return (
    <div className={'timeline-editor-engine'}>
      <Link to={'/'}>首页</Link>
      <Switch
        checkedChildren="开启编辑"
        unCheckedChildren="禁用编辑"
        checked={allow}
        onChange={(e) => setAllow(e)}
        style={{ marginBottom: 20 }}
      />
      <div id={'player-ground'} className={'player-panel'}></div>
      <TimelinePlayer
        timelineState={timelineState}
        autoScrollWhenPlay={autoScrollWhenPlay}
      />
      <div className={'timeline-editor-example'}>
        <div
          ref={domRef}
          style={{ overflow: 'overlay' }}
          onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            timelineState.current &&
              timelineState.current.setScrollTop(target.scrollTop);
          }}
          className={'timeline-list'}
        >
          {data.map((item) => {
            return (
              <div className="timeline-list-item" key={item.id}>
                <div className="text">{`row${item.id}`}</div>
              </div>
            );
          })}
        </div>
        <Timeline
          ref={timelineState}
          onChange={(data) => {
            setData(data as CusTomTimelineRow[]);
          }}
          scale={scale}
          scaleWidth={scaleWidth}
          startLeft={startLeft}
          editorData={data}
          effects={mockEffect}
          autoScroll={true}
          disableDrag={!allow}
          hideCursor={!allow}
          dragLine
          // getScaleRender={(scale) => <CustomScale scale={scale} />}
          getActionRender={(action, row) => {
            if (action.effectId === 'effect0') {
              return (
                <CustomRender0
                  action={action as CustomTimelineAction}
                  row={row}
                />
              );
            } else if (action.effectId === 'effect1') {
              return (
                <CustomRender1
                  action={action as CustomTimelineAction}
                  row={row}
                />
              );
            }
          }}
          onActionResizing={({ action, dir }) => {
            if (action.id === 'action10' && dir !== 'left')
              return false;
          }}
          onDoubleClickRow={(e, { row, time }) => {
            console.log('onDoubleClickRow', { e, row, time });
          }}
          onScroll={({ scrollTop }) => {
            domRef.current && (domRef.current.scrollTop = scrollTop);
          }}
        />
      </div>
    </div>
  );
};
export default TimelineEditor;
