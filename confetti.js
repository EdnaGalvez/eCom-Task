// Confetti Particle Effect
// AuraTask - Premium UI interaction

export function triggerConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = [
    '#2967A3', // Medium Blue
    '#4577B2', // Medium-Light Blue
    '#18A0D8', // Vibrant Sky Blue
    '#022840', // Dark Navy
    '#D5DCF2', // Light Lavender-Blue
    '#10B981', // Success Green
    '#F59E0B'  // Accent Gold
  ];

  const particles = [];
  const particleCount = 120;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - height - 20; // Start above viewport
      this.size = Math.random() * 8 + 4;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedY = Math.random() * 5 + 3;
      this.speedX = Math.random() * 4 - 2;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 4 - 2;
      this.opacity = 1;
      this.decay = Math.random() * 0.01 + 0.005;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotationSpeed;
      this.opacity -= this.decay;
      
      // Add wind swing
      this.speedX += Math.sin(this.y / 30) * 0.05;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      
      // Draw rectangular confetti piece
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 1.5);
      ctx.restore();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    let activeParticles = 0;
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.opacity > 0 && p.y < height) {
        p.update();
        p.draw();
        activeParticles++;
      }
    }
    
    if (activeParticles > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  animate();
}
