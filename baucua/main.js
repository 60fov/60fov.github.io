var roll_btn = document.querySelector("#roll");
var bet_btns = document.querySelectorAll(".bet");
var names = document.querySelectorAll(".name");
var dice = document.querySelectorAll(".dice");
var bet_menu = document.querySelector("#bet-menu");
var bet_confirm = document.querySelector("#bet-confirm");
var tiles = document.querySelectorAll('.tiles');
var bet_list = document.querySelectorAll(".bet-list");
var confirm_btns = document.querySelectorAll(".deposit");
var money_fields = document.querySelectorAll(".money");

console.log(dice);

var tile_names = ["nai", "bau", "ga", "ca", "cua", "tom"]
var bet_btn_index = -1;

var bet_table = [
  [],[],[],[],[],[]
];

// var money_table = [

// ];


roll_btn.addEventListener("click", roll_dice);
bet_btns.forEach(btn => {
  btn.addEventListener("click", bet);
});

confirm_btns.forEach(btn => {
  btn.addEventListener("click", deposit);
});

bet_confirm.addEventListener('click', place_bet);

function random(a) {
  return Math.round(Math.random() * a);
}

function tile_fn(tile_index) {
  return "assets/" + tile_names[tile_index] + ".png";
}

function roll_dice() {
  // reset bet_table
  // reset bet_table display
  // add confirm for next roll

  // display rolled die on tiles
  // style names on bets
  

  var dv = [ random(5),random(5),random(5) ];
  dice[0].setAttribute("src", tile_fn(dv[0]));
  dice[1].setAttribute("src", tile_fn(dv[1]));
  dice[2].setAttribute("src", tile_fn(dv[2]));

  var tile_occ = [0, 0, 0, 0, 0, 0];
  tile_occ[dv[0]]++;
  tile_occ[dv[1]]++;
  tile_occ[dv[2]]++;
  console.log(tile_occ);
  tile_occ.forEach((occ, ti) => {
    if (occ != 0) {
      console.log(occ);
      bet_table[ti].forEach((bet, pi) => {
        if (bet != 0) {
          money_fields[pi].innerHTML = parseInt(money_fields[pi].innerHTML) + bet * (occ + 1);
        }
      });
    }
  });
  
  this.innerHTML = "reset";
  console.log(this);
  this.removeEventListener("click", roll_dice);
  this.addEventListener("click", reset);
}

function reset() {
  bet_table = [[],[],[],[],[],[]]
  for (var i = 0; i < 16; i++) clear_player_bet(i);
  this.addEventListener("click", roll_dice);
  this.removeEventListener("click", reset);
  this.innerHTML = "roll";
}


function deposit() {
  var m = this.parentElement.previousElementSibling.previousElementSibling;
  var a = parseInt(this.previousElementSibling.value);
  m.innerHTML = parseInt(m.innerHTML) + a;
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

  var bet_sum = 0;
  bet_inputs.forEach((input, i) => {
    var num = parseInt(input.value);
    if (isNaN(num)) num = 0;
    
    bet_table[i][bet_btn_index] = num || 0;
    bet_sum += num;
  });

  bet_menu.style.visibility = "hidden";
  show_table();
  var mfi = money_fields[bet_btn_index];
  mfi.innerHTML = parseInt(mfi.innerHTML) - bet_sum;
}

function show_table() {
  clear_player_bet(bet_btn_index);
  
  bet_table.forEach((tile_bets, ti) => {
    var bet_span = document.createElement("li");
    var bet_val = tile_bets[bet_btn_index];
    if (bet_val != 0) {
      var bet_name = names[bet_btn_index].innerHTML;
      bet_span.innerHTML = bet_name + ": $" + bet_val;
      bet_span.classList.add("player-index"+bet_btn_index);
      bet_span.classList.add("bet-disp");

      bet_list[ti].appendChild(bet_span);
    }
  });
}

function clear_player_bet(index) {
  var rem = document.getElementsByClassName("player-index"+index);
  while (rem.length > 0) {
    rem[0].parentNode.removeChild(rem[0]);
  }
}