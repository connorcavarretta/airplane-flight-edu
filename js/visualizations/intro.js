/**
 * Introduction Preview Visualization
 * A simple looping animation showing takeoff with four forces
 */

class IntroVisualization {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Animation state
    this.isRunning = false;
    this.animationFrame = null;
    this.lastTime = 0;
    this.time = 0;

    // Airplane position and state
    this.airplane = {
      x: 0,
      y: 0,
      rotation: 0,
      onGround: true
    };

    // Ground level
    this.groundLevel = 0;

    // Force visibility (fade in during animation)
    this.forceAlpha = 0;

    this.init();
  }

  init() {
    this.resetDimensions();
    this.draw();
  }

  /**
   * Calculate responsive dimensions
   */
  resetDimensions() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.groundLevel = pixelHeight - 60;
    this.airplane.x = pixelWidth * 0.2;
    this.airplane.y = this.groundLevel - 15;
  }

  /**
   * Start animation
   */
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.time = 0;
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
      this.animationFrame = null;
    }
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Update animation state
   */
  update(deltaTime) {
    this.time += deltaTime;

    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Loop duration: 6 seconds
    const loopDuration = 6;
    const t = (this.time % loopDuration) / loopDuration; // 0 to 1

    if (t < 0.3) {
      // Phase 1: On ground, accelerating (0 - 1.8s)
      const phase = t / 0.3;
      this.airplane.x = pixelWidth * (0.15 + phase * 0.15);
      this.airplane.y = this.groundLevel - 15;
      this.airplane.rotation = 0;
      this.airplane.onGround = true;
      this.forceAlpha = Math.min(phase * 2, 1); // Forces fade in
    } else if (t < 0.5) {
      // Phase 2: Rotation and liftoff (1.8s - 3s)
      const phase = (t - 0.3) / 0.2;
      this.airplane.x = pixelWidth * (0.3 + phase * 0.1);
      this.airplane.y = this.groundLevel - 15 - phase * 40;
      this.airplane.rotation = -phase * 12; // Nose up
      this.airplane.onGround = false;
      this.forceAlpha = 1;
    } else if (t < 0.85) {
      // Phase 3: Climbing (3s - 5.1s)
      const phase = (t - 0.5) / 0.35;
      this.airplane.x = pixelWidth * (0.4 + phase * 0.3);
      this.airplane.y = this.groundLevel - 55 - phase * 80;
      this.airplane.rotation = -10;
      this.airplane.onGround = false;
      this.forceAlpha = 1;
    } else {
      // Phase 4: Fade out and reset (5.1s - 6s)
      const phase = (t - 0.85) / 0.15;
      this.airplane.x = pixelWidth * 0.7 + phase * pixelWidth * 0.2;
      this.airplane.y = this.groundLevel - 135;
      this.airplane.rotation = -5;
      this.airplane.onGround = false;
      this.forceAlpha = 1 - phase; // Fade out
    }
  }

  /**
   * Draw visualization
   */
  draw() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Clear canvas - sky gradient
    const skyGradient = this.ctx.createLinearGradient(0, 0, 0, pixelHeight);
    skyGradient.addColorStop(0, '#E3F2FD');
    skyGradient.addColorStop(1, '#BBDEFB');
    this.ctx.fillStyle = skyGradient;
    this.ctx.fillRect(0, 0, pixelWidth, pixelHeight);

    // Draw clouds
    this.drawClouds();

    // Draw ground
    this.drawGround();

    // Draw runway
    this.drawRunway();

    // Draw airplane
    this.drawAirplane();

    // Draw force arrows
    if (this.forceAlpha > 0) {
      this.drawForces();
    }

    // Draw title text
    this.drawTitle();
  }

  /**
   * Draw simple clouds
   */
  drawClouds() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

    // Cloud 1
    this.drawCloud(pixelWidth * 0.15, 40, 40);

    // Cloud 2
    this.drawCloud(pixelWidth * 0.6, 60, 50);

    // Cloud 3
    this.drawCloud(pixelWidth * 0.85, 35, 35);
  }

  /**
   * Draw a simple cloud
   */
  drawCloud(x, y, size) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.4, y, size * 0.6, 0, Math.PI * 2);
    this.ctx.arc(x + size * 0.8, y, size * 0.4, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw ground
   */
  drawGround() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    const groundGradient = this.ctx.createLinearGradient(0, this.groundLevel, 0, pixelHeight);
    groundGradient.addColorStop(0, '#8BC34A');
    groundGradient.addColorStop(1, '#689F38');

    this.ctx.fillStyle = groundGradient;
    this.ctx.fillRect(0, this.groundLevel, pixelWidth, pixelHeight - this.groundLevel);

    // Horizon line
    this.ctx.strokeStyle = '#558B2F';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.groundLevel);
    this.ctx.lineTo(pixelWidth, this.groundLevel);
    this.ctx.stroke();
  }

  /**
   * Draw runway
   */
  drawRunway() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const runwayY = this.groundLevel - 10;

    // Runway surface
    this.ctx.fillStyle = '#616161';
    this.ctx.fillRect(0, runwayY, pixelWidth * 0.6, 20);

    // Centerline
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([15, 15]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, runwayY + 10);
    this.ctx.lineTo(pixelWidth * 0.6, runwayY + 10);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  /**
   * Draw airplane (side view)
   */
  drawAirplane() {
    this.ctx.save();
    this.ctx.translate(this.airplane.x, this.airplane.y);
    this.ctx.rotate((this.airplane.rotation * Math.PI) / 180);

    const scale = 0.5;
    this.ctx.scale(scale, scale);

    // Fuselage
    const fuselageGradient = this.ctx.createLinearGradient(0, -12, 0, 12);
    fuselageGradient.addColorStop(0, '#ECEFF1');
    fuselageGradient.addColorStop(0.5, '#CFD8DC');
    fuselageGradient.addColorStop(1, '#90A4AE');

    this.ctx.fillStyle = fuselageGradient;
    this.ctx.strokeStyle = '#546E7A';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(50, 0);
    this.ctx.lineTo(40, -8);
    this.ctx.lineTo(-30, -10);
    this.ctx.lineTo(-45, -8);
    this.ctx.lineTo(-45, 8);
    this.ctx.lineTo(-30, 10);
    this.ctx.lineTo(40, 8);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Wing
    const wingGradient = this.ctx.createLinearGradient(0, -5, 0, 5);
    wingGradient.addColorStop(0, '#64B5F6');
    wingGradient.addColorStop(1, '#42A5F5');

    this.ctx.fillStyle = wingGradient;
    this.ctx.strokeStyle = '#1976D2';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(-10, -10);
    this.ctx.lineTo(15, -10);
    this.ctx.lineTo(20, -2);
    this.ctx.lineTo(-5, -2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Tail
    this.ctx.fillStyle = '#42A5F5';
    this.ctx.strokeStyle = '#1976D2';
    this.ctx.beginPath();
    this.ctx.moveTo(-45, -8);
    this.ctx.lineTo(-35, -8);
    this.ctx.lineTo(-33, -3);
    this.ctx.lineTo(-43, -3);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Windows
    this.ctx.fillStyle = '#546E7A';
    for (let i = 0; i < 6; i++) {
      const windowX = 25 - i * 6;
      this.ctx.fillRect(windowX, -5, 3, 3);
    }

    this.ctx.restore();
  }

  /**
   * Draw force arrows
   */
  drawForces() {
    this.ctx.save();
    this.ctx.globalAlpha = this.forceAlpha;

    const arrowLength = 50;
    const x = this.airplane.x;
    const y = this.airplane.y;

    // Lift (green, up)
    this.drawArrow(x, y, x, y - arrowLength, '#4CAF50', 'Lift');

    // Weight (red, down)
    this.drawArrow(x, y, x, y + arrowLength, '#F44336', 'Weight');

    // Thrust (blue, forward)
    this.drawArrow(x, y, x + arrowLength, y, '#2196F3', 'Thrust');

    // Drag (orange, backward)
    this.drawArrow(x, y, x - arrowLength * 0.6, y, '#FF9800', 'Drag');

    this.ctx.restore();
  }

  /**
   * Draw an arrow with label
   */
  drawArrow(x1, y1, x2, y2, color, label) {
    const headLength = 10;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    // Line
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();

    // Arrowhead
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(x2, y2);
    this.ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Label
    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Position label at end of arrow
    let labelX = x2;
    let labelY = y2;

    if (label === 'Lift') {
      labelY -= 15;
    } else if (label === 'Weight') {
      labelY += 15;
    } else if (label === 'Thrust') {
      labelX += 20;
    } else if (label === 'Drag') {
      labelX -= 15;
    }

    this.ctx.fillText(label, labelX, labelY);
  }

  /**
   * Draw title text
   */
  drawTitle() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);

    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 14px Inter, sans-serif';
    this.ctx.textAlign = 'center';
  }

  /**
   * Clean up
   */
  destroy() {
    this.stop();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntroVisualization;
}
