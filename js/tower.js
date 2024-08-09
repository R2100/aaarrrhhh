// tower.js
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = GRID_SIZE * 3;
        this.fireRate = 1000; // ms
        this.lastFired = 0;
        this.level = 1;
    }

    upgrade() {
        this.level++;
        this.range += GRID_SIZE;
        this.fireRate *= 0.8;
    }

    canFire(now) {
        return now - this.lastFired >= this.fireRate;
    }

    findTarget(enemies) {
        return enemies.find(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            return Math.sqrt(dx * dx + dy * dy) <= this.range;
        });
    }

    draw(ctx) {
        // Draw tower
        ctx.fillStyle = '#00F';
        ctx.fillRect(this.x - GRID_SIZE / 2, this.y - GRID_SIZE / 2, GRID_SIZE, GRID_SIZE);

        // Draw range indicator
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}