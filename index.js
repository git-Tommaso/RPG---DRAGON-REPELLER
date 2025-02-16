let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;

let fighting;
let monsterHealth;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterNameText") || {
  innerText: "",
};
const monsterHealthText = document.querySelector("#monsterHealthText") || {
  innerText: "",
};

const weapons = [
  {
    name: "stick",
    power: 5,
  },
  {
    name: "dagger",
    power: 30,
  },
  {
    name: "claw hammer",
    power: 50,
  },
  {
    name: "sword",
    power: 100,
  },
];

const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];

const locations = [
  {
    //[0]
    name: "town square",
    "button text": ["Go store", "Go cave", "Fight dragon"],
    "button function": [goStore, goCave, fightDragon],
    text: "you enter the town.",
  },
  {
    //[1]
    name: "store",
    "button text": ["Buy 10 health(10 gold)", "Buy weapon(30 gold)", "Go town"],
    "button function": [buyHealth, buyWeapon, goTown],
    text: "you enter the store.",
  },
  {
    //[2]
    name: "cave",
    "button text": ["Fight slime", "Fight beast", "Go to town square"],
    "button function": [fightSlime, fightBeast, goTown],
    text: "you enter the cave and you see some monsters.",
  },
  {
    //[3]
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button function": [attack, dodge, goTown],
    text: "you are fighting a monster.",
  },
  {
    //[4]
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button function": [goTown, goTown, easterEgg],
    text: 'you killed the monster, he screams "Arg!", u get gold and xp',
  },
  {
    //[5]
    name: "lose",
    "button text": ["REPLAY ?!", "REPLAY ?!", "REPLAY ?!"],
    "button function": [restart, restart, restart],
    text: "you are dead",
  },
  {
    //[6]
    name: "win",
    "button text": ["REPLAY ?!", "REPLAY ?!", "REPLAY ?!"],
    "button function": [restart, restart, restart],
    text: "YOUR WIN THE GAMEEEE!!!",
  },
  {
    //[7]
    name: "easter egg",
    "button text": ["2", "8", "go to town square"],
    "button function": [pickTwo, pickEight, goTown],
    text: "you found an easter egg, pick a number between 1-10, and you will get a prize if you guess the right number",
  },
];

// initialize buttons

goTown();

function update(location) {
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button function"][0];
  button2.onclick = location["button function"][1];
  button3.onclick = location["button function"][2];
  text.innerText = location.text;

  if (location.name !== "fight") {
    monsterStats.style.display = "none";
  }
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You don't have enough gold";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You bought a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory.join(", ");
    } else {
      text.innerText = "You don't have enough gold";
    }
  } else {
    text.innerText = "You already have the best weapon";
    button2.innerText = "Sell weapon (15gold)";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    gold.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + "!";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "You can't sell your only weapon";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsters[fighting].health;
}

function attack() {
  text.innerText = "the " + monsters[fighting].name + " attacks.";
  text.innerText += "You attack with your " + weapons[currentWeapon].name + ".";

  if (isMonsterHit()) {
    health -= getMonsterAttackValue(monsters[fighting].level);
  } else {
    text.innerText = "you missed";
  }

  monsterHealth -=
    weapons[currentWeapon].power + Math.floor(Math.random() * xp + 1);
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    fighting === 2 ? win() : defeatMoster();
  }

  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText = "your" + inventory.pop() + "breaks";
    currentWeapon--;
  }
}

function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

function getMonsterAttackValue(level) {
  let hit = level * 5 - Math.floor(Math.random() * xp);
  return hit;
}

function dodge() {
  text.innerText =
    "your dodge the attack from a" + monsters[fighting].name + ".";
}

function defeatMoster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  if (fighting === 2) {
    win();
  }
  update(locations[4]);
}
function lose() {
  update(locations[5]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function win() {
  update(locations[6]);
}

let eggN = 0;

function easterEgg() {
  if (eggN === 0) {
    eggN++;
    update(locations[7]);
  } else {
    update(locations[0]);
  }
}

let pickN = 0;

function pickTwo() {
  if (pickN === 0) {
    pickN++;
    pick(2);
  } else {
    update(locations[0]);
  }
}

function pickEight() {
  if (pickN === 0) {
    pickN++;
    pick(8);
  } else {
    update(locations[0]);
  }
}

function pick(guess) {
  let numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }

  text.innerText = "Ypu picked " + guess + " Here are the rundom numbers: \n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }

  if (numbers.indexOf(guess) !== -1) {
    text.innerText += "YOU WIN 20 GOLD";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "YOU LOSE 10 HEALTH";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}