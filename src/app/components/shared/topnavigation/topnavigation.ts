import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-topnavigation',
  standalone: false,
  templateUrl: './topnavigation.html',
  styleUrl: './topnavigation.scss'
})
export class Topnavigation implements OnInit {


  @Input() moduleRouterName = '';
  @Input() routerPathOne = '';
  @Input() routerPathTwo = '';
  @Input() routerPathThree = '';


  isLessonMode = false;

  ngOnInit(): void {

    switch (this.moduleRouterName) {
      case 'private':
          this.isLessonMode = true;
        break;
      case 'lesson':
        this.isLessonMode = false;
        break;

      default:
        break;
    }


  }




}
