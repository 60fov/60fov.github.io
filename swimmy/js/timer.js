function Timer(time, active, auto, cur) {
  this.time = time || 1;
  this.cur = cur || 0;
  this.active = active;
  this.auto = auto;
  this.ding = false;
  this.update = (delta) => {
    if (!this.active) return;
    this.ding = this.cur >= this.time;
    if (!this.ding) this.cur += delta;
    if (this.ding && this.auto) this.reset();
  };
  this.reset = () => {
    this.cur -= this.time;
  };
}