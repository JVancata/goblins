// Background image
let bgReady = false;
export const bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
import backgroundImg from './assets/background.png'
bgImage.src = backgroundImg;

// Monster image
let monsterReady = false;
export const monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
import monsterImg from './assets/monster.png'
monsterImage.src = monsterImg;

// Hero image
let heroReady = false;
export const heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
import heroImg from './assets/hero.png'
heroImage.src = heroImg;