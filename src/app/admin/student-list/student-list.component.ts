import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { GetDataService } from './../../services/get-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentServiceService } from 'src/app/services/student-service.service';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder, AbstractControl, NgForm } from '@angular/forms';
import { UsernameValidators } from 'src/app/validators/username.validators';
import { PasswordValidators } from 'src/app/validators/password.validators';
import { ContactValidators } from 'src/app/validators/contact.validators';

interface TableData {
  headerRow: string[];
  dataRows: string[][];
}


interface PeriodicElement {
  position: any;
  registration_number: any;
  name: any;
  department: any;
}


@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})

export class StudentListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns: string[] = ['position', 'registration_number', 'name', 'department', 'actions'];
  dataSource
  spinner: boolean = false;
  message

  public samplePagesCollapsed = true;
  user = localStorage.getItem('token');
  private departments: any = [];
  private batches: any[] = [];
  private courses: any = [];

  closeResult: string;
  modalOptions: NgbModalOptions;

  studentData = {
    registration_number: '',
    name: '',
    contact: '',
    email: '',
    password: '',
    batch: '',
    address: '',
    department: '',
    joining_date: '',
    semester: '',
    courses: []
  };

  constructor(
    private studentservice: StudentServiceService,
    private modalService: NgbModal,
    private GetDataService: GetDataService,
    private fb: FormBuilder,
    private toastr: ToastrService
    ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.GetDataService.getBatches().subscribe(
      result => {
        for (let data in result) {
          this.batches.push(result[data].name)
        }
      }
    )
    this.GetDataService.getDepartments().subscribe(
      result => {
        if (result) {
          for (let data in result) {
            this.departments.push(result[data].name);
          }
        }
      }
    );
    this.GetDataService.getCourses().subscribe(
      result => {
        if (result) {
          for (let data in result) {
            this.courses.push(result[data].title);
          }
        }
      }
    );
  }

  updateList(batch) {
    this.message = "Fetching List..."
    this.spinner = true
    this.studentservice
      .getBatchStudents(batch)
      .subscribe(result => {
        if ((result as string).includes('No Student found')) {
          this.ELEMENT_DATA = []
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
        }
        else {
          this.populateTable(result);
        }
      }, err => {

      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.emptyDataFields()
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.emptyDataFields()
      return 'by clicking on a backdrop';
    } else {
      this.emptyDataFields()
      return `with: ${reason}`;
    }
  }

  populateTable(result) {
    let position = 1;
    this.ELEMENT_DATA = [];
    for (let data in result) {
      let student: PeriodicElement = {
        position: position,
        registration_number: result[data].registration_number,
        name: result[data].name,
        department: result[data].department
      }
      this.ELEMENT_DATA.push(student);
      position++;
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.spinner = false
  }

  form = this.fb.group({
    regno: this.fb.control(''),
    contact: this.fb.control('', [
      Validators.required,
    ]),
    email: this.fb.control('', [
      Validators.required,
      Validators.email
    ]),
    address: this.fb.control('', [
      Validators.required,
    ]),
  });

  get regno() {
    return this.form.get('regno');
  }
  get password() {
    return this.form.get('password');
  }
  get name() {
    return this.form.get('name');
  }
  get batch() {
    return this.form.get('batch');
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
  get semester() {
    return this.form.get('semester');
  }
  get formcourses() {
    return this.form.get('formcourses');
  }

  openEdit(content, id) {

    this.studentservice.getStudentById(id).subscribe(result => {
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
    this.studentservice.getStudentById(id).subscribe(
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
    this.studentData = data[0];
    this.studentData.contact = 0 + "" + this.studentData.contact;
    this.studentData.joining_date = this.studentData.joining_date.slice(0, 10);
    this.form.patchValue({
      regno: this.studentData.registration_number
    })
  }

  populateDetails(data) {
    this.studentData = data[0];
    this.studentData.contact = 0 + "" + this.studentData.contact;
    this.studentData.joining_date = this.studentData.joining_date.slice(0, 10);
    let coursesToPush = []
    for (let index in data[0].courses) {
      let course = data[0].courses[index].course_name;
      coursesToPush.push(course);
    }
    this.studentData.courses = coursesToPush;
  }

  updateStudent(data) {
    this.modalService.dismissAll()
    this.message = "Updating student..."
    this.spinner = true
    this.studentservice.updateStudent(data)
      .subscribe(result => {
        if (result) {
          this.spinner = false
          this.toastr.success('Successfully Updated Student!', "", {
            positionClass: "toast-top-center"
          })
        }
        else {
        }
      })
  }

  getCoursesControls(): AbstractControl[] {
    return (<FormArray>this.form.get('courses')).controls;
  }


  deleteStudent(id, index) {
    this.message = "Deleting student..."
    this.spinner = true
    this.studentservice.deleteStudent(id)
      .subscribe(result => {
        if (result) {
          this.spinner = false
          this.dataSource.data.splice(index, 1)
          this.dataSource._updateChangeSubscription()
          this.toastr.success('Successfully Deleted Student!', "", {
            positionClass: "toast-top-center"
          })
        }
      },
        err => {
        })
  }

  emptyDataFields() {
    this.form.reset()
    this.studentData = {
      registration_number: '',
      name: '',
      contact: '',
      email: '',
      password: '',
      batch: '',
      address: '',
      department: '',
      joining_date: '',
      semester: '',
      courses: []
    };

  }

}

