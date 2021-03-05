function Sprite(srcs, rate, loop, alt) {
  this.frames = [];
  srcs.forEach((src, i) => {
    this.frames[i] = new Image();
    this.frames[i].src = src;
  });
  this.width = this.frames[0].width;
  this.height = this.frames[0].height;
  this.timer = new Timer(rate, true, loop, 0);
  this.cur = 0;
  this.loop = loop || true;
  this.alt = alt || false;

  this.update = (delta) => {
    this.timer.update(delta);
    if (this.timer.ding) {
      this.cur += 1;
      if (this.cur >= this.frames.length) {
        this.cur = 0;
      }
    }
  };

  this.play = () => {
    this.timer.reset();
  };
}