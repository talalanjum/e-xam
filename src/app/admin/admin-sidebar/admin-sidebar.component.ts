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
  { path: '', title: 'Student', icon: 'menu-icon fas fa-user-graduate', class: '', 
    dropdown: [
      { path: 'manage_students/add', title: 'Add Student', icon: 'menu-icon fas fa-user-plus', class: '', dropdown: [] },
      { path: 'manage_students/listall', title: 'View Students List', icon: 'menu-icon fas fa-list-ol', class: '', dropdown: [] },
    ] },
  { path: '', title: 'Teacher', icon: 'menu-icon fas fa-chalkboard-teacher', class: '',
     dropdown: [
      { path: 'manage_teachers/add', title: 'Add Teacher', icon: 'menu-icon fas fa-user-plus', class: '', dropdown: [] },
      { path: 'manage_teachers/listall', title: 'View Teachers List', icon: 'menu-icon fas fa-list-ol', class: '', dropdown: [] },
     ] },
  { path: '', title: 'Course', icon: 'menu-icon fas fa-book', class: '', 
    dropdown: [
      { path: 'manage_courses/add', title: 'Add Course', icon: 'menu-icon fas fa-folder-plus', class: '', dropdown: [] },
      { path: 'manage_courses/listall', title: 'View Courses List', icon: 'menu-icon fas fa-list-ol', class: '', dropdown: [] },
    ] },
  { path: '', title: 'Group', icon: 'menu-icon fas fa-users', class: '', 
    dropdown: [
      { path: 'manage_groups/add', title: 'Create Group', icon: 'menu-icon fas fa-users-cog', class: '', dropdown: [] },
      { path: 'manage_groups/listall', title: 'View Groups List', icon: 'menu-icon fas fa-list-ol', class: '', dropdown: [] },
    ] },
]

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.scss']
})
export class AdminSidebarComponent implements OnInit {
  showstd = false;
  showtea = false;
  showcr = false;
  showgr = false;


  public samplePagesCollapsed = true;
  public menuItems: any[];
  // user = "admin";
  user = localStorage.getItem('token');
  role;
  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = routes.filter(menuItem => menuItem);
    if(this.router.url.includes("manage_students")){
      this.role="Student";
    }
    else if(this.router.url.includes("manage_teachers")){
      this.role="Teacher";
    } 
  }

  togglestd(){
    this.showstd= !this.showstd
  }

  toggletea(){
    this.showtea= !this.showtea
  }
  togglecr(){
    this.showcr= !this.showcr
  }
  togglegr(){
    this.showgr= !this.showgr
  }
}
