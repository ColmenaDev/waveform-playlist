import _assign from "lodash.assign";
import _forOwn from "lodash.forown";

export default class {
  constructor() {
    this.name = "Untitled-lane";
    this.id = "";
    this.customClass = undefined;
    this.gain = 1;
    this.volume = 1;
    this.color = "";
    this.defaultColor = "";
    this.muted = false;
    this.soloed = false;
    this.duration = 0;
    this.endTime = 0;
    this.tracks = [];
  }

  setEventEmitter(ee) {
    this.ee = ee;
  }

  setId(id) {
    this.id = id;
  }

  setName(name) {
    this.name = name;
  }

  setColor(color) {
    this.color = color;
    this.defaultColor = this.color.inner;
  }

  setMuted(bool) {
    this.muted = bool;
  }

  setEndTime(endTime) {
    this.endTime = endTime;
  }

  setDuration(duration) {
    this.duration = duration;
  }

  removeTrack(track) {
    const index = this.tracks.indexOf(track);
    if (index > -1) {
      this.tracks.splice(index, 1);
    }
    const endTime =
      this.tracks.length > 0
        ? Math.max(...this.tracks.map((track) => track.endTime))
        : 0;
    this.setEndTime(endTime);
  }

  addTrack(track) {
    this.tracks.push(track);
    this.recalculateEndTime();
  }

  recalculateEndTime() {
    const endTime =
      this.tracks.length > 0
        ? Math.max(...this.tracks.map((track) => track.endTime))
        : 0;
    this.setEndTime(endTime);
  }

  getEndTime() {
    return this.endTime;
  }

  getDuration() {
    return this.duration;
  }

  setGainLevel(level) {
    this.gain = level;
    this.tracks.forEach((track) => {
      this.ee.emit("volumechange", level * 100, track);
    });
  }

  getLaneDetails() {
    const info = {
      id: this.id,
      name: this.name,
      duration: this.duration,
      end: this.endTime,
      customClass: this.customClass,
      gain: this.gain,
      tracks: this.tracks,
    };

    return info;
  }
}
