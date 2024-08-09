// path.js
class Path {
    constructor(gameWidth, gameHeight, gridSize) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.gridSize = gridSize;
        this.margin = 20 * gridSize; // 20 celdas de margen
        this.cornerMargin = 30 * gridSize; // 30 celdas de margen en las esquinas
        this.points = [];
        this.generateSmoothPath();
    }

    generateSmoothPath() {
        const targetLength = 2200;
        let currentLength = 0;
        const minSegmentLength = 5;

        // Elegir un punto de inicio y dirección inicial
        let { startPoint, initialDirection } = this.getStartPointAndDirection();
        this.points.push(startPoint);

        let currentPoint = startPoint;
        let lastDirection = initialDirection;

        while (currentLength < targetLength) {
            let direction = this.getNextDirection(lastDirection);
            let segmentLength = Math.max(minSegmentLength, Math.floor(Math.random() * (targetLength - currentLength) / 2));
            
            let nextPoint = this.extendPath(currentPoint, direction, segmentLength);
            
            // Ajustar el punto si está dentro del margen, excepto si es el último punto
            if (currentLength + this.getDistance(currentPoint, nextPoint) < targetLength) {
                nextPoint = this.adjustPointToMargin(nextPoint);
            }
            
            if (this.isOutOfBounds(nextPoint) || this.isSamePoint(currentPoint, nextPoint)) {
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

    getStartPointAndDirection() {
        const side = Math.floor(Math.random() * 4);
        let startPoint, initialDirection;

        switch(side) {
            case 0: // Top
                startPoint = { x: this.cornerMargin + Math.floor(Math.random() * (this.gameWidth - 2 * this.cornerMargin) / this.gridSize) * this.gridSize, y: 0 };
                initialDirection = { dx: 0, dy: 1 };
                break;
            case 1: // Right
                startPoint = { x: this.gameWidth - this.gridSize, y: this.cornerMargin + Math.floor(Math.random() * (this.gameHeight - 2 * this.cornerMargin) / this.gridSize) * this.gridSize };
                initialDirection = { dx: -1, dy: 0 };
                break;
            case 2: // Bottom
                startPoint = { x: this.cornerMargin + Math.floor(Math.random() * (this.gameWidth - 2 * this.cornerMargin) / this.gridSize) * this.gridSize, y: this.gameHeight - this.gridSize };
                initialDirection = { dx: 0, dy: -1 };
                break;
            case 3: // Left
                startPoint = { x: 0, y: this.cornerMargin + Math.floor(Math.random() * (this.gameHeight - 2 * this.cornerMargin) / this.gridSize) * this.gridSize };
                initialDirection = { dx: 1, dy: 0 };
                break;
        }

        return { startPoint, initialDirection };
    }

    adjustPointToMargin(point) {
        return {
            x: Math.max(this.margin, Math.min(this.gameWidth - this.margin, point.x)),
            y: Math.max(this.margin, Math.min(this.gameHeight - this.margin, point.y))
        };
    }

    isSamePoint(point1, point2) {
        return point1.x === point2.x && point1.y === point2.y;
    }

    getNextDirection(lastDirection) {
        const directions = [
            {dx: 0, dy: -1},  // Up
            {dx: 1, dy: 0},   // Right
            {dx: 0, dy: 1},   // Down
            {dx: -1, dy: 0}   // Left
        ];

        // Filtrar direcciones que no resulten en un giro de 180 grados
        const validDirections = directions.filter(dir => 
            !(dir.dx === -lastDirection.dx && dir.dy === -lastDirection.dy)
        );

        return validDirections[Math.floor(Math.random() * validDirections.length)];
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

        // Dibujar el área de margen (para depuración)
        ctx.strokeStyle = 'rgba(0, 0, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.margin, this.margin, this.gameWidth - 2 * this.margin, this.gameHeight - 2 * this.margin);
    }
}