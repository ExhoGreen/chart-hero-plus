import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material';
import { Observable } from 'rxjs';

import { ChartView } from '../../chart-view/chart-view';
import { TimeService } from '../../time/time.service';
import { ScrollbarBuilder } from './builder/scrollbar-builder.service';
import { Scrollbar } from './builder/scrollbar';

const scrollingConstant = 0.018867924528301886;
const lineHeightPx = 17.666;

@Component({
    selector: 'app-scrollbar',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./scrollbar.component.css'],
})
export class ScrollbarComponent implements AfterViewInit {
    @ViewChild(MatTooltip) currentTimeTooltip: MatTooltip;

    private duration: number;
    private scrollbar: Scrollbar;
    private moving: boolean;
    private playing: boolean;
    private svg: any;

    constructor(
        private builder: ScrollbarBuilder,
        private scrollbarElement: ElementRef,
        private timeService: TimeService,
    ) {
        this.builder.duration.subscribe((duration) => {
            this.duration = duration;
        });
        this.builder.scrollbar.subscribe((scrollbar) => {
            this.scrollbar = scrollbar;
        });
    }

    ngAfterViewInit() {
        this.moving = false;
        this.playing = false;
        this.svg = this.scrollbarElement.nativeElement.querySelector('svg');
    }

    get height(): number {
        return 10;
    }

    get handlePosition(): number {
        return 97 - this.height -
            ((94 - this.height) * (this.scrollbar.currentTime / this.duration));
    }

    get tooltip(): string {
        return this.scrollbar.formattedTime;
    }

    scroll(e: any): void {
        if (this.timeService.playing) {
            return;
        }
        const delta = e.deltaMode === 1 ? e.deltaY * lineHeightPx : e.deltaY;
        const targetTime = this.scrollbar.currentTime +
            (-scrollingConstant * this.scrollbar.currentIncrement * delta);
        const newTime = Math.min(this.duration, Math.max(0, targetTime));
        this.timeService.time = newTime;
    }

    clickScrollbar(e: any): void {
        if (this.timeService.playing) {
            this.timeService.pause();
            this.playing = true;
        }
        this.propagateTimeChange(e);
        if (this.playing) {
            this.timeService.play();
            this.playing = false;
        }
    }

    clickHandle(e: any): void {
        if (this.timeService.playing) {
            this.timeService.pause();
            this.playing = true;
        }
        this.moving = true;
        this.currentTimeTooltip.show();
    }

    moveHandle(e: any): void {
        if (this.moving) {
            this.currentTimeTooltip.hide();
            this.currentTimeTooltip.show();
            this.propagateTimeChange(e);
        }
    }

    releaseHandle(e: any): void {
        if (this.moving) {
            this.propagateTimeChange(e);
            this.moving = false;
            if (this.playing) {
                this.timeService.play();
                this.playing = false;
            }
        }
    }

    moveForwards(e: any): void {
        if (this.timeService.playing) {
            return;
        }
        const newTime = Math.min(
            this.duration,
            this.scrollbar.currentTime + this.scrollbar.currentIncrement,
        );        
        this.timeService.time = newTime;
        e.stopPropagation();
    }

    moveBackwards(e: any): void {
        if (this.timeService.playing) {
            return;
        }
        const newTime = Math.max
            (0, this.scrollbar.currentTime - this.scrollbar.currentIncrement);
        this.timeService.time = newTime;
        e.stopPropagation();
    }

    private propagateTimeChange(e: any) {
        const newTime = this.calculateTime(e);
        this.timeService.time = newTime;
    }

    private calculateTime(e: any): number {
        const point = this.svg.createSVGPoint();
        point.x = e.clientX;
        point.y = e.clientY;
        const yPos = point.matrixTransform(this.svg.getScreenCTM().inverse()).y;
        const clampedPos = Math.min(100 - (this.height / 2), Math.max(this.height / 2, yPos));
        const scaledPos = (clampedPos - (this.height / 2)) / (100 - this.height);
        return (1 - scaledPos) * this.duration;
    }
}
