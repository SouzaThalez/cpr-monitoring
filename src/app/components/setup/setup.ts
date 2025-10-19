import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  standalone: true,
  templateUrl: './setup.html',
  styleUrl: './setup.scss',
  imports: [MatButtonModule],
})
export class Setup {

  constructor(private router: Router) {}

  goToClassMode() {
    this.router.navigate(['/lesson/aula-anotacoes']); 
  }

  goToExamMode() {
    this.router.navigate(['/private/pcr-anotacoes']); 
  }
}
