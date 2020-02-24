import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  dropdown: RouteInfo[]
}

const routes : RouteInfo[] = [
  { path: 'course_menu/list', title: 'Courses', icon: 'menu-icon mdi mdi-television', class: '', dropdown: [] },
  { path: 'group_menu/list', title: 'Groups', icon: 'menu-icon mdi mdi-notification-clear-all', class: '', dropdown: [] },
  
]


@Component({
  selector: 'app-student-sidebar',
  templateUrl: './student-sidebar.component.html',
  styleUrls: ['./student-sidebar.component.scss']
})
export class StudentSidebarComponent implements OnInit {


  public samplePagesCollapsed = true;
  public menuItems: any[];
  user = "student";
  // user = localStorage.getItem('token');
  role;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = routes.filter(menuItem => menuItem);
  }

}
