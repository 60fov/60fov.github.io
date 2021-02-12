var roll_btn = document.querySelector("#roll");
var bet_btns = document.querySelectorAll(".bet");
var names = document.querySelectorAll(".name");
var dice = document.querySelectorAll(".dice");
var bet_menu = document.querySelector("#bet-menu");
var bet_confirm = document.querySelector("#bet-confirm");
var tiles = document.querySelectorAll('.tiles');
var bet_list = document.querySelectorAll(".bet-list");

console.log(dice);

var tile_names = ["nai", "bau", "ga", "ca", "cua", "tom"]
var bet_btn_index = -1;

var bet_table = [
  [],[],[],[],[],[]
];


roll_btn.addEventListener("click", roll_dice);
bet_btns.forEach(btn => {
  btn.addEventListener("click", bet);
});

bet_confirm.addEventListener('click', place_bet);

function random(a) {
  return Math.round(Math.random() * a);
}

function tile_fn(tile_index) {
  return "assets/" + tile_names[tile_index] + ".png";
}

function roll_dice() {
  dice[0].setAttribute("src", tile_fn(random(5)));
  dice[1].setAttribute("src", tile_fn(random(5)));
  dice[2].setAttribute("src", tile_fn(random(5)));
}


function bet() {
  bet_menu.style.visibility = "visible";
  var p = this.parentElement.previousElementSibling;
  bet_btn_index = 0;
  while (p != null) {
    if (p.tagName == "DIV") bet_btn_index++;
    p = p.previousSibling;
  }
  
}


function place_bet() {
  var bet_inputs = document.querySelectorAll(".bet-val");

  bet_inputs.forEach((input, i) => {
    var num = parseInt(input.value);
    if (isNaN(num)) num = 0;
    
    bet_table[bet_btn_index][i] = num || 0;
  });

  bet_menu.style.visibility = "hidden";
  show_table();
}

function show_table() {
// think Im storing the data incorrectly

  bet_table.forEach((tile_bets, ti) => {
    var bet_span = document.createElement("li");
    console.log(bet_table);
    console.log(bet_btn_index);
    console.log(tile_bets);
    bet_span.innerHTML = names[bet_btn_index].innerHTML + ": $" + tile_bets[bet_btn_index];
    console.log(names[bet_btn_index].innerHTML + ": $" + tile_bets[bet_btn_index]);
    bet_span.setAttribute("id", "player-index"+bet_btn_index);
    bet_span.classList.add("bet-disp");


    var toRemove = document.getElementById("player-index"+bet_btn_index);
    
    if (toRemove != null) 
    {
      try {
        bet_list[ti].removeChild(toRemove);
      } catch (ex) {
        console.log(ex);
      }
    }
    
    bet_list[ti].appendChild(bet_span);
  });



  // bet_table.forEach((tile_bets, ti) => {
  //   tile_bets.every((bet, i) => {
  //     if (bet == 0) return false;
  //     var bet_span = document.createElement("li");
  //     bet_span.innerHTML = names[i].innerHTML + ": $" + bet;
  //     bet_span.classList.add("bet-disp");
  //     bet_list[ti].appendChild(bet_span);
  //     return true;
  //   });
  // });
}


