import { Component, Output, EventEmitter } from '@angular/core';
import { ThemeService } from '../service/themeService';
import { OverlayContainer } from '@angular/cdk/overlay';
import { tap, take } from 'rxjs/operators';
import { debug } from 'util';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  @Output() public sidenavToggle = new EventEmitter();
    theme$: any;

  constructor(private overlayContainer: OverlayContainer, private themeService: ThemeService) {
    this.theme$ = this.themeService.getTheme()
    //  .pipe(take(1), tap((themeNum) => {
    //  debugger;
    //  if (themeNum == 1) {
    //    this.overlayContainer.getContainerElement().classList.add('dark-theme-nav');
    //    this.overlayContainer.getContainerElement().classList.remove('regular-theme-nav');
    //  }
    //  else {
    //    this.overlayContainer.getContainerElement().classList.remove('dark-theme-nav');
    //    this.overlayContainer.getContainerElement().classList.add('regular-theme-nav');
    //  }
    //}))
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }
}
