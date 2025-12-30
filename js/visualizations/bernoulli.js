/**
 * Bernoulli's Principle Visualization
 * Demonstrates the relationship between fluid velocity and pressure
 * using a Venturi tube (converging-diverging duct)
 */

class BernoulliVisualization {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Physics constants
    this.AIR_DENSITY = 1.225; // kg/m³ at sea level
    this.ATMOSPHERIC_PRESSURE = 101325; // Pa (1 atm)

    // Configurable parameters
    this.baseVelocity = options.baseVelocity || 50; // m/s
    this.particleCount = options.particleCount || 150;

    // Venturi tube geometry (as fractions of canvas dimensions)
    this.tubeTop = 0.3;
    this.tubeBottom = 0.7;
    this.throatTop = 0.4;
    this.throatBottom = 0.6;
    this.throatStart = 0.35;
    this.throatEnd = 0.65;

    // Animation state
    this.isRunning = false;
    this.animationFrame = null;
    this.particles = [];
    this.lastTime = performance.now();

    this.init();
  }

  init() {
    this.createParticles();
    this.draw();
  }

  /**
   * Create particle system for flow visualization
   */
  createParticles() {
    this.particles = [];
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    for (let i = 0; i < this.particleCount; i++) {
      // Distribute particles randomly across the tube width and height
      const x = Math.random() * pixelWidth;
      const { top, bottom } = this.getTubeHeightAt(x);
      const tubeHeight = bottom - top;
      const y = top + Math.random() * tubeHeight;

      this.particles.push({
        x: x,
        y: y,
        baseY: y,
        speed: this.baseVelocity,
        size: 2.5,
        opacity: 0.5 + Math.random() * 0.5
      });
    }
  }

  /**
   * Calculate tube height at a given x position
   */
  getTubeHeightAt(x) {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);
    const normalizedX = x / pixelWidth;

    // Three sections: entrance, throat, exit
    if (normalizedX < this.throatStart) {
      // Converging section
      const t = normalizedX / this.throatStart;
      const top = this.tubeTop + (this.throatTop - this.tubeTop) * t;
      const bottom = this.tubeBottom - (this.tubeBottom - this.throatBottom) * t;
      return { top: top * pixelHeight, bottom: bottom * pixelHeight };

    } else if (normalizedX >= this.throatStart && normalizedX <= this.throatEnd) {
      // Throat (narrow section)
      return {
        top: this.throatTop * pixelHeight,
        bottom: this.throatBottom * pixelHeight
      };

    } else {
      // Diverging section
      const t = (normalizedX - this.throatEnd) / (1 - this.throatEnd);
      const top = this.throatTop + (this.tubeTop - this.throatTop) * t;
      const bottom = this.throatBottom + (this.tubeBottom - this.throatBottom) * t;
      return { top: top * pixelHeight, bottom: bottom * pixelHeight };
    }
  }

  /**
   * Calculate velocity at a given x position using continuity equation
   * A1·v1 = A2·v2 (conservation of mass)
   */
  getVelocityAt(x) {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Reference area (entrance)
    const entranceHeight = (this.tubeBottom - this.tubeTop) * pixelHeight;

    // Current area
    const { top, bottom } = this.getTubeHeightAt(x);
    const currentHeight = bottom - top;

    // From continuity: v2 = v1 * (A1 / A2)
    // For 2D visualization: v2 = v1 * (h1 / h2)
    return this.baseVelocity * (entranceHeight / currentHeight);
  }

  /**
   * Calculate pressure using Bernoulli's equation
   * P + ½·ρ·v² = constant
   */
  getPressureAt(x) {
    const velocity = this.getVelocityAt(x);

    // Total pressure (constant along streamline)
    const totalPressure = this.ATMOSPHERIC_PRESSURE +
                          0.5 * this.AIR_DENSITY * Math.pow(this.baseVelocity, 2);

    // Static pressure at this point
    const staticPressure = totalPressure -
                           0.5 * this.AIR_DENSITY * Math.pow(velocity, 2);

    return staticPressure;
  }

  /**
   * Update particle positions
   */
  update(deltaTime) {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.particles.forEach(particle => {
      // Get local velocity based on position
      const localVelocity = this.getVelocityAt(particle.x);

      // Update position (scale velocity to pixels per second)
      const pixelsPerSecond = (localVelocity / this.baseVelocity) * 150;
      particle.x += pixelsPerSecond * deltaTime;

      // Wrap around when particle exits
      if (particle.x > pixelWidth) {
        particle.x = 0;
        // Randomize y position slightly
        const { top, bottom } = this.getTubeHeightAt(0);
        const tubeHeight = bottom - top;
        particle.y = top + Math.random() * tubeHeight;
      }

      // Keep particle within tube bounds
      const { top, bottom } = this.getTubeHeightAt(particle.x);
      const tubeHeight = bottom - top;

      // Adjust y position to stay centered with slight variation
      const centerY = (top + bottom) / 2;
      const offset = (particle.baseY - pixelHeight * this.tubeTop) /
                     (pixelHeight * (this.tubeBottom - this.tubeTop));
      particle.y = centerY + (offset - 0.5) * tubeHeight * 0.8;
    });
  }

  /**
   * Draw the visualization
   */
  draw() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Clear canvas
    this.ctx.fillStyle = '#FAFAFA';
    this.ctx.fillRect(0, 0, pixelWidth, pixelHeight);

    // Draw Venturi tube
    this.drawTube();

    // Draw particles
    this.drawParticles();

    // Draw pressure indicators
    this.drawPressureIndicators();

    // Draw velocity indicators
    this.drawVelocityIndicators();

    // Draw labels
    this.drawLabels();
  }

  /**
   * Draw the Venturi tube shape
   */
  drawTube() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.ctx.strokeStyle = '#546E7A';
    this.ctx.lineWidth = 3;
    this.ctx.fillStyle = 'rgba(74, 144, 226, 0.05)';

    // Draw top surface
    this.ctx.beginPath();
    this.ctx.moveTo(0, pixelHeight * this.tubeTop);

    for (let x = 0; x <= pixelWidth; x += 2) {
      const { top } = this.getTubeHeightAt(x);
      this.ctx.lineTo(x, top);
    }

    // Draw bottom surface (in reverse)
    for (let x = pixelWidth; x >= 0; x -= 2) {
      const { bottom } = this.getTubeHeightAt(x);
      this.ctx.lineTo(x, bottom);
    }

    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  /**
   * Draw flow particles
   */
  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.fillStyle = `rgba(33, 150, 243, ${particle.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  /**
   * Draw pressure indicators at three points
   * Bars shrink from bottom towards bottom to show pressure decrease
   */
  drawPressureIndicators() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    const positions = [
      { x: pixelWidth * 0.15, label: 'Entrance' },
      { x: pixelWidth * 0.5, label: 'Throat' },
      { x: pixelWidth * 0.85, label: 'Exit' }
    ];

    const { bottom } = this.getTubeHeightAt(pixelWidth * 0.5);
    const maxBarHeight = 80;
    const barWidth = 35;
    const barBottomY = bottom + 30 + maxBarHeight; // Bottom of bar area

    // Use a FIXED maximum pressure drop for consistent scaling
    // Based on velocity at 100 m/s (max slider value)
    const referenceVelocity = 100;
    const referenceThroatVelocity = referenceVelocity *
      ((this.tubeBottom - this.tubeTop) / (this.throatBottom - this.throatTop));
    const maxPossibleDrop = 0.5 * this.AIR_DENSITY *
                           (Math.pow(referenceThroatVelocity, 2) - Math.pow(referenceVelocity, 2));

    const entrancePressure = this.getPressureAt(pixelWidth * 0.15);

    positions.forEach(pos => {
      const pressure = this.getPressureAt(pos.x);

      // Calculate pressure drop relative to entrance
      const pressureDrop = entrancePressure - pressure;

      // Normalize against FIXED maximum (so slider changes are visible)
      const dropRatio = Math.max(0, Math.min(1, pressureDrop / Math.abs(maxPossibleDrop)));
      const barHeight = maxBarHeight * (1 - dropRatio);

      const barX = pos.x - barWidth / 2;

      // Draw background container
      this.ctx.strokeStyle = '#9E9E9E';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(barX, barBottomY - maxBarHeight, barWidth, maxBarHeight);

      // Color based on pressure level
      const normalizedHeight = barHeight / maxBarHeight;

      if (normalizedHeight < 0.5) {
        // Low pressure: orange to red
        this.ctx.fillStyle = `rgb(255, ${Math.floor(normalizedHeight * 140)}, 53)`;
      } else {
        // Higher pressure: orange to green
        const green = Math.floor(100 + normalizedHeight * 155);
        this.ctx.fillStyle = `rgb(${Math.floor(255 - normalizedHeight * 80)}, ${green}, 53)`;
      }

      // Fill from bottom up (shrinks towards bottom when pressure drops)
      this.ctx.fillRect(barX, barBottomY - barHeight, barWidth, barHeight);

      // Draw label above bar
      this.ctx.fillStyle = '#212121';
      this.ctx.font = 'bold 11px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(pos.label, pos.x, barBottomY - maxBarHeight - 8);

      // Pressure drop value below bar
      this.ctx.font = '11px Inter, sans-serif';
      this.ctx.fillStyle = '#424242';
      this.ctx.fillText(
        `${(pressureDrop / 1000).toFixed(2)} kPa`,
        pos.x,
        barBottomY + 15
      );

      // Add "LOW" indicator for significant drops
      this.ctx.font = 'bold 10px Inter, sans-serif';
      if (normalizedHeight < 0.4) {
        this.ctx.fillStyle = '#D32F2F';
        this.ctx.fillText('LOW', pos.x, barBottomY + 28);
      } else if (normalizedHeight > 0.8) {
        this.ctx.fillStyle = '#388E3C';
        this.ctx.fillText('NORMAL', pos.x, barBottomY + 28);
      }
    });

    // Add title above pressure bars
    this.ctx.fillStyle = '#424242';
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Pressure Level', pixelWidth / 2, barBottomY - maxBarHeight - 22);
  }

  /**
   * Draw velocity indicators
   */
  drawVelocityIndicators() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    const positions = [
      pixelWidth * 0.15,
      pixelWidth * 0.5,
      pixelWidth * 0.85
    ];

    positions.forEach(x => {
      const velocity = this.getVelocityAt(x);
      const { top } = this.getTubeHeightAt(x);

      // Draw velocity arrow
      const arrowLength = (velocity / this.baseVelocity) * 40;

      this.ctx.strokeStyle = '#2196F3';
      this.ctx.fillStyle = '#2196F3';
      this.ctx.lineWidth = 2;

      // Arrow shaft
      const arrowY = top - 25;
      this.ctx.beginPath();
      this.ctx.moveTo(x, arrowY);
      this.ctx.lineTo(x + arrowLength, arrowY);
      this.ctx.stroke();

      // Arrow head
      this.ctx.beginPath();
      this.ctx.moveTo(x + arrowLength, arrowY);
      this.ctx.lineTo(x + arrowLength - 5, arrowY - 3);
      this.ctx.lineTo(x + arrowLength - 5, arrowY + 3);
      this.ctx.closePath();
      this.ctx.fill();

      // Velocity value
      this.ctx.fillStyle = '#212121';
      this.ctx.font = '11px Inter, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`${velocity.toFixed(1)} m/s`, x, arrowY - 10);
    });
  }

  /**
   * Draw section labels
   */
  drawLabels() {
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.ctx.fillStyle = '#757575';
    this.ctx.font = 'bold 14px Inter, sans-serif';
    this.ctx.textAlign = 'center';

    const labelY = pixelHeight * 0.15;

    this.ctx.fillText('Velocity →', this.width / (window.devicePixelRatio || 1) / 2, labelY);
  }

  /**
   * Set base velocity (called from slider)
   */
  setVelocity(velocity) {
    this.baseVelocity = velocity;
    // Redraw immediately to show changes
    if (!this.isRunning) {
      this.draw();
    }
  }

  /**
   * Start animation
   */
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.animate();
    }
  }

  /**
   * Stop animation
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stop();
    this.particles = [];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BernoulliVisualization;
}
