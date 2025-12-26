# SimpleCalculator

## Overview

**SimpleCalculator** is a lightweight, web‑based calculator that provides basic arithmetic operations in a clean, responsive UI. It is built with plain **HTML**, **CSS**, and **JavaScript**—no build tools or external libraries are required. The core logic lives in the `Calculator` class defined in `script.js`, while `index.html` defines the structure and `styles.css` handles the visual styling.

## Tech Stack
- **HTML** – markup for the calculator layout and accessible button elements.
- **CSS** – custom properties, grid layout, and responsive design.
- **JavaScript** – `Calculator` class implements input handling, calculation logic, keyboard shortcuts, and display updates.

## Setup Instructions
1. **Clone the repository**
   ```bash
   git clone <repository‑url>
   cd <repo‑directory>
   ```
2. **Open the application**
   - Simply open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari, etc.).
   - No build step, package manager, or server is required.

## UI Layout & Button Functions
| Area | Description |
|------|-------------|
| **Display** | Read‑only input element that shows the current number or result. |
| **Digits (0‑9)** | Append the corresponding digit to the current entry. |
| **Decimal (.)** | Adds a decimal point; only one per number is allowed. |
| **Operators (+, –, ×, ÷, %)** | Stores the selected operator and prepares for the next operand. |
| **Parentheses ( ( , ) )** | Present in the UI but currently ignored by the calculation logic. |
| **Clear (C)** | Resets the calculator to its initial state. |
| **Equals (=)** | Performs the pending operation and shows the result. |

## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `0` – `9` | Input digit |
| `.` | Decimal point |
| `+` `-` `*` `/` `%` | Operator entry (matches the button symbols) |
| `Enter` | Equals – compute result |
| `Escape` or `C` | Clear – reset calculator |
| `Backspace` | Delete the last entered digit |

## Responsive Behavior & Browser Support
- The calculator uses CSS Grid and media queries to adapt to smaller viewports (max‑width 480 px). Buttons shrink and the display font size reduces for mobile devices.
- Tested on the latest versions of Chrome, Firefox, Edge, and Safari. Any browser that supports ES2020 class syntax, `let/const`, and CSS custom properties will work.

## Code Organization
- **`index.html`** – Defines the calculator’s DOM structure, including the display input and button grid.
- **`styles.css`** – Contains all visual styling, custom properties, and responsive rules.
- **`script.js`** – Implements the `Calculator` class, which handles state, user interaction, and calculation logic. The class is exposed globally as `window.Calculator` for potential external use.
- **`Calculator` class** – Central component that tracks the current input, previous value, selected operator, and display updates. It also wires up button clicks and keyboard events.

---

Feel free to explore the source files, modify the styling, or extend the `Calculator` class with additional functionality (e.g., full expression parsing, scientific operations, or theming). Enjoy using **SimpleCalculator**!
