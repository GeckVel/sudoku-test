# Sudoku Board Component

An Angular standalone component implementing a 9×9 Sudoku board with validation, varying difficulty levels, and responsive UI.

## Features

- **9×9 Grid** using Angular Reactive Forms (nested `FormArray`)
- **Cell Validation**:
  - Only accepts numbers 1–9 (via `sudokuRangeValidator`)
  - Checks for duplicate values in rows, columns, and 3×3 boxes
  - Marks invalid cells with a distinct error state
- **Difficulty Levels**:
  - _Easy, Medium, Hard_ buttons fill a random number of valid cells
  - Pre-filled cells are marked readonly
- **User Actions**:
  - **Check**: Validates the entire board for any Sudoku rule violations
  - **Reset**: Clears all user-editable cells
- **Responsive Layout**:
  - Clean design using CSS Grid
  - Clear borders to delineate 3×3 subgrids

## Component Structure

### Files
- `sudoku-board.component.ts` - Component logic
- `sudoku-board.component.html` - Template
- `sudoku-board.component.scss` - Styling

## Key Implementation Details

1. **Form Construction**  
   - A `FormArray` of 9 rows, each containing a `FormArray` of 9 `FormControl`s.  
   - Each cell has `sudokuRangeValidator` to ensure values remain in `[1..9]`.

2. **Validation**  
   - `validateSudoku()` checks each non-readonly cell for duplicates in the corresponding row, column, and 3×3 region.  
   - If duplicates are found, the component sets an `invalid` error on those cells.  
   - Existing errors like `outOfRange` are preserved.

3. **Random Fill**  
   - `fillRandomGrid(count)` randomly places valid numbers (1–9) into `count` cells without violating Sudoku constraints (no duplicates in row/column/subgrid).  
   - Any pre-filled cell becomes readonly to prevent editing.

4. **Reset Behavior**  
   - `resetBoard()` clears all values in non-readonly cells and removes the `invalid` errors.  
   - Readonly cells remain unchanged.

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