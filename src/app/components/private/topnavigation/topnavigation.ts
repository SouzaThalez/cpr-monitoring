import { Component } from '@angular/core';

@Component({
  selector: 'app-topnavigation',
  standalone: false,
  templateUrl: './topnavigation.html',
  styleUrl: './topnavigation.scss'
})
export class Topnavigation {
    
  pageType = 'menus';      // ou algo como 'exams', 'settings', etc.
  alink = 'rcp-anotador';  // identificador do menu/rota


}
