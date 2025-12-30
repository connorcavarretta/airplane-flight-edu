/**
 * Control Surfaces Visualization
 * Demonstrates how ailerons, elevator, and rudder control aircraft rotation
 */

class ControlSurfacesVisualization {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.error(`Canvas with id "${canvasId}" not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Control surface deflections (degrees)
    this.aileronDeflection = options.aileronDeflection || 0;
    this.elevatorDeflection = options.elevatorDeflection || 0;
    this.rudderDeflection = options.rudderDeflection || 0;

    // Airplane position
    this.centerX = 0;
    this.centerY = 0;

    // Aircraft rotation state (for visual feedback)
    this.rollAngle = 0;
    this.pitchAngle = 0;
    this.yawAngle = 0;

    this.init();
  }

  init() {
    this.resetPosition();
    this.draw();
  }

  /**
   * Reset airplane to center
   */
  resetPosition() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    this.centerX = pixelWidth / 2;
    this.centerY = pixelHeight / 2;
  }

  /**
   * Set control surface deflections
   */
  setControls(aileron, elevator, rudder) {
    this.aileronDeflection = aileron;
    this.elevatorDeflection = elevator;
    this.rudderDeflection = rudder;

    // Update rotation indicators
    this.rollAngle = -aileron * 0.8; // Ailerons cause roll
    this.pitchAngle = -elevator * 0.5; // Elevator causes pitch
    this.yawAngle = rudder * 0.6; // Rudder causes yaw

    this.draw();
  }

  /**
   * Reset all controls to neutral
   */
  reset() {
    this.aileronDeflection = 0;
    this.elevatorDeflection = 0;
    this.rudderDeflection = 0;
    this.rollAngle = 0;
    this.pitchAngle = 0;
    this.yawAngle = 0;
    this.draw();
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

    // Draw rotation axes
    this.drawAxes();

    // Draw airplane with control surfaces (top-down view)
    this.drawAirplane();

    // Draw rotation indicators
    this.drawRotationIndicators();

    // Draw labels
    this.drawLabels();
  }

  /**
   * Draw rotation axes
   */
  drawAxes() {
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);

    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([10, 5]);

    // Roll axis (longitudinal - through fuselage)
    this.ctx.strokeStyle = '#4CAF50';
    this.ctx.beginPath();
    this.ctx.moveTo(-120, 0);
    this.ctx.lineTo(120, 0);
    this.ctx.stroke();

    // Pitch axis (lateral - through wings)
    this.ctx.strokeStyle = '#2196F3';
    this.ctx.beginPath();
    this.ctx.moveTo(0, -100);
    this.ctx.lineTo(0, 100);
    this.ctx.stroke();

    this.ctx.setLineDash([]);
    this.ctx.restore();
  }

  /**
   * Draw airplane from top-down view with control surfaces
   */
  drawAirplane() {
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);

    // Apply yaw rotation to entire airplane
    this.ctx.rotate((this.yawAngle * Math.PI) / 180);

    // Fuselage
    const fuselageGradient = this.ctx.createLinearGradient(-50, -10, -50, 10);
    fuselageGradient.addColorStop(0, '#90A4AE');
    fuselageGradient.addColorStop(0.5, '#78909C');
    fuselageGradient.addColorStop(1, '#546E7A');

    this.ctx.fillStyle = fuselageGradient;
    this.ctx.strokeStyle = '#37474F';
    this.ctx.lineWidth = 2;

    // Draw fuselage
    this.ctx.beginPath();
    this.ctx.moveTo(60, 0); // Nose
    this.ctx.lineTo(50, -8);
    this.ctx.lineTo(-50, -8);
    this.ctx.lineTo(-60, -5);
    this.ctx.lineTo(-60, 5);
    this.ctx.lineTo(-50, 8);
    this.ctx.lineTo(50, 8);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Wings with ailerons
    this.drawWingsWithAilerons();

    // Tail with elevator and rudder
    this.drawTail();

    this.ctx.restore();
  }

  /**
   * Draw wings with ailerons
   */
  drawWingsWithAilerons() {
    const wingGradient = this.ctx.createLinearGradient(0, -80, 0, 80);
    wingGradient.addColorStop(0, '#5C9FD6');
    wingGradient.addColorStop(0.5, '#4A90E2');
    wingGradient.addColorStop(1, '#3B7BC4');

    this.ctx.fillStyle = wingGradient;
    this.ctx.strokeStyle = '#2E5F8F';
    this.ctx.lineWidth = 2;

    // Left wing (main)
    this.ctx.beginPath();
    this.ctx.moveTo(0, -8);
    this.ctx.lineTo(-20, -8);
    this.ctx.lineTo(-30, -70);
    this.ctx.lineTo(-20, -75);
    this.ctx.lineTo(5, -15);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Right wing (main)
    this.ctx.beginPath();
    this.ctx.moveTo(0, 8);
    this.ctx.lineTo(-20, 8);
    this.ctx.lineTo(-30, 70);
    this.ctx.lineTo(-20, 75);
    this.ctx.lineTo(5, 15);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Left aileron (deflectable)
    this.ctx.save();
    const leftAileronY = -72.5;
    this.ctx.translate(-25, leftAileronY);
    // Left aileron moves opposite to right (when aileron input is positive, left goes down, right goes up)
    this.ctx.rotate((-this.aileronDeflection * Math.PI) / 180);

    this.ctx.fillStyle = '#FF9800';
    this.ctx.strokeStyle = '#E65100';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.rect(-3, -6, 6, 12);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();

    // Right aileron (deflectable)
    this.ctx.save();
    const rightAileronY = 72.5;
    this.ctx.translate(-25, rightAileronY);
    // Right aileron moves opposite to left
    this.ctx.rotate((this.aileronDeflection * Math.PI) / 180);

    this.ctx.fillStyle = '#FF9800';
    this.ctx.strokeStyle = '#E65100';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.rect(-3, -6, 6, 12);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();

    // Aileron labels
    this.ctx.fillStyle = '#212121';
    this.ctx.font = '10px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('L', -25, -85);
    this.ctx.fillText('Aileron', -25, -95);
    this.ctx.fillText('R', -25, 95);
    this.ctx.fillText('Aileron', -25, 105);
  }

  /**
   * Draw tail with elevator and rudder
   */
  drawTail() {
    // Horizontal stabilizer with elevator
    this.ctx.fillStyle = '#4A90E2';
    this.ctx.strokeStyle = '#2E5F8F';
    this.ctx.lineWidth = 2;

    // Left horizontal stabilizer
    this.ctx.beginPath();
    this.ctx.moveTo(-60, -5);
    this.ctx.lineTo(-70, -5);
    this.ctx.lineTo(-75, -25);
    this.ctx.lineTo(-70, -27);
    this.ctx.lineTo(-60, -8);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Right horizontal stabilizer
    this.ctx.beginPath();
    this.ctx.moveTo(-60, 5);
    this.ctx.lineTo(-70, 5);
    this.ctx.lineTo(-75, 25);
    this.ctx.lineTo(-70, 27);
    this.ctx.lineTo(-60, 8);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Elevator (on left stabilizer)
    this.ctx.save();
    this.ctx.translate(-72, -26);
    this.ctx.rotate((this.elevatorDeflection * Math.PI) / 180);

    this.ctx.fillStyle = '#FF9800';
    this.ctx.strokeStyle = '#E65100';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.rect(-4, -3, 8, 6);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();

    // Elevator (on right stabilizer)
    this.ctx.save();
    this.ctx.translate(-72, 26);
    this.ctx.rotate((this.elevatorDeflection * Math.PI) / 180);

    this.ctx.fillStyle = '#FF9800';
    this.ctx.strokeStyle = '#E65100';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.rect(-4, -3, 8, 6);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();

    // Vertical stabilizer (rudder area)
    this.ctx.save();
    this.ctx.translate(-65, 0);

    // Rudder (deflectable)
    this.ctx.save();
    this.ctx.translate(-8, 0);
    this.ctx.rotate((this.rudderDeflection * Math.PI) / 180);

    this.ctx.fillStyle = '#FF9800';
    this.ctx.strokeStyle = '#E65100';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.rect(-6, -4, 12, 8);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.restore();

    // Labels
    this.ctx.fillStyle = '#212121';
    this.ctx.font = '10px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Elevator', -72, -35);
    this.ctx.fillText('Rudder', -80, 0);
  }

  /**
   * Draw rotation indicators
   */
  drawRotationIndicators() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);
    const pixelHeight = this.height / (window.devicePixelRatio || 1);

    // Info box
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    this.ctx.strokeStyle = '#E0E0E0';
    this.ctx.lineWidth = 2;
    const boxX = 20;
    const boxY = 20;
    const boxWidth = 200;
    const boxHeight = 120;
    this.ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

    // Title
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 14px Inter, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText('Aircraft Response', boxX + 10, boxY + 22);

    const lineY = boxY + 35;
    const lineHeight = 22;

    // Roll
    const rollText = this.rollAngle > 2 ? 'Rolling LEFT ↶' :
                     this.rollAngle < -2 ? 'Rolling RIGHT ↷' : 'Level';
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillText('Roll:', boxX + 10, lineY);
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.fillText(rollText, boxX + 50, lineY);

    // Pitch
    const pitchText = this.pitchAngle > 2 ? 'Nose UP ↑' :
                      this.pitchAngle < -2 ? 'Nose DOWN ↓' : 'Level';
    this.ctx.fillStyle = '#2196F3';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillText('Pitch:', boxX + 10, lineY + lineHeight);
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.fillText(pitchText, boxX + 50, lineY + lineHeight);

    // Yaw
    const yawText = this.yawAngle > 2 ? 'Nose RIGHT →' :
                    this.yawAngle < -2 ? 'Nose LEFT ←' : 'Straight';
    this.ctx.fillStyle = '#FF9800';
    this.ctx.font = '12px Inter, sans-serif';
    this.ctx.fillText('Yaw:', boxX + 10, lineY + lineHeight * 2);
    this.ctx.fillStyle = '#212121';
    this.ctx.font = 'bold 12px Inter, sans-serif';
    this.ctx.fillText(yawText, boxX + 50, lineY + lineHeight * 2);

    // Current deflections
    this.ctx.fillStyle = '#757575';
    this.ctx.font = '10px Inter, sans-serif';
    this.ctx.fillText(`A: ${this.aileronDeflection}° | E: ${this.elevatorDeflection}° | R: ${this.rudderDeflection}°`,
                      boxX + 10, boxY + boxHeight - 10);
  }

  /**
   * Draw axis labels
   */
  drawLabels() {
    const pixelWidth = this.width / (window.devicePixelRatio || 1);

    // Roll axis label
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.font = 'bold 11px Inter, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Roll Axis →', this.centerX + 150, this.centerY + 5);

    // Pitch axis label
    this.ctx.fillStyle = '#2196F3';
    this.ctx.fillText('↑ Pitch Axis', this.centerX + 5, this.centerY - 110);

    // Yaw axis label (vertical)
    this.ctx.fillStyle = '#FF9800';
    this.ctx.save();
    this.ctx.translate(pixelWidth - 30, this.centerY);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.fillText('Yaw Axis (out of page) ⊙', 0, 0);
    this.ctx.restore();
  }

  /**
   * Destroy and clean up
   */
  destroy() {
    // Cleanup if needed
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ControlSurfacesVisualization;
}
