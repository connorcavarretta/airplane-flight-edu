/**
 * Wing Design & Airfoil Visualization
 * Demonstrates how airfoil shape and angle of attack affect lift and drag
 */

class AirfoilVisualization {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Airfoil parameters
    this.angleOfAttack = options.angleOfAttack || 5; // degrees
    this.airfoilType = options.airfoilType || 'cambered';
    this.airspeed = 50; // m/s

    // Airfoil position
    this.chordLength = 200; // pixels
    this.centerX = 0;
    this.centerY = 0;

    // Streamlines
    this.streamlines = [];
    this.streamlineCount = 8;

    // Animation
    this.isRunning = false;
    this.animationFrame = null;
    this.time = 0;

    this.init();
  }

  init() {
    this.resetPosition();
    this.createStreamlines();
    this.draw();
  }

  /**
   * Reset airfoil position to center
   */
  resetPosition() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.centerX = pixelWidth / 2;
    this.centerY = pixelHeight / 2;
  }

  /**
   * Create streamlines for airflow visualization
   */
  createStreamlines() {
    this.streamlines = [];
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    const spacing = pixelHeight / (this.streamlineCount + 1);

    for (let i = 1; i <= this.streamlineCount; i++) {
      this.streamlines.push({
        y: spacing * i,
        offset: Math.random() * 100
      });
    }
  }

  /**
   * Set angle of attack
   */
  setAngleOfAttack(angle) {
    this.angleOfAttack = angle;
    if (!this.isRunning) {
      this.draw();
    }
  }

  /**
   * Set airfoil type
   */
  setAirfoilType(type) {
    this.airfoilType = type;
    if (!this.isRunning) {
      this.draw();
    }
  }

  /**
   * Get airfoil points based on type
   */
  getAirfoilPoints() {
    const points = [];
    const numPoints = 50;

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * this.chordLength - this.chordLength / 2;
      const normalizedX = i / numPoints; // 0 to 1

      let upperY, lowerY;

      switch (this.airfoilType) {
        case 'cambered':
          // Cambered airfoil (curved on top, flatter bottom)
          upperY = -15 * Math.sin(Math.PI * normalizedX) - 5 * normalizedX;
          lowerY = 8 * Math.sin(Math.PI * normalizedX) - 3 * normalizedX;
          break;

        case 'symmetric':
          // Symmetric airfoil (same curve top and bottom)
          upperY = -12 * Math.sin(Math.PI * normalizedX);
          lowerY = 12 * Math.sin(Math.PI * normalizedX);
          break;

        case 'flat':
          // Flat bottom airfoil
          upperY = -12 * Math.sin(Math.PI * normalizedX);
          lowerY = 2;
          break;

        default:
          upperY = 0;
          lowerY = 0;
      }

      points.push({
        x: x,
        upperY: upperY,
        lowerY: lowerY
      });
    }

    return points;
  }

  /**
   * Calculate lift coefficient based on angle of attack
   */
  calculateLiftCoefficient() {
    const alpha = this.angleOfAttack;

    // Base coefficient depending on airfoil type
    let baseOffset = 0;
    if (this.airfoilType === 'cambered') {
      baseOffset = 0.2; // Cambered airfoils generate lift at 0°
    }

    // Stall angle
    const stallAngle = 15;

    if (alpha < -10) {
      return -0.5;
    } else if (alpha >= -10 && alpha <= stallAngle) {
      // Linear region: CL increases with angle
      return baseOffset + 0.1 * alpha;
    } else if (alpha > stallAngle && alpha <= 20) {
      // Stall region: gradual decrease
      const maxCL = baseOffset + 0.1 * stallAngle;
      const reduction = (alpha - stallAngle) / 5;
      return maxCL - (reduction * 0.8);
    } else {
      // Deep stall
      return 0.5;
    }
  }

  /**
   * Calculate drag coefficient
   */
  calculateDragCoefficient() {
    const CL = this.calculateLiftCoefficient();
    const alpha = this.angleOfAttack;

    // Parasitic drag (always present)
    const CD0 = 0.02;

    // Induced drag (increases with lift)
    const CDi = Math.pow(CL, 2) / (Math.PI * 6); // Simplified

    // Extra drag at high angles (stall)
    let stallDrag = 0;
    if (Math.abs(alpha) > 15) {
      stallDrag = 0.3;
    }

    return CD0 + CDi + stallDrag;
  }

  /**
   * Update animation
   */
  update(deltaTime) {
    this.time += deltaTime;
  }

  /**
   * Draw visualization
   */
  draw() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Clear canvas
    this.ctx.fillStyle = '#FAFAFA';
    this.ctx.fillRect(0, 0, pixelWidth, pixelHeight);

    // Draw streamlines
    this.drawStreamlines();

    // Draw airfoil
    this.drawAirfoil();

    // Draw angle of attack indicator
    this.drawAngleIndicator();

    // Draw coefficients display
    this.drawCoefficients();

    // Draw stall warning if applicable
    this.drawStallWarning();
  }

  /**
   * Draw streamlines showing airflow
   */
  drawStreamlines() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);

    this.ctx.strokeStyle = '#90CAF9';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([5, 5]);

    const angleRad = (this.angleOfAttack * Math.PI) / 180;

    this.streamlines.forEach((streamline, index) => {
      this.ctx.beginPath();

      const baseY = streamline.y;
      const offset = streamline.offset + this.time * 20;

      for (let x = 0; x < pixelWidth; x += 2) {
        // Distance from airfoil center
        const dx = x - this.centerX;
        const dy = baseY - this.centerY;

        // Smooth flow deflection around airfoil using smoother functions
        let deflection = 0;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Define airfoil influence zone
        const influenceRange = 150;
        const chordInfluenceX = this.chordLength / 1.2;

        if (Math.abs(dx) < chordInfluenceX && Math.abs(dy) < influenceRange) {
          // Calculate smooth influence factor using exponential decay
          const verticalInfluence = Math.exp(-Math.abs(dy) / 40);

          // Position relative to airfoil (0 at leading edge, 1 at trailing edge)
          const normalizedX = (dx + this.chordLength / 2) / this.chordLength;

          // Smooth horizontal influence (peaks near middle of airfoil)
          const horizontalInfluence = Math.sin(Math.PI * Math.max(0, Math.min(1, normalizedX)));

          // Combined influence strength
          const strength = verticalInfluence * horizontalInfluence;

          // Direction of deflection (up or down)
          const sign = dy > 0 ? 1 : -1;

          // Base deflection with smooth curve
          deflection = sign * strength * 35;

          // Add angle of attack effect (more deflection at higher angles)
          const angleEffect = 1 + (this.angleOfAttack / 20);
          deflection *= angleEffect;

          // Add asymmetry for angle of attack (more deflection above at positive angles)
          if (this.angleOfAttack > 0 && dy < 0) {
            deflection *= 1.3; // Airflow deflects more over the top
          } else if (this.angleOfAttack > 0 && dy > 0) {
            deflection *= 0.8; // Less deflection below
          }
        }

        const y = baseY + deflection + Math.sin((x + offset) / 30) * 2;

        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.stroke();
    });

    this.ctx.setLineDash([]);
  }

  /**
   * Draw airfoil shape
   */
  drawAirfoil() {
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);
    this.ctx.rotate((this.angleOfAttack * Math.PI) / 180);

    const points = this.getAirfoilPoints();

    // Fill airfoil
    const gradient = this.ctx.createLinearGradient(0, -20, 0, 20);
    gradient.addColorStop(0, '#4A90E2');
    gradient.addColorStop(1, '#2E5F8F');

    this.ctx.fillStyle = gradient;
    this.ctx.strokeStyle = '#1A237E';
    this.ctx.lineWidth = 2.5;

    // Draw upper surface
    this.ctx.beginPath();
    points.forEach((point, i) => {
      if (i === 0) {
        this.ctx.moveTo(point.x, point.upperY);
      } else {
        this.ctx.lineTo(point.x, point.upperY);
      }
    });

    // Draw lower surface (reverse)
    for (let i = points.length - 1; i >= 0; i--) {
      this.ctx.lineTo(points[i].x, points[i].lowerY);
    }

    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Draw chord line
    this.ctx.strokeStyle = '#FF9800';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(-this.chordLength / 2, 0);
    this.ctx.lineTo(this.chordLength / 2, 0);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Label leading and trailing edges
    this.ctx.fillStyle = '#212121';
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Leading', -this.chordLength / 2, -25);
    this.ctx.fillText('Edge', -this.chordLength / 2, -13);
    this.ctx.fillText('Trailing', this.chordLength / 2, -25);
    this.ctx.fillText('Edge', this.chordLength / 2, -13);

    this.ctx.restore();
  }

  /**
   * Draw angle of attack indicator
   */
  drawAngleIndicator() {
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);

    // Relative wind direction (horizontal)
    this.ctx.strokeStyle = '#757575';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([8, 4]);
    this.ctx.beginPath();
    this.ctx.moveTo(-180, 0);
    this.ctx.lineTo(-80, 0);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Arrow
    this.ctx.fillStyle = '#757575';
    this.ctx.beginPath();
    this.ctx.moveTo(-80, 0);
    this.ctx.lineTo(-90, -5);
    this.ctx.lineTo(-90, 5);
    this.ctx.closePath();
    this.ctx.fill();

    // Angle arc
    const angleRad = (this.angleOfAttack * Math.PI) / 180;
    this.ctx.strokeStyle = '#FF6B35';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(-120, 0, 30, 0, -angleRad, angleRad < 0);
    this.ctx.stroke();

    // Angle label
    this.ctx.fillStyle = '#FF6B35';
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`α = ${this.angleOfAttack}°`, -120, -45);

    // "Relative Wind" label
    this.ctx.fillStyle = '#757575';
    this.ctx.font = '11px Inter, sans-serif';
    this.ctx.fillText('Relative Wind', -130, 15);

    this.ctx.restore();
  }

  /**
   * Draw lift and drag coefficients
   */
  drawCoefficients() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);

    const CL = this.calculateLiftCoefficient();
    const CD = this.calculateDragCoefficient();

    // Box background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 2;
    const boxX = pixelWidth - 180;
    const boxY = 20;
    this.ctx.fillRect(boxX, boxY, 160, 100);
    this.ctx.strokeRect(boxX, boxY, 160, 100);

    // Title
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 14px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Coefficients', boxX + 10, boxY + 22);

    // Lift coefficient
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.font = '13px Inter, sans-serif';
    this.ctx.fillText(`CL (Lift):`, boxX + 10, boxY + 48);
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 13px Inter, sans-serif';
    this.ctx.fillText(CL.toFixed(3), boxX + 80, boxY + 48);

    // Drag coefficient
    this.ctx.fillStyle = '#FF9800';
    this.ctx.font = '13px Inter, sans-serif';
    this.ctx.fillText(`CD (Drag):`, boxX + 10, boxY + 70);
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 13px Inter, sans-serif';
    this.ctx.fillText(CD.toFixed(3), boxX + 80, boxY + 70);

    // L/D ratio
    const LD = CL / CD;
    this.ctx.fillStyle = '#2196F3';
    this.ctx.font = '13px Inter, sans-serif';
    this.ctx.fillText(`L/D Ratio:`, boxX + 10, boxY + 92);
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 13px Inter, sans-serif';
    this.ctx.fillText(LD.toFixed(1), boxX + 80, boxY + 92);
  }

  /**
   * Draw stall warning
   */
  drawStallWarning() {
    if (Math.abs(this.angleOfAttack) <= 15) return;

    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Warning box
    this.ctx.fillStyle = 'rgba(244, 67, 54, 0.9)';
    this.ctx.strokeStyle = '#C62828';
    this.ctx.lineWidth = 3;
    const boxWidth = 200;
    const boxHeight = 60;
    const boxX = (pixelWidth - boxWidth) / 2;
    const boxY = pixelHeight - 80;

    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Warning text
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 16px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('⚠ STALL WARNING', pixelWidth / 2, boxY + 25);
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillText('Angle too high - airflow separated', pixelWidth / 2, boxY + 45);
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
   * Clean up
   */
  destroy() {
    this.stop();
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AirfoilVisualization;
}
