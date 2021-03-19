function App(w, h, scale, parentSelector) {
  this.w = w;
  this.h = h;
  this.screen = new Screen(w, h, scale, parentSelector);
  
  // shortcut for rendering to off canvas by default
  this.ctx = this.screen.ctx;
  
  // load assets
  this.assets = [];
  for (const asset of asset_files) {
    this.assets[asset.name] = new Image();
    this.assets[asset.name].src = "assets/" + asset.file;
  }
}

function Screen(w, h, scale, parentSelector) {
  this.scale = scale;
  this.w = w;
  this.h = h;
  this.sw = w * scale;
  this.sh = h * scale;
  this.main = create_canvas_ctx(this.sw, this.sh);
  this.off = create_canvas_ctx(this.w, this.h);
  
  // shortcut for rendering to off canvas by default
  this.ctx = this.off.ctx;

  this.parent = document.querySelector(parentSelector);
  if (this.parent) this.parent.appendChild(this.main.canvas);
  else console.error("Screen: invalid parent selector", parentSelector);
  
  this.resize = (w, h) => {
    this.w = w;
    this.h = h;
    this.sw = w * this.scale;
    this.sh = h * this.scale;
  }

  this.rescale = s => {
    this.scale = s;
    this.resize(this.w, this.h);
  }

  this.clear = () => {
    this.ctx.clearRect(0, 0, this.w, this.h);
  }

  this.swap = () => {
    this.main.ctx.drawImage(this.off.canvas, 0, 0, this.sw, this.sh);
  }
}

function create_canvas_ctx(w, h) {
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  return {canvas, ctx};
}


