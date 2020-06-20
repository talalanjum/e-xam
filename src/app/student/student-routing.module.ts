import { ExamComponent } from './exam/exam.component';
import { QuizComponent } from './quiz/quiz.component';
import { GroupchatComponent } from './groupchat/groupchat.component';
import { SettingsComponent } from './settings/settings.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { CourseListComponent } from './course-list/course-list.component';
import { GroupListComponent } from './group-list/group-list.component';


const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [{
      path: '',
      children: [
        { path: 'course_menu/list', component: CourseListComponent },
        { path: 'course_menu/course', component: CourseDetailComponent },
        { path: 'exam', component: ExamComponent },
        { path: 'quiz', component: QuizComponent },
        { path: 'group_menu/list', component: GroupListComponent },
        { path: 'group_menu/chat', component: GroupchatComponent },
        { path: 'settings', component: SettingsComponent },

      ]
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
