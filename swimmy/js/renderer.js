function clear() {
  app.ctx.clearRect(0, 0, app.width, app.height);
}

function render_sprite(sprite, x, y) {
  render_image(sprite.frames[sprite.cur], x, y, sprite.width, sprite.height);
}

function render_image(img, x, y, w, h) {
  app.ctx.drawImage(img, x, y, w, h);
}

function render_circle(x, y, r, c) {
  app.ctx.fillStyle = c;
  app.ctx.beginPath();
  app.ctx.arc(x, y, r, 0, Math.PI * 2);
  app.ctx.fill();
}

function render_rect(x, y, w, h, c) {
  app.ctx.fillStyle = c;
  app.ctx.fillRect(x, y, w, h);
}

function draw_text(text, x, y, c, size, font ) {
  app.ctx.font = `${size}px ${font}`;
  app.ctx.fillStyle = c;
  
  if (x == "center") {
    let metrics = app.ctx.measureText(text);
    x = (app.width - metrics.width) / 2;
  } 
  if (y == "center") {
    y = (app.height - size) / 2;
  }
  app.ctx.fillText(text, x, y);
}

function draw_texts(lines, x, y, c, size, font) {
  app.ctx.font = `${size}px ${font}`;
  app.ctx.fillStyle = c;
  lines.forEach((text, i) => {
    app.ctx.fillText(text, x, y+(size*(i+1)));
  });
}