
const defaultGameMap = [
  `
...................................
...................................
...................................
...................................
...................................
...................................
...................................
...................................
........#..........................
........#..........................
........#..........................
........#..........................
........#..........................
...................................
...................................
...................................
...................................
...................................
................@.........+++++++++
##########################+++++++++
`]


//第一章：基础设置：level、state、actors。。。

var Level = class Level {
  constructor(plan) {
    let rows = plan.trim().split("\n").map(l => {
      l = l.trim();
      return [...l]
    });
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type == "string") return type;
        this.startActors.push(
          type.create(new Vec(x, y), ch));
        return "empty";
      });
    });
  }
  
  touches(pos, size, type) {
    //某个位置（可以是任何actor的位置） 与 背景（墙、钱）的碰撞测试
    var xStart = Math.floor(pos.x);
    var xEnd = Math.ceil(pos.x + size.x);
    var yStart = Math.floor(pos.y);
    var yEnd = Math.ceil(pos.y + size.y);

    for (var y = yStart; y < yEnd; y++) {
      for (var x = xStart; x < xEnd; x++) {
        let isOutside = x < 0 || x >= this.width ||
          y < 0 || y >= this.height;
        let here = isOutside ? "wall" : this.rows[y][x];
        if (typeof type == "string") {
          if (here == type) return true;
        } else if (typeof type == 'object') {
          if (type.some(a => here == a)) return true
        }
      }
    }
    return false;
  }
}

var State = class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
  update(time, keys) {
    let actors = this.actors
      .map(actor => actor.update(time, this, keys));
    let newState = new State(this.level, actors, this.status);
    //先看this.status的状态
    if (newState.status != "playing") return newState;
    //再看player有没有撞lava
    let player = newState.player;
    if (this.level.touches(player.pos, player.size, "lava")) {
      return new State(this.level, actors, "lost");
    }
    //再处理actors之间的碰撞以及增添或删除actors
    for (let actor of actors) {
      if (actor != player && overlap(player, actor)) {
        newState = actor.collide(newState);
      }
      if (actor.type == "fire" && actor.isGone) {
        newState = actor.gone(newState)
      } else if (actor.type == "dragon" && actor.fire.isFire) {
        newState = actor.firing(newState)
      }
    }
    return newState;
  }
}

var Vec = class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}

var Player = class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
    this.size = new Vec(0.8, 1.5);
    this.playerXSpeed = 7;
    this.gravity = 30;
    this.jumpSpeed = 17
  }
  get type() {
    return "player";
  }
  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
  }
  update(time, state, keys) {
    let xSpeed = 0;
    if (keys.ArrowLeft) xSpeed -= this.playerXSpeed;
    if (keys.ArrowRight) xSpeed += this.playerXSpeed;
    let pos = this.pos;
    let movedX = pos.plus(new Vec(xSpeed * time, 0));
    if (!state.level.touches(movedX, this.size, "wall")) {
      pos = movedX;
    }
    let ySpeed = this.speed.y + time * this.gravity;
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    if (!state.level.touches(movedY, this.size, "wall")) {
      pos = movedY;
    } else if (keys.ArrowUp && ySpeed > 0) {
      ySpeed = -this.jumpSpeed;
    } else {
      ySpeed = 0;
    }
    return new Player(pos, new Vec(xSpeed, ySpeed));
  }
}

var Lava = class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
    this.size = new Vec(1, 1)
  }

  get type() { return "lava"; }

  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
  collide(state) {
    return new State(state.level, state.actors, "lost");
  }
  update(time, state) {
    let newPos = this.pos.plus(this.speed.times(time));
    if (!state.level.touches(newPos, this.size, "wall")) {
      return new Lava(newPos, this.speed, this.reset);
    } else if (this.reset) {
      return new Lava(this.reset, this.speed, this.reset);
    } else {
      return new Lava(this.pos, this.speed.times(-1));
    }
  }
}

var Coin = class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
    this.size = new Vec(0.6, 0.6);
    this.wobbleSpeed = 8;
    this.wobbleDist = 0.07;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
      Math.random() * Math.PI * 2);
  }
  collide(state) {
    let filtered = state.actors.filter(a => a != this);
    let status = state.status;
    if (!filtered.some(a => a.type == "coin")) status = "won";
    return new State(state.level, filtered, status);
  }
  update(time) {
    let wobble = this.wobble + time * this.wobbleSpeed;
    let wobblePos = Math.sin(wobble) * this.wobbleDist;
    return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
      this.basePos, wobble);
  }
}

