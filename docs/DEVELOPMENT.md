# Development Guide for Claude Code

This document provides context and guidelines specifically for working with Claude Code on this project.

## 🧠 Project Context for AI Assistant

### What This Project Is:
An educational website about airplane flight physics with interactive visualizations. It's designed to:
1. Teach aerodynamics fundamentals clearly
2. Provide hands-on learning through interactive demos
3. Serve as a learning tool for web development
4. Demonstrate Claude Code's capabilities

### User's Learning Goals:
- Understand how Claude Code works in practice
- Learn web development fundamentals
- Build a deployable website from scratch
- Understand aerodynamics concepts

## 🎯 Code Quality Standards

### JavaScript Style Guide:

```javascript
// ✅ GOOD: Clear, descriptive names
const calculateLiftForce = (airDensity, velocity, wingArea, liftCoefficient) => {
  // Lift equation: L = 0.5 * ρ * v² * A * CL
  // ρ (rho) = air density (kg/m³)
  // v = velocity (m/s)
  // A = wing area (m²)
  // CL = lift coefficient (dimensionless)
  return 0.5 * airDensity * Math.pow(velocity, 2) * wingArea * liftCoefficient;
};

// ❌ BAD: Unclear abbreviations
const calcL = (d, v, a, c) => {
  return 0.5 * d * v * v * a * c;
};
```

### HTML Structure:

```html
<!-- ✅ GOOD: Semantic, accessible -->
<section id="bernoulli-principle" aria-labelledby="bernoulli-heading">
  <h2 id="bernoulli-heading">Bernoulli's Principle</h2>
  <p class="intro-text">
    As air moves faster over a surface, its pressure decreases.
  </p>
  <div class="visualization-container">
    <canvas id="bernoulli-canvas" width="800" height="400" 
            aria-label="Interactive demonstration of Bernoulli's principle">
    </canvas>
  </div>
</section>

<!-- ❌ BAD: Generic divs, no accessibility -->
<div id="section2">
  <div class="title">Bernoulli's Principle</div>
  <div>As air moves faster over a surface, its pressure decreases.</div>
  <div>
    <canvas id="canvas1" width="800" height="400"></canvas>
  </div>
</div>
```

### CSS Organization:

```css
/* ✅ GOOD: Organized, commented sections */
/* =================================
   BERNOULLI VISUALIZATION
   ================================= */

.bernoulli-container {
  position: relative;
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--bg-light);
  border-radius: 8px;
}

.bernoulli-canvas {
  width: 100%;
  height: auto;
  border: 1px solid var(--border-color);
}

/* Interactive controls */
.bernoulli-controls {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* ❌ BAD: Random order, unclear purpose */
.bc {
  position: relative;
}
.canvas1 {
  width: 100%;
}
```

## 🔧 Development Patterns

### Pattern 1: Visualization Module Structure

Each visualization should follow this pattern:

```javascript
/**
 * Airflow Visualization Module
 * Demonstrates how air flows over an airfoil cross-section
 */
class AirflowVisualization {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Configurable parameters
    this.airspeed = options.airspeed || 50;
    this.angleOfAttack = options.angleOfAttack || 5;
    
    // Animation state
    this.isRunning = false;
    this.animationFrame = null;
    this.particles = [];
    
    this.init();
  }
  
  init() {
    this.createParticles();
    this.setupEventListeners();
    this.draw();
  }
  
  createParticles() {
    // Generate particle system
  }
  
  update() {
    // Update physics
  }
  
  draw() {
    // Render to canvas
  }
  
  setupEventListeners() {
    // Handle user interaction
  }
  
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
  
  animate() {
    if (this.isRunning) {
      this.update();
      this.draw();
      this.animationFrame = requestAnimationFrame(() => this.animate());
    }
  }
  
  destroy() {
    this.stop();
    // Clean up resources
  }
}

// Usage
const airflowViz = new AirflowVisualization('airflow-canvas', {
  airspeed: 60,
  angleOfAttack: 10
});
airflowViz.start();
```

### Pattern 2: Responsive Canvas

```javascript
/**
 * Makes canvas responsive and handles high-DPI displays
 */
function setupResponsiveCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  function resize() {
    const rect = canvas.getBoundingClientRect();
    
    // Set display size (CSS pixels)
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    // Set actual size (device pixels)
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale context to account for pixel ratio
    ctx.scale(dpr, dpr);
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  return { width: canvas.width, height: canvas.height, dpr };
}
```

### Pattern 3: Physics Utilities

```javascript
/**
 * Physics calculations for aerodynamics
 */
const Physics = {
  // Standard conditions at sea level
  SEA_LEVEL_AIR_DENSITY: 1.225, // kg/m³
  GRAVITY: 9.81, // m/s²
  
  /**
   * Calculate lift force
   * L = 0.5 * ρ * v² * A * CL
   */
  calculateLift(velocity, wingArea, liftCoefficient, airDensity = this.SEA_LEVEL_AIR_DENSITY) {
    return 0.5 * airDensity * Math.pow(velocity, 2) * wingArea * liftCoefficient;
  },
  
  /**
   * Calculate drag force
   * D = 0.5 * ρ * v² * A * CD
   */
  calculateDrag(velocity, referenceArea, dragCoefficient, airDensity = this.SEA_LEVEL_AIR_DENSITY) {
    return 0.5 * airDensity * Math.pow(velocity, 2) * referenceArea * dragCoefficient;
  },
  
  /**
   * Convert angle of attack to lift coefficient (simplified)
   * This is a rough approximation for demonstration purposes
   */
  angleToLiftCoefficient(angleOfAttack) {
    // Linear approximation up to ~15 degrees
    // CL ≈ 0.1 per degree (very simplified)
    const radians = angleOfAttack * Math.PI / 180;
    return Math.min(2 * Math.PI * radians, 1.5); // Cap at realistic value
  },
  
  /**
   * Calculate Reynolds number
   * Re = ρ * v * L / μ
   */
  reynoldsNumber(velocity, characteristicLength, airDensity = this.SEA_LEVEL_AIR_DENSITY) {
    const dynamicViscosity = 1.81e-5; // kg/(m·s) at 15°C
    return (airDensity * velocity * characteristicLength) / dynamicViscosity;
  }
};
```

