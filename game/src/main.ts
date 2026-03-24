import io from "socket.io-client";
import { bgImage, heroImage, monsterImage } from "./images";
import type { Hero, Monster, OtherHero } from "./types";

const socket = io("ws://localhost:3000");

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d")!;
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

let otherHeroes: OtherHero[] = [];

socket.on("data", (message) => {
  otherHeroes = JSON.parse(message);
})

// Game objects
const hero: Hero = {
  id: self.crypto.randomUUID(),
  speed: 256, // movement in pixels per second
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const monster: Monster = { x: 0, y: 0 };
let monstersCaught = 0;

// Handle keyboard controls
const keysDown: Record<string, boolean> = {};

addEventListener("keydown", function (e) {
  keysDown[e.key] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.key];
}, false);

// Reset the game when the player catches a monster
const reset = function () {
  // Throw the monster somewhere on the screen randomly
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
const update = function (modifier: number) {
  if (keysDown["ArrowUp"]) { // Player holding up
    hero.y -= hero.speed * modifier;
  }
  if (keysDown["ArrowDown"]) { // Player holding down
    hero.y += hero.speed * modifier;
  }
  if (keysDown["ArrowLeft"]) { // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if (keysDown["ArrowRight"]) { // Player holding right
    hero.x += hero.speed * modifier;
  }

  // Are they touching?
  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
    reset();
  }
};

// Draw everything
const render = function () {
  console.log("Rendering...");
  ctx.drawImage(bgImage, 0, 0);

  ctx.drawImage(heroImage, hero.x, hero.y);
  otherHeroes.forEach((otherHero) => {
    if (otherHero.id === hero.id) return;
    ctx.drawImage(heroImage, otherHero.x, otherHero.y);

    // Score
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "12px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(otherHero.id, otherHero.x, otherHero.y);
  });

  ctx.drawImage(monsterImage, monster.x, monster.y);

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
const main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};

setInterval(() => {
  socket.emit("user-position", JSON.stringify(hero));
}, 25);

// Let's play this game!
let then = Date.now();
reset();
main();