class Monster {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
    this.size = new Vec(1, 1)
  }
  get type() {
    return 'monster'
  }
  static create(pos) {
    return new Monster(pos, new Vec(-2, 7))
  }
  collide(state) {
    let { top, left, right, bottom } = overlap(state.player, this);
    if (top != true) {
      return new State(state.level, state.actors, 'lost');
    } else {
      let filtered = state.actors.filter(a => a != this);
      return new State(state.level, filtered, state.status)
    }
  }
  update(time, state) {
    let xSpeed = this.speed.x;
    let pos = this.pos;
    let movedX = pos.plus(new Vec(xSpeed * time, 0))
    if (!state.level.touches(movedX, this.size, ["wall", "lava"])) {
      pos = movedX
    } else {
      xSpeed = -this.speed.x;
    }
    let ySpeed = this.speed.y;
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    if (!state.level.touches(movedY, this.size, ["wall", "lava"])) {
      pos = movedY
    }
    return new Monster(pos, new Vec(xSpeed, ySpeed))
  }
}

class Dragon {
  constructor(pos, speed, fire = { isFire: false, lastShot: 0 }) {
    this.pos = pos;
    this.speed = speed;
    this.size = new Vec(2.5, 2.5)
    this.fire = fire;
  }
  get type() {
    return 'dragon'
  }
  static create(pos) {
    return new Dragon(pos, new Vec(0, 0))
  }
  collide(state) {
    return new State(state.level, state.actors, 'lost')
  }
  firing(state) {
    let xSpeed = this.speed.x > 0 ? 5 : -5
    let fire = new Fire(this.pos, new Vec(xSpeed, 0))
    let actors = state.actors;
    actors.push(fire)
    return new State(state.level, actors, state.status)
  }
  update(time, state) {
    let player = state.player

    let xDistance = player.pos.x - this.pos.x;
    let xSpeed = xDistance > 0 ? 2 : -2
    if (Math.abs(xDistance) < 0.1) {
      xSpeed = 0;
    }
    let pos = this.pos;
    let movedX = pos.plus(new Vec(xSpeed * time, 0))
    if (!state.level.touches(movedX, this.size, ["wall", "lava"])) {
      pos = movedX
    }

    let yDistance = player.pos.y - this.pos.y;
    let ySpeed = yDistance > 0 ? 2.5 : -1.5
    if (Math.abs(yDistance) < 0.1) ySpeed = 0;
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    if (!state.level.touches(movedY, this.size, ["wall", "lava"])) {
      pos = movedY
    }
    //考虑要不要喷火,设定3秒冷却时间
    let fire = this.fire;
    if (Math.abs(xDistance) < 10 && Math.abs(yDistance) < 10 &&
      Date.now() - fire.lastShot > 3000) {
      fire.isFire = true;
      fire.lastShot = Date.now()
    } else {
      this.fire.isFire = false;
    }

    return new Dragon(pos, new Vec(xSpeed, ySpeed), fire)
  }
}

class Fire {
  constructor(pos, speed, gone = false) {
    this.pos = pos;
    this.speed = speed;
    this.size = new Vec(0.8, 1.4)
    this.gravity = 10;
    this.isGone = gone;
  }
  get type() {
    return 'fire'
  }
  static create(pos) {
    return new Fire(pos, new Vec(0, 0))
  }
  collide(state) {
    return new State(state.level, state.actors, 'lost')
  }
  gone(state) {
    let filtered = state.actors.filter(a => a != this);;
    return new State(state.level, filtered, state.status)
  }
  update(time, state) {
    let pos = this.pos;
    let xSpeed = this.speed.x
    let gone = this.isGone;
    let movedX = pos.plus(new Vec(xSpeed * time, 0))
    if (!state.level.touches(movedX, this.size, ["wall", "lava"])) {
      pos = movedX
    } else {
      gone = true;
    }
    let ySpeed = this.speed.y + this.gravity * time;
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    if (!state.level.touches(movedY, this.size, ["wall", "lava"])) {
      pos = movedY
    } else {
      gone = true;
    }
    return new Fire(pos, new Vec(xSpeed, ySpeed), gone)
  }
}

var levelChars = {
  ".": "empty", "#": "wall", "+": "lava",
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava, 'm': Monster,
  "d": Dragon, "f": Fire
};

//第二章：actors之间的碰撞与更新、state的更新

