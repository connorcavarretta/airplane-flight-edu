/**
 * Flight Phases Visualization
 * Demonstrates the different phases of flight with animations
 */

class FlightPhasesVisualization {
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
    this.isPlaying = false;
    this.animationFrame = null;
    this.lastTime = 0;

    // Current phase
    this.currentPhase = 'cruise';
    this.phaseProgress = 0; // 0 to 1 for animations within a phase

    // Airplane state
    this.airplane = {
      x: 0,
      y: 0,
      rotation: 0, // pitch angle
      targetX: 0,
      targetY: 0,
      targetRotation: 0,
      velocity: 0,
      targetVelocity: 0
    };

    // Ground level
    this.groundLevel = 0;
    this.runwayStart = 0;
    this.runwayEnd = 0;

    // Auto-play sequence
    this.autoPlayEnabled = false;
    this.phaseSequence = ['takeoff', 'climb', 'cruise', 'descent', 'landing'];
    this.currentPhaseIndex = 2; // Start at cruise
    this.phaseDuration = 3000; // 3 seconds per phase
    this.phaseStartTime = 0;

    this.init();
  }

  init() {
    this.resetDimensions();
    this.setPhase('cruise');
    this.draw();
  }

  /**
   * Calculate responsive dimensions
   */
  resetDimensions() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.groundLevel = pixelHeight - 80;
    this.runwayStart = 50;
    this.runwayEnd = pixelWidth - 50;
  }

  /**
   * Set current phase
   */
  setPhase(phase) {
    this.currentPhase = phase;
    this.phaseProgress = 0;
    this.phaseStartTime = performance.now();

    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Set airplane position and rotation for each phase
    switch (phase) {
      case 'takeoff':
        this.airplane.targetX = pixelWidth * 0.2;
        this.airplane.targetY = this.groundLevel - 20; // On runway
        this.airplane.targetRotation = 0;
        this.airplane.targetVelocity = 60;
        break;

      case 'climb':
        this.airplane.targetX = pixelWidth * 0.35;
        this.airplane.targetY = pixelHeight * 0.4;
        this.airplane.targetRotation = -15; // Nose up
        this.airplane.targetVelocity = 70;
        break;

      case 'cruise':
        this.airplane.targetX = pixelWidth * 0.5;
        this.airplane.targetY = pixelHeight * 0.3;
        this.airplane.targetRotation = 0; // Level
        this.airplane.targetVelocity = 80;
        break;

      case 'descent':
        this.airplane.targetX = pixelWidth * 0.65;
        this.airplane.targetY = pixelHeight * 0.5;
        this.airplane.targetRotation = 5; // Slight nose down
        this.airplane.targetVelocity = 65;
        break;

      case 'landing':
        this.airplane.targetX = pixelWidth * 0.8;
        this.airplane.targetY = this.groundLevel - 20; // Near ground
        this.airplane.targetRotation = 3; // Flare
        this.airplane.targetVelocity = 50;
        break;
    }

    // Immediately set position if this is first initialization
    if (this.airplane.x === 0 && this.airplane.y === 0) {
      this.airplane.x = this.airplane.targetX;
      this.airplane.y = this.airplane.targetY;
      this.airplane.rotation = this.airplane.targetRotation;
      this.airplane.velocity = this.airplane.targetVelocity;
    }
  }

  /**
   * Start animation
   */
  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      this.lastTime = performance.now();
      this.animate();
    }
  }

  /**
   * Stop animation
   */
  stop() {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Toggle auto-play
   */
  toggleAutoPlay() {
    this.autoPlayEnabled = !this.autoPlayEnabled;
    if (this.autoPlayEnabled) {
      this.phaseStartTime = performance.now();
      this.start();
    }
    return this.autoPlayEnabled;
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isPlaying) return;

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.draw();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Update animation state
   */
  update(deltaTime) {
    // Auto-play: advance through phases
    if (this.autoPlayEnabled) {
      const elapsed = performance.now() - this.phaseStartTime;
      if (elapsed >= this.phaseDuration) {
        // Move to next phase
        this.currentPhaseIndex = (this.currentPhaseIndex + 1) % this.phaseSequence.length;
        this.setPhase(this.phaseSequence[this.currentPhaseIndex]);
      }

      // Update progress (0 to 1) within current phase
      this.phaseProgress = Math.min((performance.now() - this.phaseStartTime) / this.phaseDuration, 1);
    }

    // Smooth interpolation to target position
    const smoothing = 0.05;
    this.airplane.x += (this.airplane.targetX - this.airplane.x) * smoothing;
    this.airplane.y += (this.airplane.targetY - this.airplane.y) * smoothing;
    this.airplane.rotation += (this.airplane.targetRotation - this.airplane.rotation) * smoothing;
    this.airplane.velocity += (this.airplane.targetVelocity - this.airplane.velocity) * smoothing;
  }

  /**
   * Draw visualization
   */
  draw() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Clear canvas
    this.ctx.fillStyle = '#E3F2FD'; // Sky blue
    this.ctx.fillRect(0, 0, pixelWidth, pixelHeight);

    // Draw ground
    this.drawGround();

    // Draw runway (for takeoff and landing)
    if (this.currentPhase === 'takeoff' || this.currentPhase === 'landing') {
      this.drawRunway();
    }

    // Draw altitude indicator
    this.drawAltitudeIndicator();

    // Draw airplane
    this.drawAirplane();

    // Draw phase info
    this.drawPhaseInfo();

    // Draw force indicators
    this.drawForceIndicators();
  }

  /**
   * Draw ground
   */
  drawGround() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Ground
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
    const runwayY = this.groundLevel - 15;

    // Runway surface
    this.ctx.fillStyle = '#616161';
    this.ctx.fillRect(this.runwayStart, runwayY, this.runwayEnd - this.runwayStart, 30);

    // Centerline markings
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([20, 20]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.runwayStart, runwayY + 15);
    this.ctx.lineTo(this.runwayEnd, runwayY + 15);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
  }

  /**
   * Draw altitude indicator
   */
  drawAltitudeIndicator() {
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Calculate altitude (0 at ground, max at top)
    const maxAltitude = 10000; // feet
    const altitudeFraction = 1 - (this.airplane.y / this.groundLevel);
    const altitude = Math.max(0, Math.round(altitudeFraction * maxAltitude));

    // Altitude bar
    const barX = 20;
    const barY = 20;
    const barWidth = 30;
    const barHeight = 150;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.strokeStyle = '#757575';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(barX, barY, barWidth, barHeight);
    this.ctx.strokeRect(barX, barY, barWidth, barHeight);

    // Altitude fill
    const fillHeight = barHeight * altitudeFraction;
    const gradient = this.ctx.createLinearGradient(barX, barY + barHeight - fillHeight, barX, barY + barHeight);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(1, '#2E5F8F');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(barX, barY + barHeight - fillHeight, barWidth, fillHeight);

    // Label
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('ALT', barX + barWidth / 2, barY - 5);

    // Value
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.fillText(`${altitude} ft`, barX + barWidth / 2, barY + barHeight + 15);
  }

  /**
   * Draw airplane (side view)
   */
  drawAirplane() {
    this.ctx.save();
    this.ctx.translate(this.airplane.x, this.airplane.y);
    this.ctx.rotate((this.airplane.rotation * Math.PI) / 180);

    // Scale
    const scale = 0.6;
    this.ctx.scale(scale, scale);

    // Fuselage
    const fuselageGradient = this.ctx.createLinearGradient(0, -15, 0, 15);
    fuselageGradient.addColorStop(0, '#ECEFF1');
    fuselageGradient.addColorStop(0.5, '#CFD8DC');
    fuselageGradient.addColorStop(1, '#90A4AE');

    this.ctx.fillStyle = fuselageGradient;
    this.ctx.strokeStyle = '#546E7A';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    // Nose (pointed)
    this.ctx.moveTo(50, 0);
    this.ctx.lineTo(40, -8);
    // Top of fuselage
    this.ctx.lineTo(-30, -10);
    // Tail top
    this.ctx.lineTo(-45, -8);
    this.ctx.lineTo(-45, -3);
    // Tail bottom
    this.ctx.lineTo(-45, 3);
    this.ctx.lineTo(-45, 8);
    // Bottom of fuselage
    this.ctx.lineTo(-30, 10);
    this.ctx.lineTo(40, 8);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Wing (visible from side)
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

    // Horizontal stabilizer
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
    const windowY = -5;
    for (let i = 0; i < 8; i++) {
      const windowX = 25 - i * 6;
      this.ctx.fillRect(windowX, windowY, 3, 3);
    }

    this.ctx.restore();
  }

  /**
   * Draw phase info box
   */
  drawPhaseInfo() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);

    // Info box
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 2;
    const boxX = pixelWidth - 220;
    const boxY = 20;
    const boxWidth = 200;
    const boxHeight = 100;
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Phase name
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 16px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    const phaseName = this.currentPhase.charAt(0).toUpperCase() + this.currentPhase.slice(1);
    this.ctx.fillText(`Phase: ${phaseName}`, boxX + 10, boxY + 25);

    // Velocity
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillStyle = '#2196F3';
    this.ctx.fillText(`Speed: ${Math.round(this.airplane.velocity)} m/s`, boxX + 10, boxY + 50);

    // Pitch angle
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fillText(`Pitch: ${this.airplane.rotation.toFixed(1)}°`, boxX + 10, boxY + 70);

    // Progress bar (for auto-play)
    if (this.autoPlayEnabled) {
      const progressBarY = boxY + 85;
      const progressBarWidth = boxWidth - 20;

      // Background
      this.ctx.fillStyle = '#E0E0E0';
      this.ctx.fillRect(boxX + 10, progressBarY, progressBarWidth, 6);

      // Progress
      this.ctx.fillStyle = '#4CAF50';
      this.ctx.fillRect(boxX + 10, progressBarY, progressBarWidth * this.phaseProgress, 6);
    }
  }

  /**
   * Draw force indicators for current phase
   */
  drawForceIndicators() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Get force values for current phase
    const forces = this.getPhaseForces();

    // Force legend box
    const boxX = pixelWidth / 2 - 100;
    const boxY = pixelHeight - 70;
    const boxWidth = 200;
    const boxHeight = 50;

    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Title
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 11px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Force Balance:', boxX + 10, boxY + 15);

    // Force indicators
    this.ctx.font = '10px Inter, sans-serif';
    const lineY = boxY + 32;

    // Lift vs Weight
    const liftColor = forces.lift > forces.weight ? '#4CAF50' : forces.lift < forces.weight ? '#F44336' : '#757575';
    this.ctx.fillStyle = liftColor;
    this.ctx.fillText(`L${forces.lift > forces.weight ? '>' : forces.lift < forces.weight ? '<' : '='}W`, boxX + 10, lineY);

    // Thrust vs Drag
    const thrustColor = forces.thrust > forces.drag ? '#2196F3' : forces.thrust < forces.drag ? '#FF9800' : '#757575';
    this.ctx.fillStyle = thrustColor;
    this.ctx.fillText(`T${forces.thrust > forces.drag ? '>' : forces.thrust < forces.drag ? '<' : '='}D`, boxX + 60, lineY);

    // Status
    this.ctx.fillStyle = '#212121';
    this.ctx.fillText(forces.status, boxX + 10, lineY + 15);
  }

  /**
   * Get force relationships for current phase
   */
  getPhaseForces() {
    switch (this.currentPhase) {
      case 'takeoff':
        return {
          lift: 55,
          weight: 50,
          thrust: 80,
          drag: 40,
          status: 'Accelerating, Rotating'
        };

      case 'climb':
        return {
          lift: 60,
          weight: 50,
          thrust: 70,
          drag: 45,
          status: 'Climbing, Accelerating'
        };

      case 'cruise':
        return {
          lift: 50,
          weight: 50,
          thrust: 50,
          drag: 50,
          status: 'Level Flight (Balanced)'
        };

      case 'descent':
        return {
          lift: 45,
          weight: 50,
          thrust: 40,
          drag: 45,
          status: 'Descending'
        };

      case 'landing':
        return {
          lift: 48,
          weight: 50,
          thrust: 30,
          drag: 55,
          status: 'Descending, Decelerating'
        };

      default:
        return {
          lift: 50,
          weight: 50,
          thrust: 50,
          drag: 50,
          status: 'Level Flight'
        };
    }
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
  module.exports = FlightPhasesVisualization;
}
