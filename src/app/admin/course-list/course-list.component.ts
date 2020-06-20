import { GetDataService } from './../../services/get-data.service';
import { CourseService } from './../../services/admin-services/course.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
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
  department: any
}

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ['position', 'course_code', 'title', 'credit_hours', 'actions'];

  ELEMENT_DATA: PeriodicElement[] = [];
  dataSource
  closeResult: string;
  modalOptions: NgbModalOptions;
  departments = []
  courseData = {
    course_code: "",
    title: "",
    credit_hours: "",
    CLO: [],
    class: [],
    department: "",
  }
  constructor(
    private courseService: CourseService,
    private modalService: NgbModal,
    private router: Router,
    private getdataservice: GetDataService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }

  form = new FormGroup({
    course_code: new FormControl(),
    title: new FormControl('', Validators.required),
    credit_hours: new FormControl('', [
      Validators.required
    ]),
    CLO: new FormArray([]),
    class_name: new FormArray([]),
    department: new FormArray([])
  })

  get credit_hours() {
    return this.form.get('credit_hours')
  }
  get title() {
    return this.form.get('title')
  }
  get CLOs(): FormArray {
    return this.form.get('CLO') as FormArray
  }
  get class(): FormArray {
    return this.form.get('class_name') as FormArray
  }
  get department(): FormArray {
    return this.form.get('department') as FormArray
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
    this.dataSource.paginator = this.paginator;
  }


  openDetails(modal, id) {
    this.courseService.getCourseCode(id).subscribe(
      result => {
        this.courseData = {
          CLO: result['CLO'],
          class: result['class_name'],
          department: result['department'],
          course_code: result['course_code'],
          title: result['title'],
          credit_hours: result['credit_hours'],
        } 
      }
    )
    this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEdit(modal, id) {
    this.courseService.getCourseCode(id).subscribe(
      result => {
        this.courseData.credit_hours = result['credit_hours']
        this.courseData.course_code = result['course_code']
        for (let clo of result['CLO']) {
          this.CLOs.push(
            new FormControl(clo, Validators.required)
          )
        }
        for (let class_name of result['class_name']) {
          this.class.push(
            new FormControl(class_name, Validators.required)
          )
        }
        for (let department of result['department']) {
          this.department.push(
            new FormControl(department)
          )
        }
        this.courseData.title = result['title']
        this.getdataservice.getDepartments().subscribe(
          result => {
            for (let data in result) {
              let foundcontrol
              for (let control of this.department.controls) {
                if (control.value == result[data].name) {
                  foundcontrol = true
                  break;
                }
                else {
                  foundcontrol = false
                }
              }
              this.departments.push({
                name: result[data].name,
                checked: foundcontrol
              })
              this.form.patchValue({
                course_code: this.courseData.course_code
              })
            }
          }
        )
      }
    )
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteCourse(id, index) {
    let formData = new FormData()
    formData.append('course_code', id)
    this.courseService.deleteCourse(formData).subscribe(
      result => { 
        this.dataSource.data.splice(index, 1)
        this.dataSource._updateChangeSubscription()
      }
    )
  }

  updateCourse(data) { 
    this.courseService.updateCourse(data).subscribe(
      result => { 
        this.emptyDataFields()
      }
    )
  }

  emptyDataFields() {
    this.form.reset()
    for(let i=0; i<=this.CLOs.length+1; i++){
      this.CLOs.controls.pop()  
    }
    for(let i=0; i<=this.department.length+1; i++){
      this.department.controls.pop()
    }
    for(let i=0; i<=this.class.length+1; i++){
      this.class.controls.pop()
    }
    this.departments = []
    this.courseData = {
      course_code: "",
      title: "",
      credit_hours: "",
      CLO: [],
      class: [],
      department: ""
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

  oncheckchange(event) {
    var formArray: FormArray = this.department as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    }
    else {
      formArray.controls.forEach((ctrl: FormControl) => {
        let index = formArray.controls.indexOf(ctrl);
        if (ctrl.value == event.source.value) {
          formArray.removeAt(index);
          return;
        }
      });
    }
  }

  addCLO(clo: HTMLInputElement) {
    this.CLOs.push(
      new FormControl('', Validators.required) 
    ) 

  }

  removeCLO(clo: FormControl) {
    let index = this.CLOs.controls.indexOf(clo)
    this.CLOs.removeAt(index)
  }

  addClass(inputclass: HTMLInputElement) {
    this.class.push(
      new FormControl('', Validators.required) 
    )
  }

  removeClass(cls: FormControl) {
    let index = this.class.controls.indexOf(cls)
    this.class.removeAt(index)
  }

}
