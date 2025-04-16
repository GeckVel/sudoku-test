import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SudokuBoardComponent } from './sudoku-board.component';

describe('SudokuBoardComponent', () => {
  let component: SudokuBoardComponent;
  let fixture: ComponentFixture<SudokuBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SudokuBoardComponent, // Standalone component
        ReactiveFormsModule
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SudokuBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the SudokuBoardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize a 9x9 board form', () => {
    expect(component.board.length).toBe(9);
    for (let i = 0; i < 9; i++) {
      expect(component.cell(i).length).toBe(9);
    }
  });

  it('fillRandomGrid() should fill exactly the specified number of cells and set them as readonly', () => {
    const fillCount = 8;
    component.fillRandomGrid(fillCount);

    let nonEmptyCells = 0;
    let readonlyCount = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const cellValue = component.getCellControl(i, j).value;
        if (cellValue) {
          nonEmptyCells++;
          if (component.isReadonly(i, j)) {
            readonlyCount++;
          }
        }
      }
    }

    expect(nonEmptyCells).toBe(fillCount);
    expect(readonlyCount).toBe(fillCount);
  });

  it('resetBoard() should clear all user-editable cells and retain readonly cells', () => {
    // Fill some cells with readonly states
    component.fillRandomGrid(5);
    // Reset the board
    component.resetBoard();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!component.isReadonly(i, j)) {
          expect(component.getCellControl(i, j).value).toBeNull();
        }
      }
    }
  });

  it('validateSudoku() should mark duplicates with "invalid" errors', () => {
    // Create a duplicate in row 0.
    component.getCellControl(0, 0).setValue(5);
    component.getCellControl(0, 1).setValue(5);

    component.validateSudoku();

    expect(component.getCellControl(0, 0).errors).toEqual({ invalid: true });
    expect(component.getCellControl(0, 1).errors).toEqual({ invalid: true });
  });

  it('validateSudoku() should not mark distinct values in the same row as invalid', () => {
    component.getCellControl(0, 0).setValue(1);
    component.getCellControl(0, 1).setValue(2);

    component.validateSudoku();

    expect(component.getCellControl(0, 0).errors).toBeNull();
    expect(component.getCellControl(0, 1).errors).toBeNull();
  });

  it('should set "outOfRange" error for values <1 or >9', () => {
    const control = component.getCellControl(0, 0);

    control.setValue(0); // out of range
    expect(control.errors?.['outOfRange']).toBeTrue();

    control.setValue(10); // out of range
    expect(control.errors?.['outOfRange']).toBeTrue();

    control.setValue(9); // valid value
    expect(control.errors).toBeNull();
  });

  it('should preserve "outOfRange" error after validateSudoku()', () => {
    const control = component.getCellControl(0, 0);
    control.setValue(10); // Triggers outOfRange error via our custom validator

    // Run Sudoku validation
    component.validateSudoku();

    // Expect our custom outOfRange error to be present.
    expect(control.errors).toEqual({ outOfRange: true });
  });
});
