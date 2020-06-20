import { TeacherService } from './../../services/admin-services/teacher.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidators } from 'src/app/validators/password.validators';
import { ContactValidators } from 'src/app/validators/contact.validators';

export interface PeriodicElement {
  position: any;
  user_id: any;
  name: any;
  contact: any;
  email: any;
  address: any;
  department: any;
  joining_date: any;
  courses: [{
    course_name: any;
    class_name: any;
  }]
}


@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss']
})
export class TeacherListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  ELEMENT_DATA: PeriodicElement[];
  displayedColumns: string[] = ['position', 'user_id', 'name', 'department', 'actions'];
  dataSource
  closeResult: string;
  modalOptions: NgbModalOptions;

  teacherData = {
    _id : "",
    user_id: "",
    password : "",
    name: "",
    contact: "",
    email: "",
    address: "",
    department: "",
    joining_date: "",
    courses: ""
  }

  constructor(
    private teacherService: TeacherService,
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
    user_id: new FormControl(),
    contact: new FormControl('', [
      Validators.required,
      ContactValidators.contactcheck,
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    address: new FormControl('', [
      Validators.required,
    ]),
  });

  get user_id() {
    return this.form.get('user_id');
  }
  get password() {
    return this.form.get('password');
  }
  get name() {
    return this.form.get('name');
  }
  get contact() {
    return this.form.get('contact');
  }
  get email() {
    return this.form.get('email');
  }
  get address() {
    return this.form.get('address');
  }
  get department() {
    return this.form.get('department');
  }
  get joining_date() {
    return this.form.get('joining_date');
  }
  get courses(){
    return this.form.get('courses');
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.teacherService.getTeachers().subscribe(
      result => {
        this.populateTable(result);
      }
    )
  }

  populateTable(result) {
    let teacher: PeriodicElement;
    this.ELEMENT_DATA = [];
    let position = 1;
    for (let data in result) {
      teacher = {
        position: position,
        user_id: result[data].user_id,
        name: result[data].name,
        contact: result[data].contact,
        email: result[data].email,
        address: result[data].address,
        department: result[data].department,
        joining_date: result[data].joining_date,
        courses: [
          {
            course_name: null,
            class_name: null,
          }
        ]
      }
      teacher.courses.pop();
      for (let item in result[data].courses) {
        let course = {
          course_name: result[data].courses[item].course_name,
          class_name: result[data].courses[item].class_name
        }
        teacher.courses.push(course);
      }
      this.ELEMENT_DATA.push(teacher)
      position++
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  openEdit(content, id) {
    this.teacherService.getTeacher(id).subscribe(result => {
      if (result) {
        this.populateEdit(result);
      }
    });
    this.modalService.open(content, this.modalOptions).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDetails(content, id) {
    this.teacherService.getTeacher(id).subscribe(
      result => {
        if (result) { 
          this.populateDetails(result);
        }
      }
    )
    this.modalService.open(content, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  populateEdit(data) {
    this.teacherData = data[0]
    this.teacherData.contact = 0 + "" + this.teacherData.contact;
    this.teacherData.joining_date = this.teacherData.joining_date.slice(0, 10);
    this.form.patchValue({
      user_id: this.teacherData.user_id
    })
  }

  populateDetails(data) {
    this.teacherData = data[0];
    this.teacherData.contact = 0 + "" + this.teacherData.contact;
    this.teacherData.joining_date = this.teacherData.joining_date.slice(0, 10);
  }

  updateTeacher(data: NgForm) {
    this.teacherService.updateTeacher(data).subscribe(
      result=>{ 
      }
    )
  }

  deleteTeacher(id, index) {
    this.teacherService.deleteTeacher(id).subscribe(
      result=>{ 
        this.dataSource.data.splice(index, 1)
        this.dataSource._updateChangeSubscription()
      }
    )
  }

  emptyDataFields() {
    this.teacherData = {
      _id : "",
      user_id: "",
      password : "",
      name: "",
      contact: "",
      email: "",
      address: "",
      department: "",
      joining_date: "",
      courses: ""
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
