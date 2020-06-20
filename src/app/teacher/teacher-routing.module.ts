
import { AddQuestionComponent } from './add-question/add-question.component';
import { AddAssignmentComponent } from './add-assignment/add-assignment.component';
import { AddContentComponent } from './add-content/add-content.component';
import { GroupchatComponent } from './groupchat/groupchat.component';
import { TeacherComponent } from './teacher/teacher.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { GroupListComponent } from './group-list/group-list.component';
import { CourseComponent } from './course/course.component';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { EditQuestionComponent } from './edit-question/edit-question.component';


const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [{
      path: '',
      children: [
        { path: 'course_menu/list', component: CourseListComponent },
        { path: 'course_menu/course', component: CourseComponent},
        { path: 'group_menu/list', component: GroupListComponent },
        { path: 'group_menu/chat', component: GroupchatComponent},
        { path: 'content/add', component: AddContentComponent},
        { path: 'assignment/add', component: AddAssignmentComponent},
        { path: 'question/add', component: AddQuestionComponent},
        { path: 'course_menu/edit_content', component: ContentEditComponent},
        { path: 'course_menu/edit_question', component: EditQuestionComponent}
      ]
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
