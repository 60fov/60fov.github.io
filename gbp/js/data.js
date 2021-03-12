let world_datas = {};

world_datas.one = {
  backgrounds: [
    {asset_name: "bg_0", speed: 1},
    {asset_name: "bg_1", speed: 2},
  ],
  spawn: {x: 1, y: 4},
  tileset: {
    asset_name: "ts_stone",
    w: 12,
    h: 6,
    ts: 16
  },
  w: 15,
  h: 10,
  tiles: [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28
  ],
  entities: [
    {
      kind: "stage",
      stage: "two",
      asset_name: "door",
      tx: 11,
      ty: 8
    },
    {
      kind: "orb",
      tx: 16,
      ty: 7,
    }
  ],
}

world_datas.two = {
  backgrounds: [
    {asset_name: "bg_0", speed: 1},
    {asset_name: "bg_1", speed: 2},
  ],
  spawn: {x: 2, y: 4},
  tileset: {
    asset_name: "ts_stone",
    w: 12,
    h: 6,
    ts: 16
  },
  w: 15,
  h: 10,
  tiles: [
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, 42, 43, 43, 44, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, 42, 43, 44, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 42,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28
  ],
  entities: [
    {
      kind: "stage",
      stage: "three",
      asset_name: "door",
      tx: 4,
      ty: 2
    },
    {
      kind: "worm",
      x: 5 * 16,
      y: 7 * 16
    },
    {
      kind: "orb",
      x: 13 * 16,
      y: 4 * 16
    }
  ],
}

world_datas.three = {
  backgrounds: [
    {asset_name: "bg_0", speed: 1},
    {asset_name: "bg_1", speed: 2},
  ],
  spawn: {x: 3, y: 4},
  tileset: {
    asset_name: "ts_stone",
    w: 12,
    h: 6,
    ts: 16
  },
  w: 15,
  h: 10,
  tiles: [
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, 42, 43, 43, 43, 43, 43, 44, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 42,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28
  ],
  entities: [
    {
      kind: "stage",
      stage: "four",
      asset_name: "door",
      tx: 6,
      ty: 3
    },
    {
      kind: "fly",
      x: 7 * 16,
      y: 2 * 16
    },
    {
      kind: "worm",
      x: 10 * 16,
      y: 7 * 16
    },
    {
      kind: "orb",
      x: 13 * 16,
      y: 4 * 16
    }
  ],
}

world_datas.four = {
  backgrounds: [
    {asset_name: "bg_0", speed: 1},
    {asset_name: "bg_1", speed: 2},
  ],
  spawn: {x: 3, y: 4},
  tileset: {
    asset_name: "ts_stone",
    w: 12,
    h: 6,
    ts: 16
  },
  w: 15,
  h: 10,
  tiles: [
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, 42, 43, 43, 43, 43, 43,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    44, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28
  ],
  entities: [
    {
      kind: "stage",
      stage: "five",
      asset_name: "door",
      tx: 10,
      ty: 8
    },
    {
      kind: "stage",
      stage: "three",
      asset_name: "door",
      tx: 13,
      ty: 2
    },
    {
      kind: "fly",
      x: 10 * 16,
      y: 2 * 16
    },
    {
      kind: "worm",
      x: 10 * 16,
      y: 7 * 16
    },
    {
      kind: "orb",
      x:2,
      y: 4 * 16
    }
  ],
}

world_datas.five = {
  backgrounds: [
    {asset_name: "bg_0", speed: 1},
    {asset_name: "bg_1", speed: 2},
  ],
  spawn: {x: 3, y: 2},
  tileset: {
    asset_name: "ts_stone",
    w: 12,
    h: 6,
    ts: 16
  },
  w: 15,
  h: 10,
  tiles: [
    9, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 11,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 54, 55, 35,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, 54, 55, 56, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    33,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7, 35,
  ],
  entities: [
    {
      kind: "stage",
      stage: "two",
      asset_name: "door",
      tx: 3,
      ty: 8
    },
    {
      kind: "stage",
      stage: "six",
      asset_name: "door",
      tx: 12,
      ty: 2
    },
    {
      kind: "fly",
      x: 10 * 16,
      y: 2 * 16
    },
    {
      kind: "worm",
      x: 3 * 16,
      y: 8 * 16
    },
    {
      kind: "orb",
      x: 10 * 16,
      y: 4 * 16
    }
  ],
}

world_datas.six = {
  backgrounds: [
    {asset_name: "bg_0", speed: 1},
    {asset_name: "bg_1", speed: 2},
  ],
  spawn: {x: 3, y: 2},
  tileset: {
    asset_name: "ts_stone",
    w: 12,
    h: 6,
    ts: 16
  },
  w: 15,
  h: 10,
  tiles: [
    9, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 31, 11,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    21, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 23,
    33,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7,  7, 35,
  ],
  entities: [
  ],
}

