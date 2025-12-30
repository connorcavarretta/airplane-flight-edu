# Aerodynamics Physics Reference

This document provides accurate physics formulas and concepts for implementing visualizations. All equations are simplified for educational demonstration but remain conceptually accurate.

## Table of Contents
1. [Basic Concepts](#basic-concepts)
2. [Lift](#lift)
3. [Drag](#drag)
4. [Bernoulli's Principle](#bernoullis-principle)
5. [Angle of Attack](#angle-of-attack)
6. [Airfoil Characteristics](#airfoil-characteristics)
7. [Four Forces Balance](#four-forces-balance)
8. [Atmospheric Properties](#atmospheric-properties)

---

## Basic Concepts

### Air Properties at Sea Level (Standard Atmosphere)
- **Air Density (ρ)**: 1.225 kg/m³
- **Temperature**: 15°C (288.15 K)
- **Pressure**: 101,325 Pa (1 atm)
- **Dynamic Viscosity (μ)**: 1.81 × 10⁻⁵ kg/(m·s)
- **Speed of Sound**: 340 m/s

### Dimensional Units
- **Length**: meters (m)
- **Mass**: kilograms (kg)
- **Time**: seconds (s)
- **Force**: Newtons (N) = kg·m/s²
- **Pressure**: Pascals (Pa) = N/m²
- **Velocity**: meters per second (m/s)

---

## Lift

### Lift Force Equation
The fundamental equation for lift force:

```
L = ½ · ρ · v² · A · CL

where:
L  = Lift force (N)
ρ  = Air density (kg/m³)
v  = Airspeed (m/s)
A  = Wing area (m²)
CL = Lift coefficient (dimensionless)
```

### Lift Coefficient (CL)

The lift coefficient depends on:
- Angle of attack (α)
- Airfoil shape
- Reynolds number

**Simplified Linear Approximation** (valid for small angles, -5° to +15°):
```
CL ≈ 2π · α (in radians)
CL ≈ 0.11 · α (in degrees)
```

**More Realistic Values**:
- CL at 0° (zero lift angle): -0.1 to 0.1 (depends on camber)
- CL at 5°: ~0.5
- CL at 10°: ~1.0
- CL at 15°: ~1.3 to 1.5 (approaching stall)
- CL max (before stall): ~1.5 to 1.8

**Stall**: Occurs when angle of attack exceeds critical angle (~15-20°), causing flow separation and sudden loss of lift.

### Example Calculation
```
Given:
- Wing area: 20 m²
- Airspeed: 70 m/s
- Angle of attack: 10°
- Air density: 1.225 kg/m³

Calculate CL:
CL ≈ 0.11 × 10° = 1.1

Calculate Lift:
L = ½ × 1.225 × 70² × 20 × 1.1
L = 0.5 × 1.225 × 4900 × 20 × 1.1
L ≈ 66,045 N (about 6,700 kg-force)
```

---

## Drag

### Drag Force Equation
```
D = ½ · ρ · v² · A · CD

where:
D  = Drag force (N)
ρ  = Air density (kg/m³)
v  = Airspeed (m/s)
A  = Reference area (m²)
CD = Drag coefficient (dimensionless)
```

### Drag Coefficient (CD)

**Typical Values**:
- Streamlined airfoil: CD ≈ 0.02 to 0.05
- Flat plate (perpendicular): CD ≈ 1.0 to 1.2
- Cylinder: CD ≈ 0.3 to 1.2 (depends on Reynolds number)
- Sphere: CD ≈ 0.1 to 0.5 (depends on Reynolds number)
- Modern aircraft (total): CD ≈ 0.02 to 0.03

**Drag Components**:
1. **Parasitic Drag**: Increases with v²
   - Form drag (shape)
   - Skin friction drag
   - Interference drag

2. **Induced Drag**: Caused by lift generation
   ```
   CDi = CL² / (π · AR · e)
   
   where:
   AR = Aspect Ratio = b²/A (wingspan²/wing area)
   e  = Oswald efficiency factor (0.7 to 0.9)
   ```

### Total Drag
```
CD_total = CD_parasitic + CD_induced
CD_total = CD₀ + (CL² / π·AR·e)
```

---

## Bernoulli's Principle

### Bernoulli's Equation (simplified for incompressible flow)
```
P + ½·ρ·v² + ρ·g·h = constant

where:
P     = Static pressure (Pa)
ρ·v²/2 = Dynamic pressure (Pa)
ρ·g·h  = Hydrostatic pressure (Pa)
```

### For Horizontal Flow (h is constant)
```
P₁ + ½·ρ·v₁² = P₂ + ½·ρ·v₂²

Rearranging:
P₁ - P₂ = ½·ρ·(v₂² - v₁²)
```

**Key Insight**: When velocity increases, pressure decreases (and vice versa).

### Pressure Difference Over Wing
```
ΔP = ½·ρ·(v_top² - v_bottom²)

where:
v_top    = Air velocity over top of wing
v_bottom = Air velocity under bottom of wing
```

**Note**: While Bernoulli helps explain pressure differences, lift is more accurately described by circulation theory and momentum transfer. For educational purposes, we present both perspectives.

---

## Angle of Attack

### Definition
The angle between the wing's chord line and the relative airflow direction.

```
     Relative Wind
         ←────
        ╱
       ╱ α (angle of attack)
      ╱___________
      Wing Chord Line
```

### Critical Angles
- **Zero Lift Angle**: Typically -2° to 0° (depends on camber)
- **Normal Flight**: 2° to 10°
- **High Lift**: 10° to 15°
- **Critical Angle (Stall)**: 15° to 20°
- **Post-Stall**: > 20° (unstable, reduced lift)

### Angle of Attack vs Lift Coefficient (Simplified)
```javascript
function calculateLiftCoefficient(angleOfAttack) {
  // Convert to radians
  const alpha = angleOfAttack * Math.PI / 180;
  
  // Stall angle in degrees
  const stallAngle = 15;
  
  if (angleOfAttack < -10) {
    // Negative stall region
    return -0.5;
  } else if (angleOfAttack >= -10 && angleOfAttack <= stallAngle) {
    // Linear region: CL = a₀ + a₁·α
    const a0 = 0.2;  // Lift coefficient at 0° (camber effect)
    const a1 = 0.1;  // Lift curve slope (per degree)
    return a0 + a1 * angleOfAttack;
  } else if (angleOfAttack > stallAngle && angleOfAttack <= 20) {
    // Stall region: gradual decrease
    const maxCL = 1.7;
    const reduction = (angleOfAttack - stallAngle) / 5;
    return maxCL - (reduction * 0.8);
  } else {
    // Deep stall
    return 0.5;
  }
}
```

---

## Airfoil Characteristics

### Airfoil Geometry
```
     Leading Edge
         ●
        ╱ ╲
       ╱   ╲  ← Upper Surface (Cambered)
      ╱     ╲
     ╱       ╲___________
    ●                    ● ← Trailing Edge
    │← Chord Length (c) →│
    
    ╱── ← Camber Line (mean line between surfaces)
```

### Key Parameters
1. **Chord (c)**: Distance from leading to trailing edge
2. **Camber**: Curvature of the mean line
3. **Thickness**: Maximum distance between upper and lower surfaces
4. **Thickness-to-Chord Ratio**: Typically 10-15% for aircraft wings

### Common Airfoil Types
1. **Symmetric** (NACA 0012):
   - Zero camber
   - Zero lift at 0° angle of attack
   - Used on vertical stabilizers, some aerobatic planes

2. **Cambered** (NACA 2412):
   - Positive camber
   - Generates lift at 0° angle of attack
   - Used on most wings

3. **Flat Plate**:
   - Simple approximation
   - Less efficient but educational

### Streamlines Around Airfoil

**Above Wing**: Air accelerates (lower pressure)
**Below Wing**: Air slows slightly (higher pressure)
**Result**: Net upward force (lift)

Simplified flow visualization:
```
  →→→→→→
 →→→ ___→→→
→→ /     \ →→
→ |       |→ ← Slowed flow (higher pressure)
→→ \_____/ →→
  →→→→→→→→→
  ↑
  Accelerated flow (lower pressure)
```

---

## Four Forces Balance

### Level Flight (Equilibrium)
```
Lift = Weight
Thrust = Drag

⬆ Lift
   │
   │     ➞ Thrust
   ●────────
   │
   │     ⬅ Drag
⬇ Weight
```

### Climbing Flight
```
Lift > Weight (or vertical component of lift)
Thrust > Drag
```

### Descending Flight
```
Lift < Weight
Thrust < Drag (or zero thrust in glide)
```

### Accelerating Flight
```
Thrust > Drag
Lift = Weight
```

### Force Equations
```javascript
// Vertical forces
const netVerticalForce = lift - weight;

// Horizontal forces
const netHorizontalForce = thrust - drag;

// Acceleration
const verticalAcceleration = netVerticalForce / mass;
const horizontalAcceleration = netHorizontalForce / mass;
```

---

## Atmospheric Properties

### Variation with Altitude

**Temperature**:
```
T(h) = T₀ - L·h (in troposphere, h < 11 km)

where:
T₀ = 288.15 K (sea level)
L  = 0.0065 K/m (lapse rate)
h  = altitude (m)
```

**Pressure**:
```
P(h) = P₀ · (1 - L·h/T₀)^(g·M/R·L)

where:
P₀ = 101,325 Pa (sea level)
g  = 9.81 m/s²
M  = 0.02896 kg/mol (molar mass of air)
R  = 8.314 J/(mol·K) (gas constant)
```

**Density** (from ideal gas law):
```
ρ(h) = P(h) · M / (R · T(h))
```

### Simplified Approximations
For educational purposes:
```javascript
function airDensityAtAltitude(altitudeMeters) {
  const rho0 = 1.225; // kg/m³ at sea level
  const scaleHeight = 8500; // meters
  return rho0 * Math.exp(-altitudeMeters / scaleHeight);
}

// Examples:
// Sea level (0 m): ρ = 1.225 kg/m³
// 2,000 m: ρ ≈ 1.00 kg/m³
// 5,000 m: ρ ≈ 0.74 kg/m³
// 10,000 m: ρ ≈ 0.41 kg/m³
```

---

## Reynolds Number

### Definition
Ratio of inertial forces to viscous forces:
```
Re = ρ · v · L / μ

where:
ρ = Air density (kg/m³)
v = Velocity (m/s)
L = Characteristic length (m) - usually chord length
μ = Dynamic viscosity (kg/(m·s))
```

### Typical Values
- Model airplane: Re ≈ 50,000 to 500,000
- Light aircraft: Re ≈ 1,000,000 to 5,000,000
- Commercial airliner: Re ≈ 10,000,000 to 50,000,000

### Significance
- Low Re: Laminar flow, higher friction
- High Re: Turbulent flow, better lift characteristics
- Affects CL and CD values

---

## Practical Implementation Tips

### For Canvas Visualizations

1. **Scale Appropriately**: Use pixel coordinates that map logically to physical dimensions
   ```javascript
   const scale = canvasWidth / 10; // 10 meters wing span
   const pixelX = physicalX * scale;
   ```

2. **Normalize Forces**: Display forces as proportional arrows
   ```javascript
   const maxArrowLength = 100; // pixels
   const arrowLength = (force / maxForce) * maxArrowLength;
   ```

3. **Frame-Rate Independent**: Use deltaTime for physics
   ```javascript
   velocity += acceleration * deltaTime;
   position += velocity * deltaTime;
   ```

4. **Realistic Ranges**: Keep values in plausible ranges
   - Speed: 20-100 m/s for general aviation
   - Angle of attack: -10° to +20°
   - Altitude: 0-5000 m for basic demos

---

## References

These simplified equations are based on standard aerodynamics principles from:
- Anderson, J.D. "Fundamentals of Aerodynamics"
- McCormick, B.W. "Aerodynamics, Aeronautics, and Flight Mechanics"
- NASA Glenn Research Center Educational Resources

**Important Note**: These are simplified models for educational visualization. Real aircraft design uses much more complex computational fluid dynamics (CFD) and wind tunnel testing.
