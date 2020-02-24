import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherFooterComponent } from './teacher-footer/teacher-footer.component';
import { TeacherNavbarComponent } from './teacher-navbar/teacher-navbar.component';
import { TeacherSidebarComponent } from './teacher-sidebar/teacher-sidebar.component';
import { TeacherComponent } from './teacher/teacher.component';
import { CourseListComponent } from './course-list/course-list.component';
import { GroupListComponent } from './group-list/group-list.component';
import { StudentListComponent } from './student-list/student-list.component';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { ContentListComponent } from './content-list/content-list.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { AddContentComponent } from './add-content/add-content.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatTableModule, MatFormFieldModule, MatCheckboxModule, MatPaginatorModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { GroupchatComponent } from './groupchat/groupchat.component';


@NgModule({
  declarations: [
    TeacherFooterComponent,
    TeacherNavbarComponent,
    TeacherSidebarComponent,
    TeacherComponent,
    CourseListComponent,
    GroupListComponent,
    StudentListComponent,
    AssignmentListComponent,
    ContentListComponent,
    QuestionsListComponent,
    AddAssignmentComponent,
    AddContentComponent,
    AddQuestionComponent,
    GroupchatComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
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
    MatPaginatorModule
  ]
})
export class TeacherModule { }
