// path.js
class Path {
    constructor(gameWidth, gameHeight, gridSize) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gridSize = gridSize;
        this.points = [];
        this.generateSmoothPath();
    }

    generateSmoothPath() {
        const targetLength = 1800;
        let currentLength = 0;
        const minSegmentLength = 5;

        // Elegir un punto de inicio aleatorio en un borde
        let currentPoint = this.getRandomBorderPoint();
        this.points.push(currentPoint);

        let lastDirection = null;

        while (currentLength < targetLength) {
            let direction = this.getNextDirection(lastDirection);
            let segmentLength = Math.max(minSegmentLength, Math.floor(Math.random() * (targetLength - currentLength) / 2));
            
            let nextPoint = this.extendPath(currentPoint, direction, segmentLength);
            
            // Si el nuevo punto está fuera de los límites, intentar otra dirección
            if (this.isOutOfBounds(nextPoint)) {
                continue;
            }

            this.points.push(nextPoint);
            currentLength += this.getDistance(currentPoint, nextPoint);
            currentPoint = nextPoint;
            lastDirection = direction;
        }

        // Asegurar que el camino termine en un borde
        let endPoint = this.getClosestBorderPoint(currentPoint);
        this.points.push(endPoint);
    }

    getNextDirection(lastDirection) {
        const directions = [
            {dx: 0, dy: -1},  // Up
            {dx: 1, dy: 0},   // Right
            {dx: 0, dy: 1},   // Down
            {dx: -1, dy: 0}   // Left
        ];

        if (!lastDirection) {
            return directions[Math.floor(Math.random() * directions.length)];
        }

        // Filtrar direcciones que no resulten en un giro de 180 grados
        const validDirections = directions.filter(dir => 
            !(dir.dx === -lastDirection.dx && dir.dy === -lastDirection.dy)
        );

        return validDirections[Math.floor(Math.random() * validDirections.length)];
    }

    getRandomBorderPoint() {
        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0: // Top
                return {x: Math.floor(Math.random() * this.gameWidth / this.gridSize) * this.gridSize, y: 0};
            case 1: // Right
                return {x: this.gameWidth - this.gridSize, y: Math.floor(Math.random() * this.gameHeight / this.gridSize) * this.gridSize};
            case 2: // Bottom
                return {x: Math.floor(Math.random() * this.gameWidth / this.gridSize) * this.gridSize, y: this.gameHeight - this.gridSize};
            case 3: // Left
                return {x: 0, y: Math.floor(Math.random() * this.gameHeight / this.gridSize) * this.gridSize};
        }
    }

    extendPath(start, direction, length) {
        return {
            x: start.x + direction.dx * length * this.gridSize,
            y: start.y + direction.dy * length * this.gridSize
        };
    }

    isOutOfBounds(point) {
        return point.x < 0 || point.x >= this.gameWidth || point.y < 0 || point.y >= this.gameHeight;
    }

    getClosestBorderPoint(point) {
        const distanceToTop = point.y;
        const distanceToRight = this.gameWidth - point.x;
        const distanceToBottom = this.gameHeight - point.y;
        const distanceToLeft = point.x;

        const minDistance = Math.min(distanceToTop, distanceToRight, distanceToBottom, distanceToLeft);

        if (minDistance === distanceToTop) return {x: point.x, y: 0};
        if (minDistance === distanceToRight) return {x: this.gameWidth - this.gridSize, y: point.y};
        if (minDistance === distanceToBottom) return {x: point.x, y: this.gameHeight - this.gridSize};
        return {x: 0, y: point.y};
    }

    getDistance(point1, point2) {
        return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = this.gridSize;
        ctx.stroke();

        // Dibujar puntos de inicio y fin
        ctx.fillStyle = '#00FF00';
        ctx.beginPath();
        ctx.arc(this.points[0].x, this.points[0].y, this.gridSize / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(this.points[this.points.length - 1].x, this.points[this.points.length - 1].y, this.gridSize / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}