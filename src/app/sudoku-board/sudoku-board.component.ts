import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { sudokuRangeValidator } from './utils/sudoku-range.validator';

@Component({
  selector: 'app-sudoku-board',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sudoku-board.component.html',
  styleUrl: './sudoku-board.component.scss'
})
export class SudokuBoardComponent {
  boardForm!: FormGroup;
  readonlyCells: boolean[][] = Array(9).fill(null).map(() => Array(9).fill(false));

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.boardForm = this.fb.group({
      board: this.fb.array(
        Array(9).fill(null).map(() =>
          this.fb.array(
            Array(9).fill(null).map(() =>
              this.fb.control(null, [sudokuRangeValidator])
            )
          )
        )
      )
    });
  }

  getCellControl(row: number, col: number): FormControl {
    return (this.board.at(row) as FormArray).at(col) as FormControl;
  }

  fillRandomGrid(count: number): void {
    this.resetBoard();
    let filled = 0;

    while (filled < count) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      const control = this.getCellControl(row, col);

      if (!control.value) {
        const num = Math.floor(Math.random() * 9) + 1;
        if (this.isValid(this.board.value, row, col, num)) {
          control.setValue(num);
          this.readonlyCells[row][col] = true;
          filled++;
        }
      }
    }
  }

  get board(): FormArray {
    return this.boardForm.get('board') as FormArray;
  }

  cell(row: number): FormArray {
    return this.board.at(row) as FormArray;
  }

  validateSudoku(): void {
    this.clearValidation();
    const boardValues = this.board.value;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const control = this.cell(i).at(j);
        const num = control.value;

        if (!this.isReadonly(i, j)) {
          let errors = control.errors || {};

          if (num && !this.isValid(boardValues, i, j, num)) {
            errors['invalid'] = true;
          }

          control.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    }
  }

  isValid(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if ((board[row][i] === num && i !== col) || (board[i][col] === num && i !== row)) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num && (i !== row || j !== col)) {
          return false;
        }
      }
    }

    return true;
  }

  clearValidation(): void {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const control = this.cell(i).at(j);
        const existingErrors = control.errors || {};

        // Remove only the Sudoku 'invalid' error, keep outOfRange if it exists
        delete existingErrors['invalid'];

        if (Object.keys(existingErrors).length === 0) {
          // No other errors remain, set to null
          control.setErrors(null);
        } else {
          // Keep the remaining errors (like outOfRange)
          control.setErrors(existingErrors);
        }
      }
    }
  }

  resetBoard(): void {
    this.clearValidation();

    // Only reset user-editable cells
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!this.isReadonly(i, j)) {
          // Reset only non-readonly cells (user inputs)
          this.getCellControl(i, j).setValue(null);
        }
      }
    }
  }

  isReadonly(row: number, col: number): boolean {
    return this.readonlyCells[row][col];
  }
}