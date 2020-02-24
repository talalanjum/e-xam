import { GroupchatComponent } from './groupchat/groupchat.component';
import { TeacherComponent } from './teacher/teacher.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { GroupListComponent } from './group-list/group-list.component';


const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [{
      path: '',
      children: [
        { path: 'course_menu/list', component: CourseListComponent },
        { path: 'group_menu/list', component: GroupListComponent },
        { path: 'group_menu/chat', component: GroupchatComponent}
        //  { path: 'manage_students/listall', component: StudentListComponent},
        //  { path: 'manage_students', redirectTo:"/admin/manage_students/listall", pathMatch:'full'},
        //  { path: 'manage_teachers/add', component: AddTeacherComponent},
        //  { path: 'manage_teachers/listall', component: TeacherListComponent},
        //  { path: 'manage_teachers', redirectTo:"/admin/manage_teachers/listall", pathMatch:'full'},
        //  { path: 'manage_courses/add', component: AddCourseComponent},         
        //  { path: 'manage_courses/listall', component: CourseListComponent},
        //  { path: 'manage_courses/', redirectTo:"/admin/manage_courses/listall", pathMatch:'full'},
        //  { path: 'manage_groups/add', component: CreateGroupComponent},         
        //  { path: 'manage_groups/listall', component: GroupListComponent},
        //  { path: 'manage_groups/', redirectTo:"/admin/manage_groups/listall", pathMatch:'full'},
        //  { path: 'settings', component: SettingsComponent},

      ]
    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
