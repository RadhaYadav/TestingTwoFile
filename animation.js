const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Ball class
class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = (Math.random() - 0.5) * 8;
        this.dy = (Math.random() - 0.5) * 8;
        this.mass = 1; // Add mass for collision calculations
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(balls) {
        // Bounce off walls
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Check collision with other balls
        balls.forEach(ball => {
            if (ball === this) return; // Skip self

            // Calculate distance between balls
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // If balls are colliding
            if (distance < this.radius + ball.radius) {
                // Collision resolution
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate velocities
                const vx1 = this.dx * cos + this.dy * sin;
                const vy1 = this.dy * cos - this.dx * sin;
                const vx2 = ball.dx * cos + ball.dy * sin;
                const vy2 = ball.dy * cos - ball.dx * sin;

                // Swap the velocities
                this.dx = vx2 * cos - vy1 * sin;
                this.dy = vy1 * cos + vx2 * sin;
                ball.dx = vx1 * cos - vy2 * sin;
                ball.dy = vy2 * cos + vx1 * sin;

                // Move balls apart to prevent sticking
                const overlap = (this.radius + ball.radius - distance) / 2;
                const moveX = cos * overlap;
                const moveY = sin * overlap;
                this.x -= moveX;
                this.y -= moveY;
                ball.x += moveX;
                ball.y += moveY;
            }
        });

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Random color generator
function getRandomColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
                   '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB', 
                   '#E74C3C', '#2ECC71'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Create balls
const balls = [
    new Ball(400, 300, 20, 'blue'),
    new Ball(200, 200, 20, 'yellow'),
    new Ball(600, 400, 20, 'red'),
    new Ball(300, 500, 20, 'white'),
    new Ball(500, 100, 20, 'purple'),
    // Add 4 new balls with random positions and colors
    new Ball(Math.random() * canvas.width, Math.random() * canvas.height, 20, getRandomColor()),
    new Ball(Math.random() * canvas.width, Math.random() * canvas.height, 20, getRandomColor()),
    new Ball(Math.random() * canvas.width, Math.random() * canvas.height, 20, getRandomColor()),
    new Ball(Math.random() * canvas.width, Math.random() * canvas.height, 20, getRandomColor())
];

// Animation loop
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    balls.forEach(ball => ball.update(balls));
    requestAnimationFrame(animate);
}

animate();

document.addEventListener('DOMContentLoaded', function() {
    const ball = document.getElementById('bouncing-ball');
    let x = 0;
    let y = 0;
    let dx = 2;
    let dy = 2;
    
    function animate() {
        const box = ball.parentElement;
        const maxX = box.clientWidth - ball.clientWidth;
        const maxY = box.clientHeight - ball.clientHeight;

        x += dx;
        y += dy;

        if (x >= maxX || x <= 0) dx = -dx;
        if (y >= maxY || y <= 0) dy = -dy;

        ball.style.left = x + 'px';
        ball.style.top = y + 'px';

        requestAnimationFrame(animate);
    }

    animate();

    // Add some sparkles when clicking anywhere
    document.addEventListener('click', function(e) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = (e.clientX - 10) + 'px';
        sparkle.style.top = (e.clientY - 10) + 'px';
        sparkle.style.width = '20px';
        sparkle.style.height = '20px';
        sparkle.style.background = 'url("https://media.giphy.com/media/UVk5yzljef0kGiayL1/giphy.gif")';
        sparkle.style.backgroundSize = 'cover';
        sparkle.style.pointerEvents = 'none';
        document.body.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1000);
    });
}); 
