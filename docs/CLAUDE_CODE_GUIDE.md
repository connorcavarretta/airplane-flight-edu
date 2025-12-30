# Claude Code Prompt Guide

This file contains optimized prompts and instructions for using Claude Code effectively on this project.

## 🎯 Initial Setup Prompt

When starting work with Claude Code, use this prompt:

```
I'm working on an educational website about airplane flight physics. The project 
structure and goals are documented in README.md and docs/DEVELOPMENT.md. 

Please read both files to understand:
1. The overall project architecture
2. Educational content modules we're building
3. Code style and patterns to follow
4. Physics accuracy requirements

After reading, let's start by [specific task, e.g., "creating the basic HTML structure 
and CSS layout system"].
```

## 📋 Task-Specific Prompts

### Setting Up the Project Structure

```
Create the complete directory structure for the project as outlined in README.md:
- css/ folder with styles.css, components.css, animations.css
- js/ folder with main.js, navigation.js
- js/visualizations/ folder for interactive demos
- js/utils/ folder with physics.js
- assets/ folders for images and models

Then create placeholder files with TODO comments explaining what each file will contain.
```

### Building the HTML Foundation

```
Create index.html with:
1. Semantic HTML5 structure
2. Navigation menu with links to each educational module
3. Sections for each module (Bernoulli, Four Forces, Wing Design, Control Surfaces)
4. Empty placeholder divs for visualizations with appropriate IDs
5. Meta tags for responsiveness and SEO
6. Link to our CSS files
7. Script tags for our JS files (defer attribute)

Follow the accessibility guidelines in DEVELOPMENT.md (ARIA labels, semantic tags).
```

### Creating the CSS System

```
Create a comprehensive CSS system in css/styles.css with:
1. CSS custom properties for colors (use the palette from DEVELOPMENT.md)
2. Reset/normalize styles
3. Typography system (font sizes, weights, line heights)
4. Layout utilities (flexbox, grid)
5. Responsive breakpoints (mobile-first)
6. Spacing scale (margins, padding)

Make it modular so we can easily extend it. Include detailed comments explaining 
each section.
```

### Building Your First Visualization

```
Create an interactive Bernoulli's Principle visualization in 
js/visualizations/bernoulli.js that:

1. Shows animated airflow over two surfaces (fast/slow flow)
2. Displays pressure values that change with flow speed
3. Uses Canvas API for smooth animation
4. Includes user controls (sliders) to adjust flow speed
5. Shows the equation: P + 0.5 * ρ * v² = constant
6. Follows the class-based pattern from DEVELOPMENT.md
7. Is responsive and handles high-DPI displays

Make the visualization educational - annotate what's happening on screen.
```

### Adding Interactivity

```
Create a "Four Forces" interactive visualization that:

1. Shows an airplane (simple shape or SVG)
2. Displays force vectors for Lift, Weight, Thrust, Drag
3. Includes sliders for each force
4. Shows the airplane responding (climbing, descending, accelerating)
5. Has a "reset" button to return to balanced flight
6. Displays equations and current force values
7. Color-codes forces (use colors from DEVELOPMENT.md)

The visualization should teach that flight requires balanced forces.
```

### Building the 3D Airplane Model

```
Create a 3D interactive airplane model using Three.js in 
js/visualizations/airplane3d.js:

1. Simple airplane geometry (fuselage, wings, tail)
2. Rotatable/zoomable with mouse/touch controls
3. Highlights control surfaces when clicked (ailerons, elevator, rudder)
4. Shows how each control surface moves the plane
5. Includes annotations explaining each part's function
6. Optimized for performance (efficient geometry)

Focus on educational value - clarity over realism.
```

## 🔧 Debugging Prompts

### When Something Doesn't Work

```
I'm seeing [describe the issue]. The visualization [specific behavior] when it should 
[expected behavior].

Let's debug this step by step:
1. First, check if the canvas is properly initialized
2. Verify the event listeners are attached
3. Add console.logs to trace the animation loop
4. Check if physics calculations are correct

Please help me identify and fix the issue.
```

### Performance Issues

```
The [specific visualization] is running slowly (< 30 FPS). Let's optimize it:

1. Profile the animation loop - where is time being spent?
2. Check if we're doing unnecessary calculations per frame
3. See if we can reduce particle count or complexity
4. Consider using requestAnimationFrame properly
5. Look for memory leaks (objects not being cleaned up)

Suggest specific optimizations with code examples.
```

## 🎨 Refinement Prompts

