import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './layout-page.component.html',
})
export class LayoutPageComponent {
  public sideBarItems = [
    {
      label: 'List',
      icon: 'list',
      link: './heroes-list',
    },
    {
      label: 'Add',
      icon: 'note_add',
      link: './hero/new',
    },
    {
      label: 'Search',
      icon: 'search',
      link: './search',
    },
  ];
}
