import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router"
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { DifficultyComponent } from './difficulty/difficulty.component';
import { GameboardComponent } from './gameboard/gameboard.component';
import { SoloComponent } from './solo/solo.component';
import { HighscoreComponent } from './highscore/highscore.component';
import { FlagbombComponent } from './flagbomb/flagbomb.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ChatComponent } from './chat/chat.component';
import { TileComponent } from './tile/tile.component';
import { ModalComponent } from './modal/modal.component';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';

import { GameService } from './game.service';
import { UtilsService } from './utils.service';
import { TimerService } from './timer/timer.service';
import { GameboardService } from './gameboard/gameboard.service';
import { ModalService } from './modal/modal.service';
import { AlertMessageService } from './alert-message/alert-message.service';
import { ChatService } from './chat/chat.service';
import { ObjectPipe, MinToMsPipe, LengthLimit } from './sharedPipes';

const appRoutes: Routes = [
  { path: '', redirectTo: '/solo', pathMatch: 'full' },
  { path: 'solo', component: SoloComponent, data: { isSolo: true } },
  { path: 'multiplayer', component: SoloComponent, data: { isSolo: false } },
  { path: 'highscore', component: HighscoreComponent },
  { path: 'howToPlay', component: HowToPlayComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    DifficultyComponent,
    GameboardComponent,
    SoloComponent,
    HighscoreComponent,
    FlagbombComponent,
    FooterComponent,
    HeaderComponent,
    PageNotFoundComponent,
    ChatComponent,
    TileComponent,
    ModalComponent,
    AlertMessageComponent,
    ObjectPipe,
    MinToMsPipe,
    LengthLimit,
    HowToPlayComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule
  ],
  providers: [GameService,
    UtilsService,
    TimerService,
    GameboardService,
    ModalService,
    AlertMessageService,
    ChatService,
    DatePipe
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
