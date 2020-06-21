import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators'

import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherFooterComponent } from './teacher-footer/teacher-footer.component';
import { TeacherNavbarComponent } from './teacher-navbar/teacher-navbar.component';
import { TeacherSidebarComponent } from './teacher-sidebar/teacher-sidebar.component';
import { TeacherComponent } from './teacher/teacher.component';
import { CourseListComponent } from './course-list/course-list.component';
import { GroupListComponent } from './group-list/group-list.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { AddContentComponent } from './add-content/add-content.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatTableModule, MatFormFieldModule, MatCheckboxModule, MatPaginatorModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { GroupchatComponent } from './groupchat/groupchat.component';
import { CourseComponent } from './course/course.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';
import { AddQuizComponent } from './add-quiz/add-quiz.component';

@NgModule({
  declarations: [
    TeacherFooterComponent,
    TeacherNavbarComponent,
    TeacherSidebarComponent,
    TeacherComponent,
    CourseListComponent,
    GroupListComponent,
    AddAssignmentComponent,
    AddContentComponent,
    AddQuestionComponent,
    GroupchatComponent,
    CourseComponent,
    ContentEditComponent,
    EditQuestionComponent,
    AddQuizComponent
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
    MatPaginatorModule,
    RxReactiveFormsModule,
    Ng2SearchPipeModule
  ]
})
export class TeacherModule { }
