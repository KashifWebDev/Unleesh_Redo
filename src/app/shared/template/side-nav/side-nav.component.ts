import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';
import {CommonLayoutComponent} from '../../../layouts/common-layout/common-layout.component';
import {DashboardService} from '../../../dashboard/dashboard.service';
import {currentPathInterface, rightBarUserDetails} from '../../../dashboard/dashboardInterfaces/paht.type';

@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html',
    styleUrls: ['./side-nav.component.css']
})

export class SideNavComponent{

    public menuItems: any[]
    isFolded : boolean;
    isSideNavDark : boolean;
    isExpand : boolean;
    hideSideNav = false;
    userData: rightBarUserDetails;
    currentPathDetails: currentPathInterface;

    constructor( private themeService: ThemeConstantService,
                 private commonLayout: CommonLayoutComponent,
                 private service: DashboardService) {
      this.userData = this.service.userData;
      this.service.currentPathSubject.subscribe(data => this.currentPathDetails = data)
      this.service.userTokensSubject.subscribe(data => this.userData.token = String(data))
      this.getCurrentPath();
    }

    getCurrentPath(){
      this.currentPathDetails = this.service.getCurrentPath();
    }

  toggleFold() {
    this.isFolded = !this.isFolded;
    this.themeService.toggleFold(this.isFolded);
    this.hideSideNav = true;
  }

  toggleExpand() {
    this.isFolded = false;
    this.isExpand = !this.isExpand;
    this.themeService.toggleExpand(this.isExpand);
    this.themeService.toggleFold(this.isFolded);
    this.hideSideNav = false;
  }

    ngOnInit(): void {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    }

    closeMobileMenu(): void {
      this.commonLayout.showMenuBtn = true;
        if (window.innerWidth < 992) {
            this.isFolded = false;
            this.isExpand = !this.isExpand;
            this.themeService.toggleExpand(this.isExpand);
            this.themeService.toggleFold(this.isFolded);
        }
    }

    closeMenu(){
      this.commonLayout.toggleExpand();
      this.commonLayout.showMenuBtn = true;
    }

    logout(){
      this.service.logout();
    }
}
