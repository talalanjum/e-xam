import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin/admin.component';
import { StudentListComponent } from './student-list/student-list.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { NavbarComponent } from '../template/navbar/navbar.component';
import { SidebarComponent } from '../template/sidebar/sidebar.component';
import { FooterComponent } from '../template/footer/footer.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSidenavModule, MatToolbarModule, MatMenuModule, MatListModule, MatSelectModule, MatSliderModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatTableModule, MatInputModule, MatPaginatorModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { AddTeacherComponent } from './add-teacher/add-teacher.component';
import { TeacherListComponent } from './teacher-list/teacher-list.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { SettingsComponent } from './settings/settings.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddGroupMembersComponent } from './add-group-members/add-group-members.component';
 

@NgModule({
  declarations: [
    AdminComponent, 
    StudentListComponent, 
    AddStudentComponent,
    NavbarComponent,
    SidebarComponent,
    FooterComponent,
    AdminSidebarComponent,
    AdminNavbarComponent,
    AdminFooterComponent,
    AddTeacherComponent,
    TeacherListComponent,
    AddCourseComponent,
    CourseListComponent,
    CreateGroupComponent,
    GroupListComponent,
    SettingsComponent,
    GroupDetailsComponent,
    AddAdminComponent,
    AddGroupMembersComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    // MatSidenavModule,
    // MatToolbarModule,
    // MatMenuModule,
    // MatListModule,
    // MatSelectModule,
    // MatSliderModule,
    // MatButtonModule,
    // MatIconModule,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule,
    MatCheckboxModule,
    HttpClientModule,
    AdminRoutingModule,
    MatPaginatorModule
  ]
})
export class AdminModule { }
