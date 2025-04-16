import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SudokuBoardComponent } from './sudoku-board.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('SudokuBoardComponent', () => {
  let component: SudokuBoardComponent;
  let fixture: ComponentFixture<SudokuBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SudokuBoardComponent,
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

    let nonEmpty = 0;
    let readonlyCount = 0;
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (component.getCellControl(i, j).value) {
          nonEmpty++;
          if (component.isReadonly(i, j)) {
            readonlyCount++;
          }
        }
      }
    }

    // Because fillRandomGrid() tries to fill exactly fillCount cells
    // we check the actual count
    expect(nonEmpty).toBe(fillCount);
    expect(readonlyCount).toBe(fillCount);
  });

  it('resetBoard() should clear all cells and readonly statuses', () => {
    // Fill first
    component.fillRandomGrid(4);

    // Then reset
    component.resetBoard();

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        expect(component.getCellControl(i, j).value).toBeNull();
        expect(component.isReadonly(i, j)).toBeFalse();
      }
    }
  });

  it('validateSudoku() should mark invalid cells with errors', () => {
    // Put a duplicate number in row 0
    component.getCellControl(0, 0).setValue(5);
    component.getCellControl(0, 1).setValue(5);

    // Validate
    component.validateSudoku();

    // Both cells become invalid due to duplication in the row
    expect(component.getCellControl(0, 0).errors).toEqual({ invalid: true });
    expect(component.getCellControl(0, 1).errors).toEqual({ invalid: true });
  });

  it('validateSudoku() should not mark distinct cells as invalid', () => {
    component.getCellControl(0, 0).setValue(1);
    component.getCellControl(0, 1).setValue(2);

    // Validate
    component.validateSudoku();

    // No errors
    expect(component.getCellControl(0, 0).errors).toBeNull();
    expect(component.getCellControl(0, 1).errors).toBeNull();
  });
});
