import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

/**
 * Component for displaying a 404 (Page Not Found) error.
 */
@Component({
  selector: 'app-page-not-found',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {}
