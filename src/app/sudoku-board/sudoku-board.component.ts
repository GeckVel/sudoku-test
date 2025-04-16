import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
              this.fb.control(null, [Validators.min(1), Validators.max(9)])
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
        const num = boardValues[i][j];
        // Only validate user-input cells (non-readonly)
        if (num && !this.isReadonly(i, j)) {
          if (!this.isValid(boardValues, i, j, num)) {
            this.cell(i).at(j).setErrors({ invalid: true });
          }
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
        this.cell(i).at(j).setErrors(null);
      }
    }
  }

  resetBoard(): void {
    this.boardForm.reset();
    this.clearValidation();
    // Reset the readonly cells array
    this.readonlyCells = Array(9).fill(null).map(() => Array(9).fill(false));
  }

  isReadonly(row: number, col: number): boolean {
    return this.readonlyCells[row][col];
  }
}