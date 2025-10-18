import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  standalone: false,
  templateUrl: './setup.html',
  styleUrl: './setup.scss'
})
export class Setup {

  constructor(private router: Router) {}

  goToClassMode() {
    this.router.navigate(['/class-mode']); 
  }

  goToExamMode() {
    this.router.navigate(['/private/pcr-anotacoes']); 
  }
}
