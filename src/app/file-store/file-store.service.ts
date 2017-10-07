import { Injectable } from '@angular/core';

import { AudioPlayerService } from '../audio-player/audio-player.service';
import { ChartFileImporterService } from '../chart-file/chart-file-importer.service';

@Injectable()
export class FileStoreService {

    private $audioFileName: string;
    private $chartFileName: string;

    constructor(
        private audioPlayer: AudioPlayerService,
        private chartFileImporter: ChartFileImporterService) {
    }

    get audioFileName(): string {
        return this.$audioFileName;
    }

    set audioFile(file: File) {
        this.$audioFileName = file.name;
        this.audioPlayer.audio = URL.createObjectURL(file);
    }

    get chartFileName(): string {
        return this.$chartFileName;
    }

    set chartFile(file: File) {
        this.$chartFileName = file.name;
        const reader = new FileReader();
        reader.onload = () => {
            this.chartFileImporter.import(reader.result);
        };
        reader.readAsText(file);
    }
}
