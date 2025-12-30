# ✈️ Airplane Flight Educational Website

An interactive educational resource that explains the physics and principles of how airplanes fly, featuring rich visualizations and hands-on demonstrations.

## 🎯 Project Goals

1. **Educational**: Teach fundamental aerodynamics concepts clearly and accurately
2. **Interactive**: Provide engaging visualizations that respond to user input
3. **Accessible**: Work on all modern browsers, mobile-friendly
4. **Learning Tool**: Serve as a reference for understanding web development and Claude Code

## 🏗️ Architecture

### Directory Structure
```
airplane-flight-edu/
├── index.html              # Main entry point
├── css/
│   ├── styles.css         # Global styles
│   ├── components.css     # Reusable component styles
│   └── animations.css     # Animation definitions
├── js/
│   ├── main.js            # Application initialization
│   ├── visualizations/    # Interactive demos
│   │   ├── airflow.js
│   │   ├── forces.js
│   │   ├── airfoil.js
│   │   └── airplane3d.js
│   ├── utils/             # Helper functions
│   │   └── physics.js
│   └── navigation.js      # Page navigation logic
├── assets/
│   ├── images/           # Static images
│   └── models/           # 3D models (if external)
├── docs/
│   └── DEVELOPMENT.md    # Development notes
└── README.md             # This file
```

## 📚 Educational Content Modules

### 1. Introduction to Flight
- Brief history of aviation
- Overview of the four forces
- Interactive preview of concepts

### 2. Bernoulli's Principle
- Pressure and velocity relationship
- Visualization: fluid flow speed vs pressure
- Real-world applications

### 3. Four Forces of Flight
- **Lift**: How wings generate upward force
- **Weight**: Gravity's role
- **Thrust**: Moving forward
- **Drag**: Air resistance
- Interactive: Adjust each force and see effects

### 4. Wing Design & Airfoils
- Airfoil cross-sections
- Angle of attack demonstration
- Wing shape variations
- Interactive: Modify wing parameters

### 5. Control Surfaces
- Ailerons (roll)
- Elevator (pitch)
- Rudder (yaw)
- Interactive 3D airplane showing control movement

### 6. Flight Phases
- Takeoff
- Cruise
- Landing
- Animated sequence

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern layouts (Grid, Flexbox), animations
- **JavaScript (ES6+)**: Vanilla JS for core functionality
- **Canvas API**: 2D visualizations
- **SVG**: Vector graphics for diagrams
- **Three.js**: 3D airplane model
- **Optional**: GSAP for advanced animations

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local development server (Python, Node.js, or VS Code Live Server)

### Running Locally

**Option 1: Python**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Option 2: Node.js**
```bash
npx http-server -p 8000
```

**Option 3: VS Code**
- Install "Live Server" extension
- Right-click index.html → "Open with Live Server"

Then visit: `http://localhost:8000`

## 🎨 Design Principles

1. **Progressive Disclosure**: Start simple, reveal complexity gradually
2. **Visual Learning**: Prioritize diagrams and animations over text
3. **Interactivity**: Let users experiment and discover
4. **Responsive**: Mobile-first approach
5. **Performance**: Optimize for fast loading and smooth animations

## 📝 Development Guidelines for Claude Code

### When Working on This Project:

1. **Read This First**: Always reference this README to understand project structure
2. **Modular Code**: Keep functions small, single-purpose
3. **Comments**: Explain physics concepts in code comments
4. **Testing**: Test visualizations at different screen sizes
5. **Accessibility**: Include ARIA labels, keyboard navigation
6. **Performance**: Monitor Canvas/WebGL performance, optimize as needed

### Code Style:
- Use ES6+ features (const/let, arrow functions, modules)
- Descriptive variable names (e.g., `liftForce` not `lf`)
- JSDoc comments for complex functions
- Consistent formatting (2-space indent)

### Physics Accuracy:
- Use simplified but accurate models
- Include citations for equations in comments
- Validate calculations against known values

## 🎓 Learning Outcomes

By building this project, you'll understand:

### Web Development:
- HTML structure and semantics
- CSS layouts and responsive design
- JavaScript DOM manipulation
- Canvas/SVG drawing
- 3D graphics basics (Three.js)
- Event handling and interactivity
- Performance optimization

### Claude Code Workflow:
- How to structure prompts for complex projects
- Iterative development with AI assistance
- Debugging with AI support
- Code explanation and documentation
- Testing strategies

### Aerodynamics:
- Fundamental principles of flight
- Real-world physics applications
- How engineers think about aircraft design

## 🚢 Deployment Options

### Static Site Hosting (Free):
1. **GitHub Pages**: Push to GitHub, enable Pages
2. **Netlify**: Drag-and-drop deployment
3. **Vercel**: Connect Git repo
4. **Cloudflare Pages**: Fast global CDN

### Steps for GitHub Pages:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
# Enable GitHub Pages in repo settings
```

## 🔄 Development Workflow

1. **Plan**: Define feature or module
2. **Build**: Implement with Claude Code assistance
3. **Test**: Check functionality and appearance
4. **Refine**: Iterate based on testing
5. **Document**: Update comments and docs
6. **Commit**: Save progress with clear commit message

## 📋 Next Steps

1. Set up the basic project structure
2. Create the HTML skeleton with navigation
3. Implement CSS styling system
4. Build first visualization (Bernoulli's Principle)
5. Add remaining modules incrementally
6. Polish and optimize
7. Deploy!

## 🤝 Contributing

This is a learning project, but suggestions are welcome:
- Found a physics inaccuracy? Let me know
- Have an idea for a visualization? Share it
- Want to add a module? Fork and create a PR

## 📜 License

MIT License - feel free to use this for educational purposes

## 🙏 Acknowledgments

- Physics concepts from basic aerodynamics textbooks
- Visualization inspiration from NASA educational resources
- Built as a learning exercise with Claude Code

---

**Remember**: The goal isn't perfection—it's learning by doing. Break problems into small pieces, test often, and iterate!
