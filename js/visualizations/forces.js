/**
 * Four Forces of Flight Visualization
 * Demonstrates lift, weight, thrust, and drag forces acting on an aircraft
 */

class ForcesVisualization {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Force values (0-100 from sliders, we'll scale them)
    this.lift = options.lift || 50;
    this.weight = options.weight || 50;
    this.thrust = options.thrust || 50;
    this.drag = options.drag || 50;

    // Airplane position and state
    this.planeX = 0;
    this.planeY = 0;
    this.planeRotation = 0; // in radians
    this.verticalVelocity = 0;
    this.horizontalVelocity = 0;

    // Animation state
    this.isRunning = false;
    this.animationFrame = null;
    this.lastTime = performance.now();

    // Visual settings
    this.maxArrowLength = 100; // pixels

    this.init();
  }

  init() {
    this.resetPlanePosition();
    this.draw();
  }

  /**
   * Reset airplane to center position
   */
  resetPlanePosition() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.planeX = pixelWidth / 2;
    this.planeY = pixelHeight / 2;
    this.planeRotation = 0;
    this.verticalVelocity = 0;
    this.horizontalVelocity = 0;
  }

  /**
   * Reset everything to level flight
   */
  reset() {
    this.lift = 50;
    this.weight = 50;
    this.thrust = 50;
    this.drag = 50;
    this.resetPlanePosition();

    if (!this.isRunning) {
      this.draw();
    }
  }

  /**
   * Update forces from sliders
   */
  setForces(lift, weight, thrust, drag) {
    this.lift = lift;
    this.weight = weight;
    this.thrust = thrust;
    this.drag = drag;

    // Redraw immediately
    if (!this.isRunning) {
      this.draw();
    }
  }

  /**
   * Calculate net forces and update airplane state
   */
  update(deltaTime) {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Calculate net forces
    const netVertical = this.lift - this.weight;
    const netHorizontal = this.thrust - this.drag;

    // Update velocities (scaled down for smooth animation)
    const velocityScale = 0.5;
    this.verticalVelocity += netVertical * velocityScale * deltaTime;
    this.horizontalVelocity += netHorizontal * velocityScale * deltaTime;

    // Apply damping to prevent runaway velocities
    this.verticalVelocity *= 0.95;
    this.horizontalVelocity *= 0.95;

    // Update position
    this.planeY -= this.verticalVelocity * deltaTime; // negative because up is negative Y
    this.planeX += this.horizontalVelocity * deltaTime;

    // Keep plane within bounds (with some padding)
    const padding = 100;
    this.planeX = Math.max(padding, Math.min(pixelWidth - padding, this.planeX));
    this.planeY = Math.max(padding, Math.min(pixelHeight - padding, this.planeY));

    // Calculate rotation based on forces
    // Pitch up when lift > weight, pitch down when weight > lift
    const targetRotation = -netVertical * 0.003; // Negative for pitch up when climbing
    this.planeRotation += (targetRotation - this.planeRotation) * 0.1; // Smooth interpolation
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

    // Draw grid for reference
    this.drawGrid();

    // Draw force vectors
    this.drawForceVectors();

    // Draw airplane
    this.drawAirplane();

    // Draw force values
    this.drawForceValues();

    // Draw flight state
    this.drawFlightState();
  }

  /**
   * Draw subtle grid
   */
  drawGrid() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 1;

    // Horizontal center line
    this.ctx.beginPath();
    this.ctx.moveTo(0, pixelHeight / 2);
    this.ctx.lineTo(pixelWidth, pixelHeight / 2);
    this.ctx.stroke();

    // Vertical center line
    this.ctx.beginPath();
    this.ctx.moveTo(pixelWidth / 2, 0);
    this.ctx.lineTo(pixelWidth / 2, pixelHeight);
    this.ctx.stroke();
  }

  /**
   * Draw airplane shape - side view (compact, general aviation style)
   */
  drawAirplane() {
    this.ctx.save();
    this.ctx.translate(this.planeX, this.planeY);
    this.ctx.rotate(this.planeRotation);

    // Scale down the entire airplane
    this.ctx.scale(0.7, 0.7);

    // Main fuselage (side view) - compact body
    const fuselageGradient = this.ctx.createLinearGradient(0, -12, 0, 12);
    fuselageGradient.addColorStop(0, '#90A4AE');
    fuselageGradient.addColorStop(0.5, '#78909C');
    fuselageGradient.addColorStop(1, '#546E7A');

    this.ctx.fillStyle = fuselageGradient;
    this.ctx.strokeStyle = '#37474F';
    this.ctx.lineWidth = 2.5;

    // Fuselage outline - shorter design
    this.ctx.beginPath();
    // Nose (pointed front)
    this.ctx.moveTo(50, 0);
    // Top of fuselage
    this.ctx.bezierCurveTo(50, -10, 40, -12, 20, -12);
    this.ctx.lineTo(-25, -12);
    this.ctx.bezierCurveTo(-35, -12, -42, -10, -45, -8);
    // Tail end top
    this.ctx.lineTo(-45, -4);
    // Bottom of tail
    this.ctx.bezierCurveTo(-42, 5, -35, 6, -25, 6);
    // Bottom of fuselage
    this.ctx.lineTo(20, 6);
    this.ctx.bezierCurveTo(40, 6, 50, 4, 50, 0);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Wing (single wing visible from side)
    const wingGradient = this.ctx.createLinearGradient(0, 0, 0, 30);
    wingGradient.addColorStop(0, '#5C9FD6');
    wingGradient.addColorStop(0.5, '#4A90E2');
    wingGradient.addColorStop(1, '#3B7BC4');

    this.ctx.fillStyle = wingGradient;
    this.ctx.strokeStyle = '#2E5F8F';
    this.ctx.lineWidth = 2;

    // Main wing
    this.ctx.beginPath();
    this.ctx.moveTo(-5, 4);
    this.ctx.lineTo(-15, 4);
    this.ctx.lineTo(-20, 28);
    this.ctx.lineTo(-12, 30);
    this.ctx.lineTo(5, 6);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Wing detail line
    this.ctx.strokeStyle = '#2E5F8F';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(-14, 18);
    this.ctx.lineTo(0, 5);
    this.ctx.stroke();

    // Tail fin (vertical stabilizer)
    this.ctx.fillStyle = '#4A90E2';
    this.ctx.strokeStyle = '#2E5F8F';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(-45, -4);
    this.ctx.lineTo(-47, -6);
    this.ctx.lineTo(-50, -24);
    this.ctx.lineTo(-44, -22);
    this.ctx.lineTo(-38, -8);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Horizontal stabilizer
    this.ctx.beginPath();
    this.ctx.moveTo(-45, -2);
    this.ctx.lineTo(-52, 0);
    this.ctx.lineTo(-53, 3);
    this.ctx.lineTo(-48, 4);
    this.ctx.lineTo(-40, 2);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Nose cone detail
    this.ctx.fillStyle = '#263238';
    this.ctx.strokeStyle = '#1A1A1A';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(50, 0);
    this.ctx.bezierCurveTo(50, -6, 46, -8, 42, -8);
    this.ctx.bezierCurveTo(46, -8, 50, -6, 50, 0);
    this.ctx.fill();
    this.ctx.stroke();

    // Nose tip
    this.ctx.fillStyle = '#37474F';
    this.ctx.beginPath();
    this.ctx.arc(50, 0, 2, 0, Math.PI * 2);
    this.ctx.fill();

    // Cockpit window (angled)
    this.ctx.fillStyle = '#64B5F6';
    this.ctx.strokeStyle = '#1976D2';
    this.ctx.lineWidth = 1.5;

    this.ctx.beginPath();
    this.ctx.moveTo(35, -10);
    this.ctx.lineTo(42, -7);
    this.ctx.lineTo(40, -3);
    this.ctx.lineTo(32, -6);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Window highlight
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    this.ctx.beginPath();
    this.ctx.moveTo(36, -8);
    this.ctx.lineTo(39, -6);
    this.ctx.lineTo(38, -5);
    this.ctx.lineTo(35, -6);
    this.ctx.closePath();
    this.ctx.fill();

    // Side windows (smaller, fewer)
    this.ctx.fillStyle = '#90CAF9';
    this.ctx.strokeStyle = '#2196F3';
    this.ctx.lineWidth = 1;

    const windowPositions = [20, 5, -10];
    windowPositions.forEach(x => {
      this.ctx.beginPath();
      this.ctx.roundRect(x - 3, -9, 5, 4, 1);
      this.ctx.fill();
      this.ctx.stroke();
    });

    this.ctx.restore();
  }

  /**
   * Draw force vectors as arrows
   */
  drawForceVectors() {
    const arrowScale = this.maxArrowLength / 100;

    // Lift (green, pointing up)
    this.drawArrow(
      this.planeX,
      this.planeY,
      0,
      -this.lift * arrowScale,
      '#4CAF50',
      'Lift'
    );

    // Weight (red, pointing down)
    this.drawArrow(
      this.planeX,
      this.planeY,
      0,
      this.weight * arrowScale,
      '#F44336',
      'Weight'
    );

    // Thrust (blue, pointing right)
    this.drawArrow(
      this.planeX,
      this.planeY,
      this.thrust * arrowScale,
      0,
      '#2196F3',
      'Thrust'
    );

    // Drag (orange, pointing left)
    this.drawArrow(
      this.planeX,
      this.planeY,
      -this.drag * arrowScale,
      0,
      '#FF9800',
      'Drag'
    );
  }

  /**
   * Draw a single arrow
   */
  drawArrow(startX, startY, dx, dy, color, label) {
    const arrowLength = Math.sqrt(dx * dx + dy * dy);
    if (arrowLength < 5) return; // Don't draw tiny arrows

    const angle = Math.atan2(dy, dx);
    const endX = startX + dx;
    const endY = startY + dy;

    // Arrow shaft
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();

    // Arrow head
    const headLength = 12;
    const headAngle = Math.PI / 6;

    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(endX, endY);
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle - headAngle),
      endY - headLength * Math.sin(angle - headAngle)
    );
    this.ctx.lineTo(
      endX - headLength * Math.cos(angle + headAngle),
      endY - headLength * Math.sin(angle + headAngle)
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Label
    this.ctx.fillStyle = color;
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Position label at end of arrow
    const labelOffsetX = dx > 0 ? 20 : dx < 0 ? -20 : 0;
    const labelOffsetY = dy > 0 ? 20 : dy < 0 ? -20 : 0;
    this.ctx.fillText(label, endX + labelOffsetX, endY + labelOffsetY);
  }

  /**
   * Draw force values
   */
  drawForceValues() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);

    this.ctx.fillStyle = '#212121';
    this.ctx.font = '13px Inter, sans-serif';
    this.ctx.textAlign = 'left';

    const startX = 20;
    const startY = 30;
    const lineHeight = 22;

    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fillText(`Lift: ${this.lift}`, startX, startY);

    this.ctx.fillStyle = '#F44336';
    this.ctx.fillText(`Weight: ${this.weight}`, startX, startY + lineHeight);

    this.ctx.fillStyle = '#2196F3';
    this.ctx.fillText(`Thrust: ${this.thrust}`, startX, startY + lineHeight * 2);

    this.ctx.fillStyle = '#FF9800';
    this.ctx.fillText(`Drag: ${this.drag}`, startX, startY + lineHeight * 3);
  }

  /**
   * Draw flight state information
   */
  drawFlightState() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);

    const netVertical = this.lift - this.weight;
    const netHorizontal = this.thrust - this.drag;

    let verticalState = 'Level Flight';
    let horizontalState = 'Constant Speed';
    let stateColor = '#4CAF50';

    if (Math.abs(netVertical) > 5) {
      if (netVertical > 0) {
        verticalState = 'Climbing ↑';
        stateColor = '#4CAF50';
      } else {
        verticalState = 'Descending ↓';
        stateColor = '#FF6B35';
      }
    }

    if (Math.abs(netHorizontal) > 5) {
      if (netHorizontal > 0) {
        horizontalState = 'Accelerating →';
      } else {
        horizontalState = 'Decelerating ←';
      }
    }

    // Draw state box
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 2;
    const boxX = pixelWidth - 180;
    const boxY = 15;
    const boxWidth = 165;
    const boxHeight = 70;
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Draw state text
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 13px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Flight State:', boxX + 10, boxY + 20);

    this.ctx.fillStyle = stateColor;
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillText(verticalState, boxX + 10, boxY + 40);

    this.ctx.fillStyle = '#2196F3';
    this.ctx.fillText(horizontalState, boxX + 10, boxY + 58);
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
    const deltaTime = (currentTime - this.lastTime) / 1000;
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
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ForcesVisualization;
}
