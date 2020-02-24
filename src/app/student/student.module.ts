import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentFooterComponent } from './student-footer/student-footer.component';
import { StudentNavbarComponent } from './student-navbar/student-navbar.component';
import { StudentSidebarComponent } from './student-sidebar/student-sidebar.component';
import { SettingsComponent } from './settings/settings.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupMessagingComponent } from './group-messaging/group-messaging.component';
import { StudentComponent } from './student/student.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    StudentFooterComponent,
    StudentNavbarComponent,
    StudentSidebarComponent,
    SettingsComponent,
    GroupListComponent,
    GroupMessagingComponent,
    StudentComponent,
    CourseListComponent,
    CourseDetailComponent,
  ],

  imports: [
    CommonModule,
    StudentRoutingModule,
    NgbModule,
  ]
})
export class StudentModule { }
