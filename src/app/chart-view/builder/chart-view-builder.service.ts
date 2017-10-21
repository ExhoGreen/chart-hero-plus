import { Injectable } from '@angular/core';

import {
    ChartViewPrepared,
    ChartViewPreparedNote,
    ChartViewPreparedNoteGuitarColor,
    ChartViewPreparedNoteGHLColor,
} from '../chart-view-prepared';
import {
    ChartView,
    ChartViewBeat,
    ChartViewNote,
    ChartViewNoteGuitar,
    ChartViewNoteGuitarColor,
    ChartViewNoteGHL,
    ChartViewNoteGHLColor,
    ChartViewNoteOpen,
    ChartViewNoteType,
} from '../chart-view';

const speed = 1;
const timeBefore = (1 / speed) * 1.2;
const timeAfter = (1 / speed) * -0.3;

const zeroPosition = (): number => {
    return timeBefore / (timeBefore - timeAfter) * 100;
};

const incrementWhenNoEvents = 1;

@Injectable()
export class ChartViewBuilderService {

    constructor() {
    }

    buildView(csv: ChartViewPrepared, currentTime: number, playing: boolean): ChartView {
        return {
            currentTime,
            currentIncrement: this.calculateCurrentIncrement(csv, currentTime, playing),
            zeroPosition: zeroPosition(),
            duration: csv.duration,
            beats: this.buildBeats(csv, currentTime),
            notes: this.buildNotes(csv, currentTime, playing),
        };
    }

    private buildBeats(csv: ChartViewPrepared, currentTime:number): ChartViewBeat[] {
        return csv.beats
            .filter(b => this.timeInView(b.time, currentTime))
            .map(b => ({
                id: b.id,
                y: this.calculateYPos(b.time, currentTime),
            }));
    }

    private calculateCurrentIncrement(csv: ChartViewPrepared, currentTime: number, playing: boolean)
        : number {
        if (playing) {
            return 0;
        }
        const currentBeat = csv.beats
            .slice().reverse()
            .find(b => b.time <= currentTime);
        if (!currentBeat) {
            return incrementWhenNoEvents;
        }
        const nextBeat = csv.beats.find(b => b.time > currentTime);
        if (!nextBeat) {
            const previousBeat = csv.beats[csv.beats.length - 2];
            return currentBeat.time - previousBeat.time;
        }
        return nextBeat.time - currentBeat.time;
    }

    private buildNotes(csv: ChartViewPrepared, currentTime: number, playing: boolean)
        : ChartViewNote[] {
        return [].concat.apply([], csv.notes
            .filter(n => this.timeInView(n.time, currentTime))
            .filter(n => playing ? n.time >= currentTime : true)
            .map((note): ChartViewNote[] => {
                const y = this.calculateYPos(note.time, currentTime);
                if (note.open) {
                    const type = ChartViewNoteType.Open;
                    return [{ type, y, id: note.id + 1 }] as ChartViewNoteOpen[];
                } else {
                    return this.splitNote(note, y);
                }
            }))
            .sort((a: ChartViewNote, b: ChartViewNote) => a.y - b.y);
    }

    private splitNote(note: ChartViewPreparedNote, y: number): ChartViewNote[] {
        const notes: (ChartViewNoteGuitar | ChartViewNoteGHL)[] = [];
        let type = ChartViewNoteType.Guitar;
        if (note.guitarLane1 !== ChartViewPreparedNoteGuitarColor.None) {
            const x = 13;
            const color = this.buildGuitarNoteColor(note.guitarLane1);
            notes.push({ type, x, y, color, id: note.id + notes.length + 1 });
        }
        if (note.guitarLane2 !== ChartViewPreparedNoteGuitarColor.None) {
            const x = 31.5;
            const color = this.buildGuitarNoteColor(note.guitarLane2);
            notes.push({ type, x, y, color, id: note.id + notes.length + 1 });
        }
        if (note.guitarLane3 !== ChartViewPreparedNoteGuitarColor.None) {
            const x = 50;
            const color = this.buildGuitarNoteColor(note.guitarLane3);
            notes.push({ type, x, y, color, id: note.id + notes.length + 1 });
        }
        if (note.guitarLane4 !== ChartViewPreparedNoteGuitarColor.None) {
            const x = 68.5;
            const color = this.buildGuitarNoteColor(note.guitarLane4);
            notes.push({ type, x, y, color, id: note.id + notes.length + 1 });
        }
        if (note.guitarLane5 !== ChartViewPreparedNoteGuitarColor.None) {
            const x = 87;
            const color = this.buildGuitarNoteColor(note.guitarLane5);
            notes.push({ type, x, y, color, id: note.id + notes.length + 1 });
        }
        type = ChartViewNoteType.GHL;
        if (note.ghlLane1 !== ChartViewPreparedNoteGHLColor.None) {
            const x = 25;
            const color = this.buildGHLNoteColor(note.ghlLane1);
            notes.push({ type, x, y, color, id: note.id + notes.length + 1 });
        }
        if (note.ghlLane2 !== ChartViewPreparedNoteGHLColor.None) {
            const x = 50;
            const color = this.buildGHLNoteColor(note.ghlLane2);
            notes.push({ type, x, y, color, id: note.id + notes.length + 1 });
        }
        if (note.ghlLane3 !== ChartViewPreparedNoteGHLColor.None) {
            const x = 75;
            const color = this.buildGHLNoteColor(note.ghlLane3);
            notes.push({ type, x, y, color, id: note.id + notes.length + 1 });
        }
        return notes;
    }

    private timeInView(eventTime: number, currentTime: number): boolean {
        return eventTime > (currentTime + timeAfter) && eventTime < (currentTime + timeBefore);  
    }

    private calculateYPos(eventTime: number, currentTime: number): number {
        const bottom = currentTime + timeAfter;
        const top = currentTime + timeBefore;
        return (1 - (eventTime - bottom) / (top - bottom)) * 100;
    }

    private buildGuitarNoteColor(color: ChartViewPreparedNoteGuitarColor)
        : ChartViewNoteGuitarColor {
        switch (color) {
        case ChartViewPreparedNoteGuitarColor.Green:
            return ChartViewNoteGuitarColor.Green;
        case ChartViewPreparedNoteGuitarColor.Red:
            return ChartViewNoteGuitarColor.Red;
        case ChartViewPreparedNoteGuitarColor.Yellow:
            return ChartViewNoteGuitarColor.Yellow;
        case ChartViewPreparedNoteGuitarColor.Blue:
            return ChartViewNoteGuitarColor.Blue;
        case ChartViewPreparedNoteGuitarColor.Orange:
            return ChartViewNoteGuitarColor.Orange;
        }
    }

    private buildGHLNoteColor(color: ChartViewPreparedNoteGHLColor): ChartViewNoteGHLColor {
        switch (color) {
        case ChartViewPreparedNoteGHLColor.Black:
            return ChartViewNoteGHLColor.Black;
        case ChartViewPreparedNoteGHLColor.White:
            return ChartViewNoteGHLColor.White;
        case ChartViewPreparedNoteGHLColor.Chord:
            return ChartViewNoteGHLColor.Chord;
        }
    }
}
