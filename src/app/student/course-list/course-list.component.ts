import { StudentCoursesService } from './../../services/student-services/courses.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms';
import { CourseService } from './../../services/admin-services/course.service';
import { Router } from '@angular/router';
import { CourseshareService } from './../../services/student-services/courseshare.service';

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
  spinner: boolean = false;
  message
  form = new FormGroup({
    content: new FormControl([])
  })

  constructor(
    private courseservice: StudentCoursesService,
    private admincourseservice: CourseService,
    private router: Router,
    private courseshare: CourseshareService
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.message = "Fetching List.."
    this.spinner = true
    this.courseservice.getCourses().subscribe(
      result => {
        let position = 1
        for (let course of result[0].courses) {
          this.admincourseservice.getCourseCode(course.course_code).subscribe(
            res => {
              if (res) {
                let item: PeriodicElement = {
                  position: position,
                  course_code: course.course_code,
                  course_name: course.course_name,
                  classes: course.class_name,
                  clos: res['CLO']
                }
                this.ELEMENT_DATA.push(item)
                position++
              }
            }
          )
        }
        setTimeout(() => {
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
          this.dataSource.paginator = this.paginator;
          this.spinner = false
        }, 1500)
      }
    )
  }

  navigateCourse(row) {
    this.courseshare.changeData(row)
    this.router.navigate(['/student/course_menu/course'])
  }

}
