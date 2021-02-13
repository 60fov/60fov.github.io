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
var dep_inputs = document.querySelectorAll(".deposit-amount");
var dots = document.querySelectorAll(".tiles > span");


console.log(dice);

var tile_names = ["nai", "bau", "ga", "ca", "cua", "tom"];
var bet_btn_index = -1;

var bet_table = [
  [],[],[],[],[],[]
];

var resetting = false;


roll_btn.addEventListener("click", roll_dice);
bet_btns.forEach(btn => {
  btn.addEventListener("click", bet);
});

confirm_btns.forEach(btn => {
  btn.addEventListener("click", deposit);
});

bet_confirm.addEventListener('click', place_bet);

function random(a) {
  return Math.floor(Math.random() * (a));
}

function tile_fn(tile_index) {
  return "assets/" + tile_names[tile_index] + ".png";
}

function roll_dice() {
  // display rolled die on tiles
  // style names on bets

  var dv = [ random(6),random(6),random(6) ];
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

  dots[dv[0]].classList.remove("hide");
  dots[dv[1]].classList.remove("hide");
  dots[dv[2]].classList.remove("hide");
  
  this.innerHTML = "reset";
  console.log(this);
  this.removeEventListener("click", roll_dice);
  this.addEventListener("click", reset);
  resetting = true;
  // console.log(bet_table);
}

function reset() {
  bet_table = [[],[],[],[],[],[]];
  for (var i = 0; i < 16; i++) clear_player_bet(i);
  for (var i = 0; i < 6; i++) dots[i].classList.add("hide");
  this.addEventListener("click", roll_dice);
  this.removeEventListener("click", reset);
  this.innerHTML = "roll";
  bet_btns.forEach(btn => {
    btn.addEventListener("click", bet);
  });
  resetting = false;
  
}


function deposit() {
  var m = this.parentElement.previousElementSibling.previousElementSibling;
  var a = parseInt(this.previousElementSibling.value);
  if (!isNaN(a)) {
    m.innerHTML = parseInt(m.innerHTML) + a;
    dep_inputs.forEach(input => {
      input.value = "";
    });
  }
}

function bet() {
  if (resetting) return;
  bet_menu.style.visibility = "visible";
  // bet_menu.style.left = (100 + (bet_btn_index * 200)) + "px";
  var p = this.parentElement.previousElementSibling;
  bet_btn_index = 0;
  while (p != null) {
    if (p.tagName == "DIV") bet_btn_index++;
    p = p.previousSibling;
  }
  document.getElementById("bet-name").innerText = names[bet_btn_index].innerText;
  document.querySelectorAll(".bet-val").forEach(el => {
    el.value = "";
  });
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

  var mfi = money_fields[bet_btn_index];

  if (parseInt(mfi.innerHTML) >= bet_sum && bet_sum <= 1500) {
    bet_btns[bet_btn_index].removeEventListener("click", bet);
    bet_btns[bet_btn_index].classList.add("gray-out");
    mfi.innerHTML = parseInt(mfi.innerHTML) - bet_sum;
    bet_menu.style.visibility = "hidden";
    show_table();
  }
}

function show_table() {
  clear_player_bet(bet_btn_index);
  
  bet_table.forEach((tile_bets, ti) => {
    var bet_span = document.createElement("li");
    var bet_val = tile_bets[bet_btn_index];
    if (bet_val != 0) {
      var bet_name = names[bet_btn_index].innerHTML;
      bet_span.innerHTML = bet_name + ":" + bet_val;
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