## 🎨 Visual Design Guidelines

### Color Palette:

```css
:root {
  /* Primary colors - aviation theme */
  --sky-blue: #4A90E2;
  --cloud-white: #F8F9FA;
  --aircraft-gray: #546E7A;
  --sunset-orange: #FF6B35;
  
  /* Force colors */
  --lift-color: #4CAF50;      /* Green - upward */
  --weight-color: #F44336;    /* Red - downward */
  --thrust-color: #2196F3;    /* Blue - forward */
  --drag-color: #FF9800;      /* Orange - backward */
  
  /* UI colors */
  --text-primary: #212121;
  --text-secondary: #757575;
  --bg-light: #FAFAFA;
  --bg-dark: #263238;
  --border-color: #E0E0E0;
  
  /* Interactive states */
  --hover-bg: #E3F2FD;
  --active-bg: #BBDEFB;
}
```

### Typography:

```css
/* Clear, readable fonts for educational content */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 1rem;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.intro-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.caption {
  font-size: 0.875rem;
  font-style: italic;
  color: var(--text-secondary);
}
```

## 🧪 Testing Checklist

When implementing features, test:

- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness (320px to 1920px)
- [ ] Touch interactions (on mobile devices)
- [ ] Keyboard navigation (Tab, Enter, Space, Arrows)
- [ ] Screen reader compatibility (basic ARIA)
- [ ] Performance (60fps animations, fast load times)
- [ ] Physics accuracy (validate calculations)

## 🐛 Debugging Tips

### Canvas Issues:

```javascript
// Debug helper: Show canvas boundaries
function debugCanvas(ctx, width, height) {
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);
  
  // Draw center crosshair
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
}
```

### Performance Monitoring:

```javascript
// FPS counter
class FPSCounter {
  constructor() {
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();
  }
  
  update() {
    this.frames++;
    const currentTime = performance.now();
    
    if (currentTime >= this.lastTime + 1000) {
      this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
      this.frames = 0;
      this.lastTime = currentTime;
    }
    
    return this.fps;
  }
}
```

## 📚 Physics Reference

### Key Equations:

1. **Lift Force**:
   ```
   L = 0.5 * ρ * v² * A * CL
   where:
   ρ = air density (1.225 kg/m³ at sea level)
   v = velocity (m/s)
   A = wing area (m²)
   CL = lift coefficient (0.1 to 1.5 typical range)
   ```

2. **Drag Force**:
   ```
   D = 0.5 * ρ * v² * A * CD
   where:
   CD = drag coefficient (0.02 to 0.05 for streamlined bodies)
   ```

3. **Bernoulli's Equation**:
   ```
   P + 0.5 * ρ * v² + ρ * g * h = constant
   where:
   P = static pressure
   ρ * v² / 2 = dynamic pressure
   ρ * g * h = hydrostatic pressure
   ```

## 🚀 Performance Optimization

### Canvas Best Practices:

1. **Minimize State Changes**: Group similar drawing operations
2. **Use Layers**: Separate static and dynamic elements
3. **RequestAnimationFrame**: Always use for smooth animations
4. **Limit Particles**: Cap particle count (500-1000 max)
5. **Clear Efficiently**: Only clear changed regions when possible

### Code Splitting:

```javascript
// Load visualizations only when needed
async function loadVisualization(moduleName) {
  const module = await import(`./visualizations/${moduleName}.js`);
  return module.default;
}

// Usage
document.querySelector('#bernoulli-section').addEventListener('click', async () => {
  const BernoulliViz = await loadVisualization('bernoulli');
  const viz = new BernoulliViz('canvas-id');
});
```

## 🎓 Educational Content Guidelines

### Writing Style:
- **Clear**: Avoid jargon; explain terms when first introduced
- **Concise**: Short paragraphs (2-4 sentences)
- **Active**: "The wing generates lift" not "Lift is generated"
- **Progressive**: Simple concepts first, complexity later

### Visualization Principles:
- **Show, don't tell**: Visual > text
- **Interactive**: Let users experiment
- **Immediate feedback**: Changes should be instant
- **Guide discovery**: Highlight interesting cases

## 🔄 Iteration Strategy

When working with Claude Code:

1. **Start Small**: Build one module completely before moving on
2. **Test Early**: Run code frequently, catch issues fast
3. **Refactor**: Improve working code incrementally
4. **Document**: Explain why, not just what
5. **Ask Questions**: "Why did you choose this approach?"

## 📖 Resources for Reference

- MDN Web Docs: Canvas API, JavaScript
- Physics: Basic aerodynamics textbooks
- Visualization inspiration: NASA Glenn Research Center

---

This guide should help Claude Code understand the project deeply and produce high-quality, educational code!
