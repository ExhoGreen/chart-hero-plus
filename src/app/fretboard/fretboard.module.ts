import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BeatComponent } from './beat/beat.component';
import { FretboardComponent } from './fretboard/fretboard.component';
import { NoteGHLComponent } from './note/ghl/note-ghl.component';
import { NoteGuitarComponent } from './note/guitar/note-guitar.component';
import { NoteOpenComponent } from './note/open/note-open.component';
import { NoteComponent } from './note/note.component';

import { BeatService } from './beat/beat.service';
import { NoteService } from './note/note.service';
import { PreparerService } from './preparer/preparer.service';
import { RendererService } from './renderer/renderer.service';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatTooltipModule,
    ],
    exports: [
        FretboardComponent,
    ],
    declarations: [
        BeatComponent,
        FretboardComponent,
        NoteGHLComponent,
        NoteGuitarComponent,
        NoteOpenComponent,
        NoteComponent,
    ],
    providers: [
        BeatService,
        NoteService,
        PreparerService,
        RendererService,
    ],
})
export class AppFretboardModule {
}
