# Sudoku Board Component

This is an Angular component that implements a fully functional Sudoku game with validation, different difficulty levels, and a responsive UI.

## Features

- 9x9 Sudoku grid implemented using Angular Reactive Forms
- Input validation for numbers 1-9 only
- Visual feedback for invalid cells
- Multiple difficulty levels (Easy, Medium, Hard)
- Check button to validate the current board state
- Reset button to clear the board
- Responsive design for various screen sizes

## Component Structure

### Files
- `sudoku-board.component.ts` - Component logic
- `sudoku-board.component.html` - Template
- `sudoku-board.component.scss` - Styling

## Key Implementation Details

### Form Structure
- Uses nested FormArrays to represent the 9x9 grid
- Each cell is a FormControl with min/max validators

### Validation Logic
- Validates rows, columns, and 3x3 subgrids
- Highlights invalid cells with a red background
- Marks all occurrences of duplicate values as invalid

### Game Generation
- Generates a valid, complete Sudoku solution using backtracking
- Creates puzzles of varying difficulty by removing a specific number of cells

### UI/UX
- Clean, responsive design
- Clear borders to distinguish 3x3 subgrids (2px borders as requested)
- Intuitive button layout and styling

## Development Notes

- The component follows Angular best practices for reactive forms
- The validation logic is efficient and identifies all rule violations
- The puzzle generation algorithm ensures that all puzzles are solvable
- CSS styling uses CSS Grid for precise layout control

## How to Run

```bash
# Install dependencies
npm install

# Start the development server
ng serve

# Navigate to http://localhost:4200/
```