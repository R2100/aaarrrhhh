// game.js
class TowerDefenseGame {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = GAME_WIDTH;
        this.canvas.height = GAME_HEIGHT;
        document.getElementById('game-board').appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.path = new Path(GAME_WIDTH, GAME_HEIGHT, GRID_SIZE);
        this.towers = [];
        this.enemies = [];
        this.money = 500;
        this.lives = MAX_ENEMIES;
        this.isPaused = true;
        this.selectedTower = null;

        this.difficultyLevel = 1;
        this.enemySpeed = INITIAL_ENEMY_SPEED;
        this.enemyHealth = INITIAL_ENEMY_HEALTH;
        this.enemySpawnInterval = ENEMY_SPAWN_INTERVAL;
        this.lastEnemySpawn = 0;

        this.setupEventListeners();
        this.startDifficultyTimer();
        this.updateDisplay();
    }

    createPath() {
        this.path.addPoint(0, GAME_HEIGHT / 2);
        this.path.addPoint(GAME_WIDTH / 4, GAME_HEIGHT / 2);
        this.path.addPoint(GAME_WIDTH / 4, GAME_HEIGHT / 4);
        this.path.addPoint(GAME_WIDTH * 3 / 4, GAME_HEIGHT / 4);
        this.path.addPoint(GAME_WIDTH * 3 / 4, GAME_HEIGHT * 3 / 4);
        this.path.addPoint(GAME_WIDTH, GAME_HEIGHT * 3 / 4);
    }

    setupEventListeners() {
        document.getElementById('add-defense').addEventListener('click', () => this.addDefense());
        document.getElementById('upgrade').addEventListener('click', () => this.upgradeTower());
        document.getElementById('play-pause').addEventListener('click', () => this.togglePlayPause());
        this.canvas.addEventListener('click', (e) => this.handleBoardClick(e));
    }

    addDefense() {
        if (this.money >= TOWER_COST) {
            this.isPlacingTower = true;
            this.canvas.style.cursor = 'crosshair';
        } else {
            console.log("No tienes suficiente dinero para comprar una torre");
        }
    }

    upgradeTower() {
        if (this.selectedTower && this.money >= UPGRADE_COST) {
            this.selectedTower.upgrade();
            this.money -= UPGRADE_COST;
            this.updatePropertiesDisplay();
            this.updateDisplay();
            this.drawGame();  // Redibujar el juego inmediatamente
        }
    }

    handleBoardClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.isPlacingTower) {
            this.placeTower(x, y);
        } else {
            this.selectTower(x, y);
        }
    }

    placeTower(x, y) {
        if (this.money >= TOWER_COST && !this.isTowerOnPath(x, y)) {
            const tower = new Tower(x, y);
            this.towers.push(tower);
            this.money -= TOWER_COST;
            this.isPlacingTower = false;
            this.damage=TOWER_DAMAGE;
            this.canvas.style.cursor = 'default';
            this.updateDisplay();
            this.drawGame();  // Redibujar el juego inmediatamente
        }
    }

    selectTower(x, y) {
        this.selectedTower = this.towers.find(tower => {
            const dx = tower.x - x;
            const dy = tower.y - y;
            return Math.sqrt(dx * dx + dy * dy) <= GRID_SIZE / 2;
        });
        this.updatePropertiesDisplay();
        this.drawGame();  // Redibujar el juego para mostrar la torre seleccionada
    }

    isTowerOnPath(x, y) {
        const towerSize = GRID_SIZE;
        const towerRect = {x: x - towerSize/2, y: y - towerSize/2, width: towerSize, height: towerSize};
        
        for (let i = 1; i < this.path.points.length; i++) {
            const start = this.path.points[i-1];
            const end = this.path.points[i];
            if (this.lineIntersectsRect(start, end, towerRect)) {
                return true;
            }
        }
        return false;
    }
    lineIntersectsRect(lineStart, lineEnd, rect) {
        return this.lineIntersectsLine(lineStart, lineEnd, {x: rect.x, y: rect.y}, {x: rect.x + rect.width, y: rect.y}) ||
               this.lineIntersectsLine(lineStart, lineEnd, {x: rect.x + rect.width, y: rect.y}, {x: rect.x + rect.width, y: rect.y + rect.height}) ||
               this.lineIntersectsLine(lineStart, lineEnd, {x: rect.x + rect.width, y: rect.y + rect.height}, {x: rect.x, y: rect.y + rect.height}) ||
               this.lineIntersectsLine(lineStart, lineEnd, {x: rect.x, y: rect.y + rect.height}, {x: rect.x, y: rect.y});
    }

    lineIntersectsLine(line1Start, line1End, line2Start, line2End) {
        const det = (line1End.x - line1Start.x) * (line2End.y - line2Start.y) - (line2End.x - line2Start.x) * (line1End.y - line1Start.y);
        if (det === 0) return false;
        const lambda = ((line2End.y - line2Start.y) * (line2End.x - line1Start.x) + (line2Start.x - line2End.x) * (line2End.y - line1Start.y)) / det;
        const gamma = ((line1Start.y - line1End.y) * (line2End.x - line1Start.x) + (line1End.x - line1Start.x) * (line2End.y - line1Start.y)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
    startDifficultyTimer() {
        setInterval(() => {
            if (!this.isPaused) {
                this.increaseDifficulty();
            }
        }, DIFFICULTY_INCREASE_INTERVAL);
    }

    increaseDifficulty() {
        this.difficultyLevel++;
        this.enemySpeed *= (1 + SPEED_INCREASE_RATE);
        this.enemyHealth *= (1 + HEALTH_INCREASE_RATE);
        this.enemySpawnInterval = Math.max(500, this.enemySpawnInterval - SPAWN_RATE_DECREASE);
        
        console.log(`Difficulty increased to level ${this.difficultyLevel}`);
        this.updateDisplay();
    }

    spawnEnemy() {
        if (this.enemies.length < MAX_ENEMIES) {
            const enemy = new Enemy(this.path, this.enemySpeed, this.enemyHealth);
            this.enemies.push(enemy);
            console.log('Enemy spawned:', enemy); // Añadir esta línea para depuración
        }
    }


    updateGame(currentTime) {
        if (this.isPaused) {
            return;
        }

        const deltaTime = (currentTime - this.lastUpdateTime) / 1000; // Convertir a segundos
        this.lastUpdateTime = currentTime;

        // Actualizar enemigos
        this.enemies.forEach((enemy, index) => {
            enemy.move(deltaTime);
            if (enemy.isAtEnd()) {
                this.enemies.splice(index, 1);
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        });

        // Disparos de torres
        this.towers.forEach(tower => {
            if (tower.canFire(currentTime)) {
                const target = tower.findTarget(this.enemies);
               // console.log(target);
                //console.log(tower);
                if (target) {
                    target.health -= tower.damage;
                    console.log(`vida: ${target.health} resto: ${tower.damage}`);
                    if (target.health <= 0) {
                        const index = this.enemies.indexOf(target);
                        this.enemies.splice(index, 1);
                        this.money += 20;
                    }
                    tower.lastFired = currentTime;
                }
            }
        });

        // Generar nuevos enemigos
        if (currentTime - this.lastEnemySpawn > this.enemySpawnInterval) {
            this.spawnEnemy();
            this.lastEnemySpawn = currentTime;
        }

        this.updateDisplay();
    }
    updateDisplay() {
        document.getElementById('money').textContent = this.money;
        document.getElementById('remaining-enemies').textContent = this.lives;
        document.getElementById('difficulty-level').textContent = this.difficultyLevel;
    }
    togglePlayPause() {
        console.log("pulsado play/pau");
        this.isPaused = !this.isPaused;
        document.getElementById('play-pause').textContent = this.isPaused ? 'Play' : 'Pause';
        if (!this.isPaused) {
            this.lastUpdateTime = performance.now();
            this.lastEnemySpawn = this.lastUpdateTime;
        }
    }
    gameLoop() {
        if (!this.isPaused) {
            this.updateGame();
            this.drawGame();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    drawGame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawGrid();
        this.path.draw(this.ctx);
        this.towers.forEach(tower => {
            tower.draw(this.ctx);
            if (tower === this.selectedTower) {
                // Dibujar un indicador de selección
                this.ctx.strokeStyle = 'yellow';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(tower.x - GRID_SIZE / 2, tower.y - GRID_SIZE / 2, GRID_SIZE, GRID_SIZE);
            }
        });
        
        // Dibujar los enemigos siempre, incluso si el juego está pausado
        this.enemies.forEach(enemy => {
            enemy.draw(this.ctx);
           // console.log('Drawing enemy:', enemy); // Añadir esta línea para depuración
        });
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';  // Gris muy claro
        this.ctx.lineWidth = 1;

        // Dibujar líneas verticales
        for (let x = 0; x <= GAME_WIDTH; x += GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, GAME_HEIGHT);
            this.ctx.stroke();
        }

        // Dibujar líneas horizontales
        for (let y = 0; y <= GAME_HEIGHT; y += GRID_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(GAME_WIDTH, y);
            this.ctx.stroke();
        }
    }

    updatePropertiesDisplay() {
        if (this.selectedTower) {
            document.getElementById('range').textContent = this.selectedTower.range;
            document.getElementById('fire-rate').textContent = this.selectedTower.fireRate.toFixed(2);
        } else {
            document.getElementById('range').textContent = '-';
            document.getElementById('fire-rate').textContent = '-';
        }
    }

    gameOver() {
        this.isPaused = true;
        alert('Game Over!');
    }
}