function overlap(moveActor, hitActor) {
  let actor1Left = moveActor.pos.x
  let actor1Right = moveActor.size.x + moveActor.pos.x;
  let actor1Top = moveActor.pos.y;
  let actor1Bottom = moveActor.pos.y + moveActor.size.y;
  let actor2Left = hitActor.pos.x
  let actor2Right = hitActor.size.x + hitActor.pos.x;
  let actor2Top = hitActor.pos.y;
  let actor2Bottom = hitActor.pos.y + hitActor.size.y;
  let hitPosition = {
    top: false,
    left: false,
    right: false,
    bottom: false
  };
  let hit = false;
  if (actor1Right - actor2Left < hitActor.size.x &&
    actor1Right - actor2Left > 0 &&
    actor2Right - actor1Left > hitActor.size.x &&
    actor1Top < actor2Bottom && actor1Bottom > actor2Top) {
    hitPosition.left = true;
    hit = true
  }
  if (actor2Right - actor1Left < hitActor.size.x &&
    actor2Right - actor1Left > 0 &&
    actor1Right - actor2Left > hitActor.size.x &&
    actor1Top < actor2Bottom && actor1Bottom > actor2Top) {
    hitPosition.right = true;
    hit = true;
  }
  if (actor1Bottom - actor2Top < hitActor.size.y &&
    actor1Bottom - actor2Top > 0 &&
    actor2Bottom - actor1Top > hitActor.size.y &&
    actor1Left < actor2Right && actor1Right > actor2Left) {
    hitPosition.top = true;
    hit = true;
  }
  if (actor2Bottom - actor1Top < hitActor.size.y &&
    actor2Bottom - actor1Top > 0 &&
    actor1Bottom - actor2Top > hitActor.size.y &&
    actor1Left < actor2Right && actor1Right > actor2Left) {
    hitPosition.bottom = true;
    hit = true;
  }
  return hit ? hitPosition : hit

}
//第三章：canvas

function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}

var scale = 20;
let otherSprites = document.createElement("img");
otherSprites.src = "./img/sprites.png";
let playerSprites = document.createElement("img");
playerSprites.src = "./img/player.png";
let monsterSprites = document.createElement('img');
monsterSprites.src = './pic/Monster1.png'
let dragonSprites = document.createElement('img');
let dragonSpritesSRC = Array.apply(null, { length: 10 }).map(function (_, index) {
  let number = index + 1;
  return './pic/dragon' + number.toString() + '.png'
})
let fireSprites = document.createElement('img');
let fireSpritesSRC = Array.apply(null, { length: 4 }).map(function (_, index) {
  let number = index + 1;
  return './pic/fire' + number.toString() + '.png'
})
let toFireSRC = Array.apply(null, { length: 8 }).map(function (_, index) {
  let number = index + 1;
  return './pic/tofire' + number.toString() + '.png'
})



