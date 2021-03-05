let music;
let sfx;

function init_dom() {
  music = document.querySelector("#music");
  sfx = document.querySelector("#sfx");
}

function sfx_toggle() {
  app.sfx = !app.sfx;
  sfx.setAttribute("on", app.sfx);
}

function music_toggle() {
  app.music = !app.music;
  app.sound.bg.pause();
  music.setAttribute("on", app.music);
}