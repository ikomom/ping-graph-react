import { Howl } from 'howler';
import {
  EffectSourceParam,
  TimeLineEffectSource,
} from '@xzdarcy/react-timeline-editor/dist/interface/effect';
import lottie from 'lottie-web';
import { CustomTimelineAction } from '@/pages/timeline/mock';

class AudioControl implements TimeLineEffectSource {
  cacheMap: Record<string, Howl> = {};
  listenerMap: Record<
    string,
    {
      time?: (data: { time: number }) => void;
      rate?: (data: { rate: number }) => void;
    }
  > = {};

  start(param: EffectSourceParam) {
    console.log('start-audio', param);
    const { time, action, engine } = param;
    const {
      data: { src },
      start,
      end,
    } = action as CustomTimelineAction;
    const id = src;
    let item: Howl;
    if (this.cacheMap[id]) {
      item = this.cacheMap[id];
      item.rate(engine.getPlayRate());
      item.seek((time - start) % item.duration());
      item.play();
    } else {
      item = new Howl({ src, loop: true, autoplay: true });
      this.cacheMap[id] = item;
      item.on('load', () => {
        item.rate(engine.getPlayRate());
        item.seek((time - start) % item.duration());
      });
    }

    const timeListener = (data: { time: number }) => {
      const { time } = data;
      item.seek(time);
    };
    const rateListener = (data: { rate: number }) => {
      const { rate } = data;
      item.rate(rate);
    };
    if (!this.listenerMap[id]) this.listenerMap[id] = {};
    engine.on('afterSetTime', timeListener);
    engine.on('afterSetPlayRate', rateListener);
    this.listenerMap[id].time = timeListener;
    this.listenerMap[id].rate = rateListener;
  }

  // update(param) {
  //   console.log('update-audio', param);
  // }
  stop(param: EffectSourceParam) {
    console.log('stop', param);
    const { action, engine } = param;
    const {
      data: { src },
    } = action as CustomTimelineAction;
    const id = src;
    if (this.cacheMap[id]) {
      const item = this.cacheMap[id];
      item.stop();
      if (this.listenerMap[id]) {
        this.listenerMap[id].time &&
          engine.off('afterSetTime', this.listenerMap[id].time);
        this.listenerMap[id].rate &&
          engine.off('afterSetPlayRate', this.listenerMap[id].rate);
        delete this.listenerMap[id];
      }
    }
  }
}
export default new AudioControl();
