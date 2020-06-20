import { Router } from '@angular/router';
import { StudentServiceService } from './../../services/student-service.service';
import { GetDataService } from './../../services/get-data.service';
import { ContactValidators } from './../../validators/contact.validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, Form, NgForm } from '@angular/forms';
import { UsernameValidators } from 'src/app/validators/username.validators';
import { PasswordValidators } from 'src/app/validators/password.validators';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.scss']
})
export class AddStudentComponent implements OnInit {


  constructor(
    private GetDataService: GetDataService,
    private studentService: StudentServiceService,
    private router: Router) { }

  hidden = true
  selectedindex = 0
  user = localStorage.getItem('token');
  checked: boolean = false;
  dataposted: boolean = false;
  private batches: any = [];
  private departments: any = [];
  private courses: any = [];

  ngOnInit() {
    if (this.tempclasses.at(this.selectedindex)) { 
    } 
    this.GetDataService.getBatches().subscribe(
      result => {
        if (result) {
          for (let data in result) {
            this.batches.push(result[data].name);
          }
        }
      }
    );

    this.GetDataService.getDepartments().subscribe(
      result => {
        if (result) {
          for (let data in result) {
            this.departments.push(result[data].name);
          }
        }
      }
    );
  }

  form = new FormGroup({
    regno: new FormControl('', [
      Validators.required,
      UsernameValidators.regexmatch
    ]),
    password: new FormControl('', [
      Validators.required,
      PasswordValidators.cannotContainSpace,
      Validators.minLength(8),
    ]),
    name: new FormControl('', [
      Validators.required,
    ]),
    batch: new FormControl('', [
      Validators.required,
    ]),
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
    department: new FormControl('', [
      Validators.required,
    ]),
    joining_date: new FormControl('', [
      Validators.required,
    ]),
    semester: new FormControl('', [
      Validators.required,
    ]),
    formcourses: new FormArray([]),
    class_name: new FormArray([]),
    tempclasses: new FormArray([])
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
  get tempclasses() {
    return this.form.get('tempclasses') as FormArray
  }

  populateCourses() {
    let dept = this.department.value
    this.GetDataService.getCourseofDept(dept).subscribe(
      result => {
        if (result) {
          this.courses = []
          for (let data in result) {
            let course = {
              title: result[data].title,
              course_code: result[data].course_code
            }
            this.courses.push(course);
          }
        }
      }
    )
  }

  addStudent(value: NgForm) { 
    this.studentService.addStudents(value).subscribe(res => {
      if (res) {
        this.dataposted = true; 
      }
      else {
        this.dataposted = false;
      }
    });
  }

  oncheckchange(event, i) {
    this.selectedindex = i
    var formArray: FormArray = this.formcourses as FormArray;
    let classarr = this.form.get('class_name') as FormArray
    if (event.checked) {
      this.hidden = false
      this.GetDataService.getClassesofCourse(event.source.value).subscribe(
        result => {
          formArray.push(new FormControl(event.source.value));
          let temp = this.form.get('tempclasses') as FormArray
          temp.insert(i, new FormArray([]))
          for (let data in result) {
            (temp.at(i) as FormArray).push(new FormControl(result[data]))
          }
        }
      )
    }
    else {
      let courses = this.formcourses as FormArray
      let temp = this.form.get('tempclasses') as FormArray
      for(let ctrl of courses.controls){
        if(ctrl.value == event.source.value){
          let index = courses.controls.indexOf(ctrl)
          courses.removeAt(index)
          temp.removeAt(index)
        }
      } 
    }
  }

  selectchange(event, i) { 
    let classarr = this.form.get('class_name') as FormArray
    if (classarr.at(i)) { 
      classarr.removeAt(i)
      classarr.insert(i, new FormControl(event.target.value)) 
    }
    else {
      classarr.push(new FormControl(event.target.value)) 
    } 
    if (!(classarr.at(i).value == event.target.value)) { 
    }
  }


}