class CanvasDisplay {
  constructor(parent, level) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.min(700, level.width * scale);
    this.canvas.height = Math.min(400, level.height * scale);
    parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext("2d");
    this.flipPlayer = false;
    this.flipDragon = false;
    this.flipMonster = false;
    this.flipFire = false;
    this.viewport = {
      left: 0,
      top: 0,
      //屏幕的3分之一
      width: this.canvas.width / scale,
      height: this.canvas.height / scale
    };
  }
  clear() {
    this.canvas.remove();
  }
  updateViewport(state) {
    let view = this.viewport, margin_width = view.width / 3, margin_height = view.height / 3;
    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5));

    if (center.x < view.left + margin_width) {
      view.left = Math.max(center.x - margin_width, 0);
    } else if (center.x > view.left + view.width - margin_width) {
      view.left = Math.min(center.x + margin_width - view.width,
        state.level.width - view.width);
    }
    if (center.y < view.top + margin_height) {
      view.top = Math.max(center.y - margin_height, 0);
    } else if (center.y > view.top + view.height - margin_height) {
      view.top = Math.min(center.y + margin_height - view.height,
        state.level.height - view.height);
    }
  }
  clearDisplay(status) {
    // default background setting
    if (status == "won") {
      this.cx.fillStyle = "rgb(68, 191, 255)";
    } else if (status == "lost") {
      this.cx.fillStyle = "rgb(44, 136, 214)";
    } else {
      this.cx.fillStyle = "rgb(52, 166, 251)";
    }
    this.cx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  drawBackground(level) {
    let { left, top, width, height } = this.viewport;
    let xStart = Math.floor(left);
    let xEnd = Math.ceil(left + width);
    let yStart = Math.floor(top);
    let yEnd = Math.ceil(top + height);

    for (let y = yStart; y < yEnd; y++) {
      for (let x = xStart; x < xEnd; x++) {
        let tile = level.rows[y][x];
        if (tile == "empty") continue;
        let screenX = (x - left) * scale;
        let screenY = (y - top) * scale;
        let tileX = tile == "lava" ? 2 * scale : 0;
        this.cx.drawImage(otherSprites, tileX, 0, 2 * scale, 2 * scale,
          screenX, screenY, scale, scale);
      }
    }
  }
  drawPlayer(player, x, y, width, height) {
    const playerXOverlap = 4;
    width += playerXOverlap * 2;
    x -= playerXOverlap;

    if (player.speed.x != 0) {
      this.flipPlayer = player.speed.x < 0;
    }

    let tile = 8;
    if (player.speed.y != 0) {
      tile = 9;
    } else if (player.speed.x != 0) {
      tile = Math.floor(Date.now() / 60) % 8;
    }

    this.cx.save();
    if (this.flipPlayer) {
      flipHorizontally(this.cx, x + width / 2);
    }
    let tileX = tile * 2 * width;
    this.cx.drawImage(playerSprites, tileX, 0, 2 * width, 2 * height, x, y, width, height);
    this.cx.restore();
  }
  drawMonster(monster, x, y, width, height) {
    if (monster.speed.x != 0) {
      this.flipMonster = monster.speed.x > 0;
    }
    this.cx.save();
    if (this.flipMonster) {
      flipHorizontally(this.cx, x + width / 2);
    }
    this.cx.drawImage(monsterSprites, x, y, width, height)
    this.cx.restore()
  }
  drawDragon(dragon, x, y, width, height) {
    if (dragon.speed.x != 0) {
      this.flipDragon = dragon.speed.x > 0;
    }
    this.cx.save();
    if (this.flipDragon) {
      flipHorizontally(this.cx, x + width / 2);
    }
    let tile;
    let afterFire = Date.now() - dragon.fire.lastShot;
    if (afterFire < 240) {
      //显示喷火图案
      if (afterFire < 60) tile = 0;
      else if (afterFire < 120) tile = 1;
      else if (afterFire < 180) tile = 2;
      else tile = 3
      dragonSprites.src = toFireSRC[tile]
    } else {
      //飞行图案
      tile = Math.floor(Date.now() / 60) % 10;
      dragonSprites.src = dragonSpritesSRC[tile]
    }
    this.cx.drawImage(dragonSprites, x, y, width, height)
    this.cx.restore()

  }
  drawFire(fire, x, y, width, height) {
    if (fire.speed.x != 0) {
      this.flipFire = fire.speed.x < 0;
    }
    let tile;
    if (fire.speed.y < 2) {
      tile = 0
    } else if (fire.speed.y < 6) {
      tile = 1
    } else if (fire.speed.y < 10) {
      tile = 2
    } else {
      tile = 3;
    }
    this.cx.save();
    if (this.flipFire) {
      flipHorizontally(this.cx, x + width / 2);
    }
    fireSprites.src = fireSpritesSRC[tile]
    this.cx.drawImage(fireSprites, x, y, width, height)
    this.cx.restore()
  }
  drawActors(actors) {
    for (let actor of actors) {
      let width = actor.size.x * scale;
      let height = actor.size.y * scale;
      let x = (actor.pos.x - this.viewport.left) * scale;
      let y = (actor.pos.y - this.viewport.top) * scale;
      if (actor.type == "player") {
        this.drawPlayer(actor, x, y, width, height);
      } else if (actor.type == "monster") {
        this.drawMonster(actor, x, y, width, height)
      } else if (actor.type == "dragon") {
        this.drawDragon(actor, x, y, width, height)
      } else if (actor.type == "fire") {
        this.drawFire(actor, x, y, width, height)
      } else {
        let tileX = (actor.type == "coin" ? 2 : 1) * 2 * scale;
        this.cx.drawImage(otherSprites, tileX, 0, 2 * width, 2 * height, x, y, width, height);
      }
    }
  }
  syncState(state) {
    this.updateViewport(state);
    this.clearDisplay(state.status);
    this.drawBackground(state.level);
    this.drawActors(state.actors);
  }
}

//最后一章：游戏的运行

function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

var arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function runLevel(level, Display, parent) {
  let display = new Display(parent, level);
  let state = State.start(level);
  ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time,touchKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}

class Game {
  constructor() {
    this.dom = document.createElement("div")
  }
  runGame(plans, Display) {
    function startGame(gamePlans, DisplayClass, parent) {
      return new Promise(async (resolve)=>{
        if (gamePlans == null) {
          return;
        }
        for (let level = 0; level < gamePlans.length;) {
          let status = await runLevel(new Level(gamePlans[level]),
            DisplayClass, parent);
          if (status == "won") level++;
        }
        resolve('won')
      })
    }

    return startGame(plans, Display, this.dom)
  }
  stopGame() {
    this.dom.remove();
  }
}
let ending = 1
let game = new Game()