world_datas.test2 = {
  backgrounds: [
    {asset_name: "bg_0", speed: 1},
    {asset_name: "bg_1", speed: 2},
  ],
  spawn: {x: 10, y: 3},
  tileset: {
    asset_name: "ts_stone",
    w: 12,
    h: 6,
    ts: 16
  },
  w: 15,
  h: 10,
  tiles: [
    13, 14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    13, 14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    13, 14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    13, 14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    13, 14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    13, 14, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    13, 14, -1, 43, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 42,
    13, 14, -1, -1, -1, 0, 1, 2, -1, -1, -1, -1, -1, -1, -1,
    13, 27, 28, 28, 28, 29, 13, 27, 28, 28, 28, 28, 28, 28, 28,
    13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13
  ],
  entities: [
    // {
    //   kind: "stage",
    //   stage: "test1",
    //   x: 10,
    //   y: 4
    // }
  ],
}

let hero = {
  sheet: "ss_hero",
  flip_sheet: "ss_hero_flip",
  ani: {
    idle: {
      w: 16,
      h: 16,
      x: 0,
      y: 5,
      frames: 4,
      f_dur: 0.1,
      hitbox: {x: 3, y: 1, w: 11, h: 15},
    },
    run: {
      w: 16,
      h: 16,
      x: 0,
      y: 1,
      frames: 6,
      f_dur: 0.08,
      hitbox: {x: 0, y: 1, w: 13, h: 15},
    },
    jump_rise: {
      w: 16,
      h: 16,
      x: 0,
      y: 7,
      frames: 3,
      f_dur: 0.1,
      
    },
    jump_fall: {
      w: 16,
      h: 16,
      x: 0,
      y: 6,
      frames: 3,
      f_dur: 0.1,
      
    },
    hit: {
      w: 16,
      h: 16,
      x: 0,
      y: 8,
      frames: 3,
      f_dur: 0.05,
    },
    dying: {
      w: 16,
      h: 16,
      x: 0,
      y: 0,
      frames: 8,
      f_dur: 0.12,
    },
    jump2: {
      w: 16,
      h: 16,
      x: 0,
      y: 9,
      frames: 3,
      f_dur: 0.1,
    }
  }
}

let goblin = {
  sheet: "ss_goblin",
  flip_sheet: "ss_goblin_flip",
  ani: {
    idle: {
      w: 16,
      h: 16,
      x: 0,
      y: 3,
      frames: 4,
      f_dur: 0.1,
      hitbox: {x: 3, y: 1, w: 11, h: 15},
    },
    run: {
      w: 16,
      h: 16,
      x: 0,
      y: 0,
      frames: 6,
      f_dur: 0.1,
      hitbox: {x: 0, y: 1, w: 13, h: 15},
    },
    attack: {
      w: 24,
      h: 16,
      x: 0,
      y: 4,
      frames: 4,
      f_dur: 0.1,
      hit_box: {x: 2, y: 0, w: 16, h: 16},
      attack_box: {x: 18, y: 7, w: 5, h: 6}
    }
  }
}


let fly = {
  sheet: "ss_fly",
  flip_sheet: "ss_fly_flip",
  ani: {
    idle: {
      w: 8,
      h: 8,
      x: 0,
      y: 3,
      frames: 3,
      f_dur: 0.1,
      hitbox: {x: 3, y: 1, w: 11, h: 15},
    },
    hit: {
      w: 8,
      h: 8,
      x: 0,
      y: 2,
      f_dur: 0.1,
      frames: 3
    }
  },
  
}

let worm = {
  sheet: "ss_worm",
  flip_sheet: "ss_worm_flip",
  ani: {
    move: {
      w: 16,
      h: 8,
      x: 0,
      y: 0,
      frames: 6,
      f_dur: 0.1,
      hitbox: {x: 3, y: 1, w: 11, h: 15},
    },
    hit: {
      w: 16,
      h: 8,
      x: 0,
      y: 2,
      frames: 3,
      f_dur: 0.1,
    }
  }
}

let heart = {
  sheet: "ss_heart",
  ani: {
    idle: {
      w: 16,
      h: 16,
      x: 0,
      y: 0,
      frames: 5,
      f_dur: 0.05
    }
  }
}

let orb = {
  sheet: "ss_orb",
  ani: {
    idle: {
      w: 8,
      h: 8,
      x: 0,
      y: 0,
      frames: 6,
      f_dur: 0.1
    },
    collected: {
      w: 8,
      h: 8,
      x: 0,
      y: 1,
      frames: 5,
      f_dur: 0.1
    }
  }
}

let asset_files = [
  {file: "bg_0.png", name: "bg_0"},
  {file: "bg_1.png", name: "bg_1"},
  {file: "tileset.png", name: "ts_stone"},
  {file: "door.png", name: "door"},
  {file: "ss_hero.png", name: "ss_hero"},
  {file: "ss_hero_flip.png", name: "ss_hero_flip"},
  {file: "ss_goblin.png", name: "ss_goblin"},
  {file: "ss_goblin_flip.png", name: "ss_goblin_flip"},
  {file: "ss_worm.png", name: "ss_worm"},
  {file: "ss_worm.png", name: "ss_worm_flip"},
  {file: "ss_fly.png", name: "ss_fly"},
  {file: "ss_fly.png", name: "ss_fly_flip"},
  {file: "hearts_hud.png", name: "heart"},
  {file: "no_hearts_hud.png", name: "no_heart"},
  {file: "ss_heart.png", name: "ss_heart"},
  {file: "ss_orb.png", name: "ss_orb"},
]