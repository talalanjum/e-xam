import { AuthService } from './../../services/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class AdminNavbarComponent implements OnInit {
  user = localStorage.getItem('token');
  public sidebarOpened = false;
  toggleOffcanvas() {
    this.sidebarOpened = !this.sidebarOpened;
    if (this.sidebarOpened) {
      document.querySelector('.sidebar-offcanvas').classList.add('active');
    }
    else {
      document.querySelector('.sidebar-offcanvas').classList.remove('active');
    }
  }
  constructor(config: NgbDropdownConfig, private authService: AuthService) {
    config.placement = 'bottom-right';
  }
  ngOnInit() {
  }

  logout(){
    this.authService.logout();
  }

}
