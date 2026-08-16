import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
   imports: [
    RouterOutlet
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage implements OnInit{

  constructor(private router: Router) {}

  
  ngOnInit(): void {
    
  }

  goToProduct(): void {
   
  
  this.router.navigate(['product']);
}

}
