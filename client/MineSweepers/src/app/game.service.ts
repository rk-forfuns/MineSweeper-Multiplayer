import { Injectable } from '@angular/core';

import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimerService } from './timer/timer.service';
import { GameboardService } from './gameboard/gameboard.service'
import { TileMsg } from './tile/tile.model';

import { ModalService } from './modal/modal.service';
import { ModalContent } from './modal/modalContent.model';

export enum GameState {
  INIT,
  RUNNING,
  PAUSE,
  GAMEOVER
}

@Injectable()
export class GameService {

  // todo: move this to a config place.
  difficultyConfig = {
    '0': { 'size': 6, 'bombs': 3 }, // easy
    '1': { 'size': 10, 'bombs': 10 }, // medium
    '2': { 'size': 15, 'bombs': 15 }  // hard
  }

  flagCount: number = 0;
  bombCount: number = 0;
  difficulty: number = 0;
  state: number;
  flagBombUpdated = new EventEmitter();

  constructor(
    private modalSerivce: ModalService,
    private gameboardService: GameboardService,
    private timerService: TimerService) { }

  //------------------------------------------------//

  handleClick(tileMsg: number) {
    console.log("gameService: click detected. state: " + this.state);
    if (this.state == GameState.GAMEOVER) {
      this.prepareGame(this.difficulty);
      this.startGame();
    } else if(this.state == GameState.INIT){
      this.startGame();  
    }else if(this.state == GameState.RUNNING || this.state == GameState.PAUSE){
      // do nothing
    }

    if (tileMsg == TileMsg.ClickedOnBomb) {
      this.gameOver(0);
    } else if (tileMsg == TileMsg.ClickedOnNumber) {
      // do nothing
    } else if (tileMsg == TileMsg.Flagged) {
      this.flagCount++;
      this.sendUpdateFlagBombMsg();

      if(this.flagCount >= this.bombCount){
        if(this.checkWinGame()){
          this.gameOver(1);
        } else {
          this.gameOver(0);
        }
      }
    } else if (tileMsg == TileMsg.UnFlagged) {
      this.flagCount--;
      this.sendUpdateFlagBombMsg();
    }
  }

  //------------------------------------------------//

  prepareGame(difficulty) {
    // prepare gameBoard (size).
    this.state = GameState.INIT;
    this.gameboardService.prepareGameBoard(this.difficultyConfig[difficulty].size, this.difficultyConfig[difficulty].bombs);
    this.timerService.reset();
    this.bombCount = this.difficultyConfig[difficulty].bombs;
    this.flagCount = 0;
    this.sendUpdateFlagBombMsg();
  }

  // when user clicks on board, start Game.
  startGame() {
    console.log("start game");
    this.state = GameState.RUNNING;
    this.timerService.reset();
    this.timerService.run();
  }

  resumeGame() {
    this.state = GameState.RUNNING;
    this.timerService.run();
  }

  // when user clicks restart/surrender, pause game and ask for confirmation
  pauseGame() {
    this.state = GameState.PAUSE;
    this.timerService.pause();
  }


  //------------------------------------------------//

  // when user clicks change difficulty.
  changeDifficulty(difficulty) {
    if (this.state == GameState.RUNNING || this.state == GameState.PAUSE) {
      this.pauseGame();
      // ask for confirmation to restart game
      if (this.confirmQuitGame()) {
        this.difficulty = difficulty;
        this.prepareGame(difficulty);
      } else {
        this.resumeGame();
      }
    } else if (this.state == GameState.INIT || this.state == GameState.GAMEOVER) {
      this.difficulty = difficulty;
      this.prepareGame(difficulty);
    }
  }

  restart(){
    if(this.state == GameState.RUNNING || this.state == GameState.PAUSE){
      if(this.confirmQuitGame()){
        this.prepareGame(this.difficulty);
      } else {
        this.resumeGame();
      }
    } else if(this.state == GameState.INIT || this.state == GameState.GAMEOVER){
      this.prepareGame(this.difficulty);
    }
}

  // when user finishes or loses the game
  gameOver(status) {
    this.state = GameState.GAMEOVER;
    this.timerService.pause();
    this.gameboardService.revealAll();
    // modal gameOver message. win or lose.
    this.showGameoverModal(status);
  }

  // show up modal. Status = 0 if lose. Status = 1 if win.
  showGameoverModal(status) {
    // todo: show up win/lose message accordingly... details include bombs left (if lose), time used.etc.
    let modalContent;
    if (status == 0) {  // lose  
      modalContent = new ModalContent("Game Over!", "TODO: details");
    } else {  // win
      modalContent = new ModalContent("You won!", "TODO: details");
    }
    this.modalSerivce.handleModal(modalContent);
  }

  // pop up modal to confirm. return true/false.
  confirmQuitGame() {
    this.pauseGame();
    //todo: need to cover the screen.
    return confirm("Are you sure you want to stop the game?");
  }

  sendUpdateFlagBombMsg() {
    this.flagBombUpdated.emit({ 'flagCount': this.flagCount, 'bombCount': this.bombCount });
  }

  checkWinGame(){
    return this.gameboardService.checkWinGame();
  }
}
