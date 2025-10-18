import { Component } from '@angular/core';
import moment from 'moment';
import 'moment/locale/pt-br';
import { MatDialog } from '@angular/material/dialog';
import { posPcrData } from '../../../data/posPcrData';
import { Intervention } from '../../models/intervention';



@Component({
  selector: 'app-post-cpr',
  templateUrl: './post-cpr.html',
  styleUrls: ['./post-cpr.scss'],
  standalone: false
})


export class PostCpr {

  interventions = posPcrData.firstIntervention;
  lapTimes: Intervention[] = [];

  time: number = 0;
   milliseconds: number = 0;

  constructor(
    private matDialog: MatDialog,
  ) { }


  captureTime(item: any) {

    item.cliked = (item.cliked || 0) + 1;
    const itemValue: Intervention = {
      timer: this.formatTime(),
      name: item.name,
      label: item.label
    };
    this.lapTimes.push(itemValue);
  }

  formatTime(): string {
    const minutes = Math.floor(this.time / 60);
    const seconds = this.time % 60;
    return `${this.padNumber(minutes)}:${this.padNumber(seconds)}:${this.padNumber(this.milliseconds, 2)}`;
  }

  padNumber(num: number, length: number = 2): string {
    return num.toString().padStart(length, '0');
  }

  removeLapItem(index: number, intem: any) {
    this.lapTimes.splice(index, 1);
    if (this.interventions.find(d => d.name === intem.name)) {
      this.interventions.find(d => d.name === intem.name)!.cliked--;
    }
    // if (this.intem.interventions.find(d => d.name === drug.name)) {
    //   this.drugs.interventions.find(d => d.name === drug.name)!.cliked--;
    // }
  }

    restartApp() {
    // this.resetStopwatch();
    this.lapTimes = [];
    // this.activeRithm = '';
  }

}
