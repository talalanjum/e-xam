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
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule, MatTableModule, MatFormFieldModule, MatCheckboxModule, MatPaginatorModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { GroupchatComponent } from './groupchat/groupchat.component';
import { QuizComponent } from './quiz/quiz.component';
import { ExamComponent } from './exam/exam.component';
import { CountdownTimerModule } from 'angular-countdown-timer';


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
    GroupchatComponent,
    QuizComponent,
    ExamComponent,
  ],

  imports: [
    CommonModule,
    StudentRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
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
    MatPaginatorModule,
    RxReactiveFormsModule,
    Ng2SearchPipeModule,
    CountdownTimerModule.forRoot(),
  ]
})
export class StudentModule { }