### Improving Visual Design

```
The [component/visualization] works but could look more polished. Let's improve:

1. Add smooth transitions for state changes
2. Improve color contrast for readability
3. Add subtle animations for user feedback
4. Make spacing more consistent
5. Add hover states for interactive elements
6. Ensure it looks good on mobile

Focus on professional, educational aesthetics.
```

### Enhancing Accessibility

```
Let's make [component] more accessible:

1. Add proper ARIA labels for screen readers
2. Ensure keyboard navigation works (Tab, Enter, Space, Arrows)
3. Add focus indicators
4. Provide text alternatives for visualizations
5. Test color contrast (WCAG AA minimum)
6. Add instructions for screen reader users

Test with keyboard-only navigation.
```

## 📚 Learning Prompts

### Understanding the Code

```
I want to understand how [specific function/module] works. Can you:

1. Explain the overall approach and why it was chosen
2. Break down the key parts step by step
3. Explain any complex algorithms or physics
4. Show how it integrates with other modules
5. Suggest resources to learn more about this technique

Make it educational - I'm learning web development.
```

### Exploring Alternatives

```
We implemented [feature] using [approach]. What are alternative approaches?

1. What are the pros/cons of each approach?
2. When would you choose one over the other?
3. How do they compare in terms of performance?
4. Which is easier to understand and maintain?

This helps me understand web development trade-offs.
```

## 🚀 Deployment Prompts

### Preparing for Deployment

```
Let's prepare the site for deployment:

1. Minify CSS and JavaScript
2. Optimize images (compress, convert to WebP if beneficial)
3. Add a service worker for offline capability (optional)
4. Ensure all paths are relative (no localhost references)
5. Test in production mode
6. Create a deployment checklist

Target: [GitHub Pages / Netlify / Vercel]
```

### Setting Up GitHub Pages

```
Help me deploy this site to GitHub Pages:

1. Explain the GitHub Pages setup process
2. Create necessary configuration files
3. Prepare the repository structure
4. Write a deployment guide in docs/
5. Explain custom domain setup (if relevant)

Walk me through each step clearly.
```

## 💡 Best Practices for Claude Code Interaction

### Do's:
- ✅ Reference the README.md and DEVELOPMENT.md files
- ✅ Be specific about what you want to build
- ✅ Ask for explanations alongside code
- ✅ Request step-by-step breakdowns for complex features
- ✅ Iterate: "This works, but let's improve [aspect]"
- ✅ Ask "why" questions to understand design decisions
- ✅ Test features incrementally
- ✅ Request code comments and documentation

### Don'ts:
- ❌ Ask vague questions like "make it better"
- ❌ Skip testing between additions
- ❌ Add too many features at once
- ❌ Forget to specify accessibility requirements
- ❌ Ignore performance considerations
- ❌ Rush through without understanding

## 🔄 Iterative Development Workflow

1. **Plan**: "Let's plan the [feature] implementation. What components do we need?"
2. **Build**: "Create [specific component] following the patterns in DEVELOPMENT.md"
3. **Test**: "Let's test this in the browser. Here's what I'm seeing..."
4. **Debug**: "The [issue] is happening. Let's debug step by step."
5. **Refine**: "This works! Now let's polish [specific aspect]"
6. **Document**: "Add comments explaining [complex section]"
7. **Next**: "Great! Now let's move on to [next feature]"

## 📝 Example Complete Interaction

```
Prompt: Let's build the airfoil visualization module. First, can you explain what we're 
trying to show and the technical approach we should use?

[Claude explains the concept and approach]

Prompt: Perfect. Now create js/visualizations/airfoil.js following the class-based 
pattern from DEVELOPMENT.md. The visualization should show:
1. An airfoil cross-section that users can rotate
2. Airflow streamlines that curve around it
3. A slider to change angle of attack (-10° to +20°)
4. Labels showing current lift coefficient

Include detailed physics comments so I can learn from the code.

[Claude creates the module]

Prompt: Great! Let's test this. I'll add it to index.html. 

[Test in browser]

Prompt: It works, but the streamlines are choppy. Can we smooth them out? Also, 
let's add a visual indicator when we reach stall angle (>15°).

[Claude improves it]

Prompt: Perfect! Can you explain how the streamline calculation works? I want to 
understand the algorithm.

[Claude explains]

Prompt: Thanks! Now let's move on to the next module.
```

---

Use these prompts as templates and adapt them to your specific needs. The key is being 
clear, specific, and iterative!
