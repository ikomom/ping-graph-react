import React, { FC } from 'react';
import {
  TimelineAction,
  TimelineRow,
} from '@xzdarcy/react-timeline-editor';
import { CustomTimelineAction } from '@/pages/timeline/mock';

export const CustomScale = (props: { scale: number }) => {
  const { scale } = props;
  const min = parseInt(scale / 60 + '');
  const second = ((scale % 60) + '').padStart(2, '0');
  return <>{`${min}:${second}`}</>;
};

export const CustomRender0: FC<{
  action: CustomTimelineAction;
  row: TimelineRow;
}> = ({ action, row }) => {
  return (
    <div className={'effect0'}>
      <div className={`effect0-text`}>{`播放音频: ${
        action.data.name
      } ${(action.end - action.start).toFixed(2)}s ${
        action.movable === false ? '（不可移动）' : ''
      } ${action.flexible === false ? '（不可缩放）' : ''}`}</div>
    </div>
  );
};

export const CustomRender1: FC<{
  action: CustomTimelineAction;
  row: TimelineRow;
}> = ({ action, row }) => {
  return (
    <div className={'effect1'} style={{ padding: '0 10px' }}>
      <span>{action.data.name}</span>
      {/*<img*/}
      {/*  src={require('@/assets/logo.png')}*/}
      {/*  alt={''}*/}
      {/*  width={20}*/}
      {/*  height={20}*/}
      {/*  draggable={false}*/}
      {/*></img>*/}
    </div>
  );
};
