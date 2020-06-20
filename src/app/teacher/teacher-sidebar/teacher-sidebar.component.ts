import { Component, OnInit } from '@angular/core';
import { RouteInfo } from 'src/app/student/student-sidebar/student-sidebar.component';
import { Router } from '@angular/router';



const routes : RouteInfo[] = [
  { path: 'course_menu/list', title: 'Courses', icon: 'menu-icon far fa-list-alt', class: '', dropdown: [] },
  { path: 'group_menu/list', title: 'Groups', icon: 'menu-icon fas fa-users', class: '', dropdown: [] },
]

@Component({
  selector: 'app-teacher-sidebar',
  templateUrl: './teacher-sidebar.component.html',
  styleUrls: ['./teacher-sidebar.component.scss']
})
export class TeacherSidebarComponent implements OnInit {

  public samplePagesCollapsed = true;
  public menuItems: any[];
  user = localStorage.getItem('token');
  role;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = routes.filter(menuItem => menuItem);
  }

}
