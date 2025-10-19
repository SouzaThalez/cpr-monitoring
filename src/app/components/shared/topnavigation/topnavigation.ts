import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-topnavigation',
  standalone: false,
  templateUrl: './topnavigation.html',
  styleUrl: './topnavigation.scss'
})
export class Topnavigation {
  
  @Input() moduleRouterName = '';
  @Input() routerPathOne = '';
  @Input() routerPathTwo = '';
  @Input() routerPathThree = '';
  
  pageType = 'menus';      // ou algo como 'exams', 'settings', etc.
  alink = 'rcp-anotador';  // identificador do menu/rota


}
