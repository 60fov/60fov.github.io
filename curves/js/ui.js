let element = {
  ui,
  stats,
  info
};

function ui_init() {
  element.ui = document.querySelector("#ui");
  element.stats = document.querySelector("#stats");
  for (let key in stats) {
    element[key] = document.createElement('div');
    element.stats.append(element[key]);
  }
}

function update_ui(delta) {
  for (let key in stats) {
    element[key].innerText = key + ": " + stats[key];
  }
}