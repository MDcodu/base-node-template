import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent implements OnInit {
  // @HostListener('window:keyup', ['$event'])
  // keyEvent(event: KeyboardEvent) {
  //   console.log(event);
  // }

  board = [
    {player: null, value: null, location: 'location01'},
    {player: null, value: null, location: 'location02'},
    {player: null, value: null, location: 'location03'},
    {player: null, value: null, location: 'location04'},
    {player: null, value: null, location: 'location05'},
    {player: null, value: null, location: 'location06'},
    {player: null, value: null, location: 'location07'},
    {player: null, value: null, location: 'location08'},
    {player: null, value: null, location: 'location09'},
  ];

  isStarted: boolean = false;

  appMessage: string = 'Player 01. Your Turn...'

  player: string = 'Player - 01'

  constructor() { }

  ngOnInit(): void {
  }

  playerMove(block, index) {
    if (this.player === 'Player - 01') {
      this.board[index].value = 'X';
      this.board[index].player = 'Player - 01';
      this.player = 'Player - 02';
      this.appMessage = 'Player 02. Your Turn...'
    } else {
      console.log(this.player)
      this.board[index].value = 'O';
      this.board[index].player = 'Player - 02';
      this.player = 'Player - 01';
      this.appMessage = 'Player 01. Your Turn...'
    }
    this.winCondition();
  }

  winCondition() {
    if ((this.board[0].value === 'X' && this.board[1].value === 'X' && this.board[2].value === 'X') ||
      (this.board[0].value === 'O' && this.board[1].value === 'O' && this.board[2].value === 'O')) {
      this.appMessage = this.player === 'Player - 01'? 'Player - 02' + ' Wins!' : 'Player - 01' + ' Wins!'
    } else if ((this.board[3].value === 'X' && this.board[4].value === 'X' && this.board[5].value === 'X') ||
    (this.board[3].value === 'O' && this.board[4].value === 'O' && this.board[5].value === 'O')) {
      this.appMessage = this.player === 'Player - 01'? 'Player - 02' + ' Wins!' : 'Player - 01' + ' Wins!'
    } else if ((this.board[6].value === 'X' && this.board[7].value === 'X' && this.board[8].value === 'X') ||
    (this.board[6].value === 'O' && this.board[7].value === 'O' && this.board[8].value === 'O')) {
      this.appMessage = this.player === 'Player - 01'? 'Player - 02' + ' Wins!' : 'Player - 01' + ' Wins!'
    }

    else if ((this.board[0].value === 'X' && this.board[3].value === 'X' && this.board[6].value === 'X') ||
    (this.board[0].value === 'O' && this.board[3].value === 'O' && this.board[6].value === 'O')) {
      this.appMessage = this.player === 'Player - 01'? 'Player - 02' + ' Wins!' : 'Player - 01' + ' Wins!'
    } else if ((this.board[0].value === 'X' && this.board[3].value === 'X' && this.board[6].value === 'X') ||
    (this.board[0].value === 'O' && this.board[3].value === 'O' && this.board[6].value === 'O')) {
      this.appMessage = this.player === 'Player - 01'? 'Player - 02' + ' Wins!' : 'Player - 01' + ' Wins!'
    } else if ((this.board[0].value === 'X' && this.board[3].value === 'X' && this.board[6].value === 'X') ||
    (this.board[0].value === 'O' && this.board[3].value === 'O' && this.board[6].value === 'O')) {
      this.appMessage = this.player === 'Player - 01'? 'Player - 02' + ' Wins!' : 'Player - 01' + ' Wins!'
    }

    else if ((this.board[0].value === 'X' && this.board[4].value === 'X' && this.board[8].value === 'X') ||
    (this.board[0].value === 'O' && this.board[4].value === 'O' && this.board[8].value === 'O')) {
      this.appMessage = this.player === 'Player - 01'? 'Player - 02' + ' Wins!' : 'Player - 01' + ' Wins!'
    } else if ((this.board[6].value === 'X' && this.board[4].value === 'X' && this.board[2].value === 'X') ||
    (this.board[6].value === 'O' && this.board[4].value === 'O' && this.board[2].value === 'O')) {
      this.appMessage = this.player === 'Player - 01'? 'Player - 02' + ' Wins!' : 'Player - 01' + ' Wins!'
    }
  }

  startGame() {
    this.isStarted = true;
  }

  resetGame() {
    this.isStarted = false;
    this.board = [
      {player: null, value: null, location: 'location01'},
      {player: null, value: null, location: 'location02'},
      {player: null, value: null, location: 'location03'},
      {player: null, value: null, location: 'location04'},
      {player: null, value: null, location: 'location05'},
      {player: null, value: null, location: 'location06'},
      {player: null, value: null, location: 'location07'},
      {player: null, value: null, location: 'location08'},
      {player: null, value: null, location: 'location09'},
    ];
    this.appMessage = 'Player 01. Your Turn...'
  }

}
