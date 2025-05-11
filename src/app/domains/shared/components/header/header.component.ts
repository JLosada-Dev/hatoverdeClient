import { Component, signal } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLinkWithHref],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  hideSideMenu = signal(true);
  showMenu = signal(false);

  toogleSideMenu() {
    this.hideSideMenu.update((prevState) => !prevState);
  }

  toggleMenu() {
    this.showMenu.update((prevState) => !prevState);
  }
}
