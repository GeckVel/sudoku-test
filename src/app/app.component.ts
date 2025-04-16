import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SudokuBoardComponent } from "./sudoku-board/sudoku-board.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SudokuBoardComponent],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'sudoku-test';
}
