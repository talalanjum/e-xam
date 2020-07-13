import { ToastrModule, ToastrService } from 'ngx-toastr';
import { CourseshareService } from './../../services/teacher-services/courseshare.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { CourseService } from 'src/app/services/admin-services/course.service';
import { TeacherCourseService } from 'src/app/services/teacher-services/course.service';
import { Router } from '@angular/router';

interface PeriodicElement {
  position: any;
  course_code: any;
  course_name: any;
  classes: any[];
  clos: any[]
}
@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns: string[] = ['position', 'course_code', 'course_name'];
  dataSource
  form = new FormGroup({
    content: new FormControl([])
  })
  spinner = false;
  message = "Fetching data.."

  constructor(
    private courseservice: TeacherCourseService,
    private admincourseservice: CourseService,
    private router: Router,
    private toastr: ToastrService,
    private courseshare: CourseshareService
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    // this.toastr.success('Hello world!', 'Toastr fun!');
    this.spinner = true;

    this.courseservice.getCourses().subscribe(
      result => {
        if (result) {
          let position = 1
          for (let data in result['courses']) {
            this.admincourseservice.getCourseCode(result['courses'][data].course_code).subscribe(
              res => {
                if (res) {
                  let course: PeriodicElement = {
                    position: position,
                    course_code: result['courses'][data].course_code,
                    course_name: res['title'],
                    classes: result['courses'][data].class_name,
                    clos: res['CLO']
                  }
                  this.ELEMENT_DATA.push(course)
                  position++
                }
              }
            )
          }
          setTimeout(() => {
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
            this.dataSource.paginator = this.paginator;
            this.spinner = false;

          }, 1500)
        }
      }
    )
  }

  navigateCourse(row) {
    this.courseshare.changeData(row)
    this.router.navigate(['/teacher/course_menu/course'])
  }

}
