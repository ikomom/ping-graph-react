import lottie, { AnimationItem } from 'lottie-web';
import {
  EffectSourceParam,
  TimeLineEffectSource,
} from '@xzdarcy/react-timeline-editor/dist/interface/effect';
import { CustomTimelineAction } from '@/pages/timeline/mock';

class LottieControl implements TimeLineEffectSource {
  cacheMap: Record<string, AnimationItem> = {};

  private _goToAndStop(item: AnimationItem, time: number) {
    if (!item.getDuration()) return;
    const duration = item.getDuration() * 1000;
    time = time * 1000;
    if (time > duration) time = time % duration;
    item.goToAndStop(time);
  }
  // 进入action
  enter(param: EffectSourceParam) {
    const { time, action } = param;
    const {
      data: { src },
      start,
      end,
    } = action as CustomTimelineAction;
    console.log('enter', param);

    let item: AnimationItem;
    if (this.cacheMap[src]) {
      item = this.cacheMap[src];
      item.show();
      this._goToAndStop(item, time);
    } else {
      const ground = document.getElementById('player-ground');
      item = lottie.loadAnimation({
        name: src,
        container: ground as HTMLDivElement,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: src,
        rendererSettings: {
          className: 'lottie-ani',
        },
      });
      item.addEventListener('loaded_images', () => {
        this._goToAndStop(item, time);
      });
      this.cacheMap[src] = item;
    }
  }
  // 更新action
  update(param: EffectSourceParam) {
    const { time, action } = param;
    const {
      data: { src },
    } = action as CustomTimelineAction;
    console.log('update', param);
    const item = this.cacheMap[src];
    if (item) {
      this._goToAndStop(item, time);
    }
  }
  // 离开action
  leave(param: EffectSourceParam) {
    const { time, action } = param;
    const {
      data: { src },
      start,
      end,
    } = action as CustomTimelineAction;
    console.log('leave', param);
    const item = this.cacheMap[src];
    if (item) {
      // 如果time大于end或者time小于start，则隐藏item
      if (time > end || time < start) {
        item.hide();
      } else {
        console.warn('leave in', param);
        const cur = time - start;
        item.show();
        this._goToAndStop(item, cur);
      }
    }
  }

  start(param: EffectSourceParam) {
    console.log('start', param);
  }
  stop(param: EffectSourceParam) {
    console.log('stop', param);
  }

  destroy() {
    console.log('destroy');
    lottie.destroy();
    this.cacheMap = {};
  }
}
export default new LottieControl();
