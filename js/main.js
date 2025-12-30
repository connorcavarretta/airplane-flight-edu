/**
 * Main Application Entry Point
 * Initializes visualizations and manages application state
 */

// Application state
const App = {
  visualizations: {},
  isInitialized: false,

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) {
      console.warn('App already initialized');
      return;
    }

    console.log('Initializing Airplane Flight Physics app...');

    this.setupCanvasElements();
    this.setupInteractiveControls();
    this.initializeVisualizations();
    this.isInitialized = true;

    console.log('App initialized successfully');
  },

  /**
   * Set up canvas elements with responsive sizing
   */
  setupCanvasElements() {
    const canvases = document.querySelectorAll('canvas');

    canvases.forEach(canvas => {
      this.makeCanvasResponsive(canvas);
    });

    // Resize canvases on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        canvases.forEach(canvas => {
          this.makeCanvasResponsive(canvas);
        });
      }, 250);
    });
  },

  /**
   * Make canvas responsive and handle high-DPI displays
   */
  makeCanvasResponsive(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set display size (CSS pixels)
    canvas.style.width = '100%';
    canvas.style.height = 'auto';

    // Set actual size (device pixels)
    const displayWidth = rect.width || canvas.width;
    const displayHeight = rect.height || canvas.height;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    // Scale context to account for pixel ratio
    ctx.scale(dpr, dpr);

    // Draw placeholder content
    this.drawPlaceholder(canvas, ctx);
  },

  /**
   * Draw placeholder content in canvas
   */
  drawPlaceholder(canvas, ctx) {
    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    // Background
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Text
    ctx.fillStyle = '#757575';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Visualization will be implemented here', width / 2, height / 2);

    // Canvas ID label
    if (canvas.id) {
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#9E9E9E';
      ctx.fillText(`(${canvas.id})`, width / 2, height / 2 + 20);
    }
  },

  /**
   * Set up interactive controls (sliders, buttons)
   */
  setupInteractiveControls() {
    // Airspeed slider (Bernoulli section)
    this.setupSlider('airspeed-slider', 'airspeed-value');

    // Four forces sliders
    this.setupSlider('lift-slider', 'lift-value');
    this.setupSlider('weight-slider', 'weight-value');
    this.setupSlider('thrust-slider', 'thrust-value');
    this.setupSlider('drag-slider', 'drag-value');

    // Angle of attack slider
    this.setupSlider('angle-slider', 'angle-value');

    // Control surface sliders
    this.setupSlider('aileron-slider', 'aileron-value');
    this.setupSlider('elevator-slider', 'elevator-value');
    this.setupSlider('rudder-slider', 'rudder-value');

    // Reset buttons
    this.setupResetButton('reset-forces');
    this.setupResetButton('reset-controls');

    // Phase selector buttons
    this.setupPhaseButtons();

    // Animation controls
    this.setupAnimationControls();
  },

  /**
   * Set up a slider with live value display
   */
  setupSlider(sliderId, valueId) {
    const slider = document.getElementById(sliderId);
    const valueDisplay = document.getElementById(valueId);

    if (!slider || !valueDisplay) {
      return;
    }

    slider.addEventListener('input', (event) => {
      valueDisplay.textContent = event.target.value;
      // Trigger update event for visualizations
      this.handleSliderChange(sliderId, parseFloat(event.target.value));
    });
  },

  /**
   * Handle slider value changes
   */
  handleSliderChange(sliderId, value) {
    // This will be expanded when visualizations are implemented
    console.log(`Slider ${sliderId} changed to ${value}`);

    // Example: Update force balance display
    if (sliderId.includes('slider')) {
      this.updateForceBalance();
    }
  },

  /**
   * Update force balance calculations (placeholder)
   */
  updateForceBalance() {
    // Will be implemented with actual physics calculations
  },

  /**
   * Set up reset button functionality
   */
  setupResetButton(buttonId) {
    const button = document.getElementById(buttonId);

    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      if (buttonId === 'reset-forces') {
        this.resetForces();
      } else if (buttonId === 'reset-controls') {
        this.resetControls();
      }
    });
  },

  /**
   * Reset all force sliders to balanced flight
   */
  resetForces() {
    const forceSliders = ['lift-slider', 'weight-slider', 'thrust-slider', 'drag-slider'];

    forceSliders.forEach(sliderId => {
      const slider = document.getElementById(sliderId);
      const valueDisplay = document.getElementById(sliderId.replace('-slider', '-value'));

      if (slider && valueDisplay) {
        slider.value = 50;
        valueDisplay.textContent = '50';
      }
    });

    // Reset the visualization itself (position and velocity)
    if (this.visualizations.forces) {
      this.visualizations.forces.reset();
    }

    console.log('Forces reset to level flight');
  },

  /**
   * Reset all control surface sliders to neutral
   */
  resetControls() {
    const controlSliders = ['aileron-slider', 'elevator-slider', 'rudder-slider'];

    controlSliders.forEach(sliderId => {
      const slider = document.getElementById(sliderId);
      const valueDisplay = document.getElementById(sliderId.replace('-slider', '-value'));

      if (slider && valueDisplay) {
        slider.value = 0;
        valueDisplay.textContent = '0';
      }
    });

    // Reset the visualization itself
    if (this.visualizations.controls) {
      this.visualizations.controls.setControls(0, 0, 0);
    }

    console.log('Control surfaces reset to neutral');
  },

  /**
   * Set up phase selector buttons
   */
  setupPhaseButtons() {
    const phaseButtons = document.querySelectorAll('.phase-button');
    const currentPhaseDisplay = document.getElementById('current-phase');

    phaseButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        phaseButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        button.classList.add('active');

        // Update phase display
        const phase = button.getAttribute('data-phase');
        if (currentPhaseDisplay && phase) {
          currentPhaseDisplay.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);
        }

        // Update visualization
        if (this.visualizations.phases) {
          this.visualizations.phases.setPhase(phase);
        }

        console.log(`Phase changed to: ${phase}`);
      });
    });
  },

  /**
   * Set up animation play/pause controls
   */
  setupAnimationControls() {
    const playButton = document.getElementById('play-animation');
    const pauseButton = document.getElementById('pause-animation');
    const currentPhaseDisplay = document.getElementById('current-phase');

    if (playButton) {
      playButton.addEventListener('click', () => {
        if (this.visualizations.phases) {
          const isPlaying = this.visualizations.phases.toggleAutoPlay();

          if (isPlaying) {
            playButton.textContent = 'Stop Auto-Play';
            playButton.classList.add('active');
          } else {
            playButton.textContent = 'Play Animation';
            playButton.classList.remove('active');
          }
        }
        console.log('Animation playing');
      });
    }

    if (pauseButton) {
      pauseButton.addEventListener('click', () => {
        if (this.visualizations.phases) {
          this.visualizations.phases.stop();
          if (playButton) {
            playButton.textContent = 'Play Animation';
            playButton.classList.remove('active');
          }
        }
        console.log('Animation paused');
      });
    }

    // Update phase display periodically when auto-playing
    setInterval(() => {
      if (this.visualizations.phases && this.visualizations.phases.autoPlayEnabled && currentPhaseDisplay) {
        const phase = this.visualizations.phases.currentPhase;
        currentPhaseDisplay.textContent = phase.charAt(0).toUpperCase() + phase.slice(1);
      }
    }, 100);
  },

  /**
   * Initialize visualization modules
   */
  initializeVisualizations() {
    // Initialize Introduction visualization
    if (typeof IntroVisualization !== 'undefined') {
      const introCanvas = document.getElementById('intro-canvas');
      if (introCanvas) {
        this.visualizations.intro = new IntroVisualization('intro-canvas');

        // Start the animation
        this.visualizations.intro.start();

        console.log('Introduction visualization initialized');
      }
    }

    // Initialize Bernoulli visualization
    if (typeof BernoulliVisualization !== 'undefined') {
      const bernoulliCanvas = document.getElementById('bernoulli-canvas');
      if (bernoulliCanvas) {
        this.visualizations.bernoulli = new BernoulliVisualization('bernoulli-canvas', {
          baseVelocity: 50,
          particleCount: 150
        });

        // Start the animation
        this.visualizations.bernoulli.start();

        // Connect airspeed slider
        const airspeedSlider = document.getElementById('airspeed-slider');
        if (airspeedSlider) {
          airspeedSlider.addEventListener('input', (event) => {
            const velocity = parseFloat(event.target.value);
            this.visualizations.bernoulli.setVelocity(velocity);
          });
        }

        console.log('Bernoulli visualization initialized');
      }
    }

    // Initialize Four Forces visualization
    if (typeof ForcesVisualization !== 'undefined') {
      const forcesCanvas = document.getElementById('forces-canvas');
      if (forcesCanvas) {
        this.visualizations.forces = new ForcesVisualization('forces-canvas', {
          lift: 50,
          weight: 50,
          thrust: 50,
          drag: 50
        });

        // Start the animation
        this.visualizations.forces.start();

        // Connect force sliders
        const forceSliders = ['lift', 'weight', 'thrust', 'drag'];
        forceSliders.forEach(force => {
          const slider = document.getElementById(`${force}-slider`);
          if (slider) {
            slider.addEventListener('input', () => {
              this.updateForces();
            });
          }
        });

        console.log('Four Forces visualization initialized');
      }
    }

    // Initialize Airfoil visualization
    if (typeof AirfoilVisualization !== 'undefined') {
      const airfoilCanvas = document.getElementById('airfoil-canvas');
      if (airfoilCanvas) {
        this.visualizations.airfoil = new AirfoilVisualization('airfoil-canvas', {
          angleOfAttack: 5,
          airfoilType: 'cambered'
        });

        // Start the animation
        this.visualizations.airfoil.start();

        // Connect angle slider
        const angleSlider = document.getElementById('angle-slider');
        if (angleSlider) {
          angleSlider.addEventListener('input', (event) => {
            const angle = parseFloat(event.target.value);
            this.visualizations.airfoil.setAngleOfAttack(angle);
          });
        }

        // Connect airfoil type selector
        const airfoilSelect = document.getElementById('airfoil-select');
        if (airfoilSelect) {
          airfoilSelect.addEventListener('change', (event) => {
            this.visualizations.airfoil.setAirfoilType(event.target.value);
          });
        }

        console.log('Airfoil visualization initialized');
      }
    }

    // Initialize Control Surfaces visualization
    if (typeof ControlSurfacesVisualization !== 'undefined') {
      const controlsCanvas = document.getElementById('controls-canvas');
      if (controlsCanvas) {
        this.visualizations.controls = new ControlSurfacesVisualization('controls-canvas', {
          aileronDeflection: 0,
          elevatorDeflection: 0,
          rudderDeflection: 0
        });

        // Connect control surface sliders
        const aileronSlider = document.getElementById('aileron-slider');
        const elevatorSlider = document.getElementById('elevator-slider');
        const rudderSlider = document.getElementById('rudder-slider');

        const updateControls = () => {
          const aileron = aileronSlider ? parseFloat(aileronSlider.value) : 0;
          const elevator = elevatorSlider ? parseFloat(elevatorSlider.value) : 0;
          const rudder = rudderSlider ? parseFloat(rudderSlider.value) : 0;
          this.visualizations.controls.setControls(aileron, elevator, rudder);
        };

        if (aileronSlider) {
          aileronSlider.addEventListener('input', updateControls);
        }
        if (elevatorSlider) {
          elevatorSlider.addEventListener('input', updateControls);
        }
        if (rudderSlider) {
          rudderSlider.addEventListener('input', updateControls);
        }

        console.log('Control Surfaces visualization initialized');
      }
    }

    // Initialize Flight Phases visualization
    if (typeof FlightPhasesVisualization !== 'undefined') {
      const phasesCanvas = document.getElementById('phases-canvas');
      if (phasesCanvas) {
        this.visualizations.phases = new FlightPhasesVisualization('phases-canvas');

        // Start the animation
        this.visualizations.phases.start();

        console.log('Flight Phases visualization initialized');
      }
    }
  },

  /**
   * Update forces visualization with current slider values
   */
  updateForces() {
    if (!this.visualizations.forces) return;

    const lift = parseFloat(document.getElementById('lift-slider').value);
    const weight = parseFloat(document.getElementById('weight-slider').value);
    const thrust = parseFloat(document.getElementById('thrust-slider').value);
    const drag = parseFloat(document.getElementById('drag-slider').value);

    this.visualizations.forces.setForces(lift, weight, thrust, drag);
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Make App available globally for debugging
window.AirplaneApp = App;
