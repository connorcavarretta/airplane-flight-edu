# Quick Start Guide: Using Claude Code on This Project

This guide gets you started immediately with Claude Code on the airplane flight education website.

## 🚀 Getting Started in 5 Minutes

### Step 1: Open Claude Code Terminal
Navigate to the project directory:
```bash
cd /path/to/airplane-flight-edu
```

### Step 2: First Command to Claude Code
Copy and paste this into Claude Code:

```
I'm starting work on an educational website about airplane flight physics. 
Please read these files to understand the project:
1. README.md - overall project structure and goals
2. docs/DEVELOPMENT.md - code patterns and standards
3. docs/ROADMAP.md - development phases

After reading, confirm you understand the project and let's start with 
Phase 1: creating the basic HTML structure.
```

### Step 3: Verify Setup
Ask Claude Code to:
```
Please create the complete directory structure outlined in README.md, 
then create placeholder files with TODO comments explaining what each 
file will contain.
```

## 📂 Project Structure Created

After running the setup, you should have:

```
airplane-flight-edu/
├── README.md ✓
├── package.json ✓
├── .gitignore ✓
├── index.html (to be created)
├── css/
│   ├── styles.css (to be created)
│   ├── components.css (to be created)
│   └── animations.css (to be created)
├── js/
│   ├── main.js (to be created)
│   ├── navigation.js (to be created)
│   ├── visualizations/
│   │   ├── bernoulli.js (to be created)
│   │   ├── forces.js (to be created)
│   │   ├── airfoil.js (to be created)
│   │   └── airplane3d.js (to be created)
│   └── utils/
│       └── physics.js (to be created)
├── assets/
│   ├── images/
│   └── models/
└── docs/
    ├── DEVELOPMENT.md ✓
    ├── CLAUDE_CODE_GUIDE.md ✓
    ├── ROADMAP.md ✓
    ├── PHYSICS_REFERENCE.md ✓
    └── QUICK_START.md ✓ (this file)
```

## 🎯 Your First Tasks with Claude Code

### Task 1: Create index.html (10 minutes)
```
Create index.html with:
- Semantic HTML5 structure
- Navigation menu for our 6 main sections:
  1. Introduction to Flight
  2. Bernoulli's Principle
  3. Four Forces of Flight
  4. Wing Design & Airfoils
  5. Control Surfaces
  6. 3D Airplane Model
- Empty sections with placeholder divs for visualizations
- Proper meta tags and links to CSS/JS files
- Follow accessibility guidelines from DEVELOPMENT.md
```

### Task 2: Create CSS Foundation (15 minutes)
```
Create css/styles.css with:
- CSS custom properties for the color palette from DEVELOPMENT.md
- Typography system (font sizes, weights, line-heights)
- Reset/normalize styles
- Flexbox/Grid layout utilities
- Mobile-first responsive breakpoints
- Base styling for sections and containers

Use detailed comments to explain each section.
```

### Task 3: Test the Setup (5 minutes)
```
Create a simple local server setup guide and help me verify:
1. HTML loads without errors
2. CSS is properly linked and styled
3. Navigation menu works
4. Page is responsive (test at 320px, 768px, 1920px)
```

### Task 4: First Visualization (30-45 minutes)
```
Let's build the Bernoulli's Principle visualization. Create 
js/visualizations/bernoulli.js following the class-based pattern from 
DEVELOPMENT.md.

The visualization should:
- Use Canvas API to show animated fluid flow
- Display two tubes: one narrow (fast flow, low pressure) and one wide 
  (slow flow, high pressure)
- Include a slider to control flow speed
- Show the Bernoulli equation: P + ½ρv² = constant
- Display pressure and velocity values in real-time
- Be responsive and handle high-DPI displays

Make it educational - add labels and annotations.
```

## 🎓 Learning as You Go

### Understanding the Code
After Claude Code creates something, always ask:
```
Can you explain how [specific part] works? Why did you choose this approach?
```

### Improving Code Quality
If something works but seems complex:
```
This works, but is there a simpler way to [specific function]? 
Can you show me both approaches and explain the tradeoffs?
```

