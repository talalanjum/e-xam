import { CourseService } from './../../services/admin-services/course.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


interface PeriodicElement {
  position: any;
  course_code: any;
  title: any;
  credit_hours: any;
  CLO: any[];
  class: any[];
}

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

  displayedColumns: string[] = ['position', 'course_code', 'title', 'credit_hours', 'actions'];

  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource
  closeResult: string;
  modalOptions: NgbModalOptions;

  courseData = {
    position :"",
    course_code:"",
    title:"",
    credit_hours:"",
    CLO : [],
    class: [],
  }
  constructor(
    private courseService: CourseService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }

  form = new FormGroup({
    course_code: new FormControl('', [
      Validators.required
    ]),
    title: new FormControl('', [
      Validators.required
    ]),
    credit_hours: new FormControl('', [
      Validators.required
    ]),
    CLO: new FormArray([]),
    class_name: new FormArray([])
  })

  get course_code() {
    return this.form.get('course_code')
  }
  get title(){
    return this.form.get('title')
  }
  get credit_hours(){
    return this.form.get('credit_hours')
  }
  get CLOs() : FormArray{
    return this.form.get('CLO') as FormArray
  }
  get class() : FormArray{
    return this.form.get('class_name') as FormArray
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.courseService.getCourses().subscribe(
      result => {
        this.populateTable(result)
      }
    )
  }

  populateTable(result) {
    let position = 0
    for (let data of result) {
      let course: PeriodicElement = data
      course.position = position + 1
      this.ELEMENT_DATA.push(course)
      position++
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }


  openDetails(modal, id) {
    this.courseService.getCourseCode(id).subscribe(
      result => {
        this.courseData = result['course']
      }
    )
    this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEdit(modal,id){
    this.courseService.getCourseCode(id).subscribe(
      result=>{
        this.courseData = result['course']
      }
    )
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteCourse(id) {
    let formData = new FormData()
    formData.append('course_code', id)
    this.courseService.deleteCourse(formData).subscribe(
      result => {
        console.log(result)
      }
    )
  }

  updateCourse(data){
    this.courseService.updateCourse(data).subscribe(
      result=>{
        console.log(result)
      }
    )
  }

  emptyDataFields() {
    this.courseData = {
      position :"",
      course_code:"",
      title:"",
      credit_hours:"",
      CLO : [],
      class: [],
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
