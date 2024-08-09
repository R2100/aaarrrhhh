// enemy.js
class Enemy {
    constructor(path, speed, health) {
        this.path = path;
        this.pathIndex = 0;
        this.x = path.points[0].x;
        this.y = path.points[0].y;
        this.speed = speed;
        this.health = health;
        this.maxHealth = health;
    }

    move(deltaTime) {
        if (this.pathIndex < this.path.points.length - 1) {
            const target = this.path.points[this.pathIndex + 1];
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const moveDistance = this.speed * deltaTime*50;

            if (distance <= moveDistance) {
                this.x = target.x;
                this.y = target.y;
                this.pathIndex++;
            } else {
                const ratio = moveDistance / distance;
                this.x += dx * ratio;
                this.y += dy * ratio;
            }
        }
    }

    draw(ctx) {
        // Dibujar el enemigo
        ctx.fillStyle = '#F00';
        ctx.beginPath();
        ctx.arc(this.x, this.y, GRID_SIZE / 3, 0, Math.PI * 2);
        ctx.fill();

        // Dibujar la barra de vida
        //const healthBarWidth = GRID_SIZE / 2;
        const healthBarWidth = 40;
        const healthBarHeight = 5;
        const healthPercentage = this.health / this.maxHealth;
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - healthBarWidth / 2, this.y - GRID_SIZE / 2 - 10, healthBarWidth, healthBarHeight);
        
        ctx.fillStyle = '#0F0';
        ctx.fillRect(this.x - healthBarWidth / 2, this.y - GRID_SIZE / 2 - 10, healthBarWidth * healthPercentage, healthBarHeight);
    }

    isAtEnd() {
        return this.pathIndex === this.path.points.length - 1;
    }
}
