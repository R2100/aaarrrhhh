// constants.js
const GAME_WIDTH = window.innerWidth * 0.8;
const GAME_HEIGHT = window.innerHeight;
const GRID_SIZE = 10;
const INITIAL_ENEMY_SPEED = 1;
const INITIAL_ENEMY_HEALTH = 100;
const TOWER_COST = 100;
const TOWER_DAMAGE = 50;
const UPGRADE_COST = 50;
const MAX_ENEMIES = 10;
const ENEMY_SPAWN_INTERVAL = 2000; // ms

// Nuevas constantes para la dificultad
const DIFFICULTY_INCREASE_INTERVAL = 3000; // 30 segundos
const SPEED_INCREASE_RATE = 0.1; // 10% de aumento
const HEALTH_INCREASE_RATE = 0.2; // 20% de aumento
const SPAWN_RATE_DECREASE = 100; // 100ms más rápido cada nivel