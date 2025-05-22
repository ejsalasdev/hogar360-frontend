import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-access-denied-page',
  templateUrl: './access-denied-page.component.html',
  styleUrls: ['./access-denied-page.component.scss']
})
export class AccessDeniedPageComponent {
  
  constructor(
    private router: Router,
    private location: Location
  ) { }

  goBack(): void {
    this.location.back();
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
