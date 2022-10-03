import h from "virtual-dom/h";

import { secondsToPixels } from "./utils/conversions";
import TimeScaleHook from "./render/TimeScaleHook";

class TimeScale {
  constructor(
    duration,
    offset,
    samplesPerPixel,
    sampleRate,
    marginLeft = 0,
    colors
  ) {
    this.duration = duration;
    this.offset = offset;
    this.samplesPerPixel = samplesPerPixel;
    this.sampleRate = sampleRate;
    this.marginLeft = marginLeft;
    this.colors = colors;

    this.timeinfo = {
      400000: {
        marker: 200000,
        bigStep: 200000,
        smallStep: 100000,
        secondStep: 10,
      },
      50000: {
        marker: 25000,
        bigStep: 25000,
        smallStep: 12500,
        secondStep: 1,
      },
      20000: {
        marker: 10000,
        bigStep: 10000,
        smallStep: 2500,
        secondStep: 1,
      },
      12000: {
        marker: 7000,
        bigStep: 6000,
        smallStep: 3000,
        secondStep: 1,
      },
      10000: {
        marker: 5000,
        bigStep: 5000,
        smallStep: 2500,
        secondStep: 1,
      },
      5000: {
        marker: 3000,
        bigStep: 2500,
        smallStep: 1250,
        secondStep: 1 / 2,
      },
      2500: {
        marker: 1500,
        bigStep: 1250,
        smallStep: 625,
        secondStep: 1 / 2,
      },
      1500: {
        marker: 1000,
        bigStep: 750,
        smallStep: 375,
        secondStep: 1 / 5,
      },
      1000: {
        marker: 500,
        bigStep: 500,
        smallStep: 250,
        secondStep: 1 / 10,
      },
    };
  }

  getScaleInfo(resolution) {
    let keys = Object.keys(this.timeinfo).map((item) => parseInt(item, 10));

    // make sure keys are numerically sorted.
    keys = keys.sort((a, b) => a - b);

    for (let i = 0; i < keys.length; i += 1) {
      if (resolution <= keys[i]) {
        return this.timeinfo[keys[i]];
      }
    }

    return this.timeinfo[keys[0]];
  }

  /*
    Return time in format mm:ss
  */
  static formatTime(milliseconds) {
    const seconds = milliseconds / 1000;
    let s = seconds % 60;
    const m = (seconds - s) / 60;

    if (s < 10) {
      s = `0${s}`;
    }

    return `${m}:${s}`;
  }

  render() {
    let widthX = secondsToPixels(
      this.duration,
      this.samplesPerPixel,
      this.sampleRate
    );
    let playerWidth = 885;
    if (document.querySelector(".audioEdit")) {
      playerWidth = document.querySelector(".audioEdit").offsetWidth - 233;
    }

    if (widthX < playerWidth) {
      widthX = playerWidth;
    }
    const pixPerSec = this.sampleRate / this.samplesPerPixel;
    const pixOffset = secondsToPixels(
      this.offset,
      this.samplesPerPixel,
      this.sampleRate
    );
    const scaleInfo = this.getScaleInfo(this.samplesPerPixel);
    const canvasInfo = {};
    const timeMarkers = [];
    const end = widthX + pixOffset;
    let counter = 0;

    for (let i = 0; i < end; i += pixPerSec * scaleInfo.secondStep) {
      const pixIndex = Math.floor(i);
      const pix = pixIndex - pixOffset;

      if (pixIndex >= pixOffset) {
        // put a timestamp every 30 seconds.
        if (scaleInfo.marker && counter % scaleInfo.marker === 0) {
          timeMarkers.push(
            h(
              "div.time",
              {
                attributes: {
                  style: `position: absolute; left: ${pix}px;`,
                },
              },
              [TimeScale.formatTime(counter)]
            )
          );
          canvasInfo[pix] = 10;
        } else if (scaleInfo.bigStep && counter % scaleInfo.bigStep === 0) {
          canvasInfo[pix] = 5;
        } else if (scaleInfo.smallStep && counter % scaleInfo.smallStep === 0) {
          canvasInfo[pix] = 2;
        }
      }

      counter += 1000 * scaleInfo.secondStep;
    }

    return h(
      "div.playlist-time-scale",
      {
        attributes: {
          style: `position: relative; left: 0; right: 0; margin-left: ${this.marginLeft}px;pointer-events: none;`,
        },
      },
      [
        timeMarkers,
        h("canvas", {
          attributes: {
            width: widthX,
            height: 30,
            style: "position: absolute; left: 0; right: 0; top: 0; bottom: 0;",
          },
          hook: new TimeScaleHook(
            canvasInfo,
            this.offset,
            this.samplesPerPixel,
            this.duration,
            this.colors
          ),
        }),
      ]
    );
  }
}

export default TimeScale;