### Debugging Together
When you encounter issues:
```
I'm seeing [describe issue]. Let's debug this step by step:
1. Check if [first thing to verify]
2. Then verify [second thing]
3. Add console.logs to trace [specific behavior]

Help me understand what's going wrong and how to fix it.
```

## 🔄 Recommended First Week Plan

### Day 1: Foundation
- ✅ Read all documentation files
- ✅ Set up project structure
- ✅ Create HTML skeleton
- ✅ Create CSS system
- ✅ Test basic navigation

### Day 2: First Visualization
- ✅ Study Bernoulli's principle (PHYSICS_REFERENCE.md)
- ✅ Design the visualization (sketch on paper first)
- ✅ Implement basic Canvas animation
- ✅ Add interactivity (slider)

### Day 3: Polish First Viz
- ✅ Add equations and labels
- ✅ Optimize performance
- ✅ Make responsive
- ✅ Test on mobile

### Day 4: Four Forces Module
- ✅ Create airplane graphic
- ✅ Implement force vectors
- ✅ Add sliders for each force
- ✅ Show airplane response

### Day 5: Wing Design Module
- ✅ Draw airfoil
- ✅ Animate streamlines
- ✅ Angle of attack control
- ✅ Show lift coefficient changes

### Weekend: Review & Plan
- ✅ Test everything thoroughly
- ✅ Get feedback from others
- ✅ Plan next week's work
- ✅ Celebrate progress!

## 💡 Pro Tips for Working with Claude Code

1. **Be Specific**: Instead of "make it better", say "improve the animation smoothness to 60fps"

2. **Reference Documentation**: Use "as described in DEVELOPMENT.md" to ensure consistency

3. **Iterate Incrementally**: Build features in small steps, testing after each change

4. **Ask for Explanations**: Understanding is more important than just getting working code

5. **Test Early, Test Often**: Run the code in a browser frequently

6. **Use Git**: Commit after each completed feature
   ```bash
   git add .
   git commit -m "Add Bernoulli visualization with interactive controls"
   ```

7. **Learn from Mistakes**: Bugs are learning opportunities - ask Claude Code to explain what went wrong

8. **Save Good Prompts**: Keep a log of prompts that worked well

## 🚨 Common Issues & Solutions

### Issue: Canvas is blank
**Solution**: Check browser console for errors, verify Canvas ID matches JavaScript

### Issue: Animation is slow
**Solution**: Ask Claude Code to profile performance and optimize

### Issue: Not responsive on mobile
**Solution**: Test with Chrome DevTools mobile emulation, adjust CSS media queries

### Issue: Physics looks wrong
**Solution**: Reference PHYSICS_REFERENCE.md, verify calculations

## 📚 Essential Files to Reference

While working:
1. **DEVELOPMENT.md**: For code patterns and standards
2. **PHYSICS_REFERENCE.md**: For accurate equations
3. **ROADMAP.md**: To stay on track
4. **CLAUDE_CODE_GUIDE.md**: For effective prompts

## 🎉 Success Checklist for Week 1

By the end of week 1, you should have:
- [ ] Complete, styled HTML structure
- [ ] Responsive CSS system
- [ ] Working navigation menu
- [ ] At least one fully functional visualization
- [ ] Code you understand (not just code that works)
- [ ] Confidence using Claude Code
- [ ] Solid foundation for the remaining modules

## 🔜 What's Next?

After completing Week 1:
1. Review your progress
2. Identify what you learned
3. Note what was challenging
4. Plan Week 2 based on ROADMAP.md
5. Consider what you want to learn more deeply

## 🤝 Getting Help

If you get stuck:
1. Read the error messages carefully
2. Check documentation files
3. Ask Claude Code to explain step-by-step
4. Try breaking the problem into smaller pieces
5. Test individual components in isolation

Remember: This project is about learning, not just building. Take your time, 
experiment, and enjoy the process!

---

**Ready to start?** Open Claude Code and use the "Step 2: First Command" prompt above!
