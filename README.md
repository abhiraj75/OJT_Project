# Cyber Dodge

A retro-style arcade survival game we built during our On-the-Job Training (OJT). The goal was to create a functional game loop and responsive UI using only core web technologies, without relying on game engines or heavy frameworks.

<img width="1512" height="857" alt="Screenshot 2025-11-30 at 12 52 00 PM" src="https://github.com/user-attachments/assets/c5088b82-93d6-4119-81cc-a26360481b85" />


## About The Project
We created Cyber Dodge to practice DOM manipulation and collision detection logic as a team. The game features a "Synthwave" aesthetic with a moving 3D grid background and neon visuals.

The concept is simple: you are a pilot navigating through a digital void. You have to dodge falling data fragments. As your score increases, the game levels up and the obstacles fall faster.

## Features
* **Progressive Difficulty:** The game gets harder as you play. Speed increases at specific score milestones (Level 2 at 10 points, Level 3 at 25 points, etc.).
* **High Score System:** It uses the browser's LocalStorage to save your highest score and your player name, so the record persists even after refreshing the page.
* **Mobile Support:** We added on-screen touch controls so it works on phones as well as desktops.
* **Visual Effects:** Includes a CSS-only scrolling 3D floor, screen shake on "death," and text glitch animations.

## How to Play
1.  Enter your "Codename" on the start screen.
2.  Press **INITIATE** to start.
3.  **Controls:**
    * **Desktop:** Use the Left and Right Arrow keys.
    * **Mobile:** Tap the on-screen arrow buttons.
4.  Avoid the falling blocks. If you get hit, the system crashes and it's Game Over.

## Tech Stack
* **HTML5:** Structure and semantic organization.
* **CSS3:** Heavily used for the visual style. We used CSS variables for the neon theme and `perspective` for the 3D background effect.
* **Vanilla JavaScript:** Handles the game loop, collision detection, and score logic. No external libraries were used.

## What We Learned
Working on this gave us a better understanding of how the browser rendering loop works and how to manage state in a shared codebase.

One specific challenge we solved was the **Collision Detection**. Since the player and enemies are HTML divs, we wrote a function using `getBoundingClientRect()` to calculate if their positions overlap at any given frame.

We also learned how to optimize the game loop by using `requestAnimationFrame` instead of `setInterval` for the movement logic, which makes the player movement look much smoother.

## How to Run Locally
Since this project uses static files, you don't need to install any dependencies.

1.  Download or Clone this repository.
2.  Open the `index.html` file in any modern web browser.
