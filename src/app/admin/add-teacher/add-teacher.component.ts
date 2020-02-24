import { TeacherService } from './../../services/admin-services/teacher.service';
import { GetDataService } from './../../services/get-data.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { PasswordValidators } from 'src/app/validators/password.validators';
import { ContactValidators } from 'src/app/validators/contact.validators';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.scss']
})
export class AddTeacherComponent implements OnInit {

  departments = [];
  courseArray = [];
  constructor(
    private GetDataService: GetDataService,
    private teacherService: TeacherService,
  ) { }

  form = new FormGroup({
    user_id: new FormControl('', [
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.required,
      PasswordValidators.cannotContainSpace,
      Validators.minLength(8),
    ]),
    name: new FormControl('', [
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
    courses: new FormArray([]),
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

  ngOnInit() {
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
        if(result){
          console.log(result);
          for (let data in result) {
            this.courseArray.push(result[data].title);
          }
        }
      }
    );
  }

  addTeacher(data){
    this.teacherService.addTeacher(data).subscribe(
      result=>{
        console.log(result);
      }
    )
  }

  oncheckchange(event){
    var formArray : FormArray = this.courses as FormArray;
    if(event.checked){
      formArray.push(new FormControl(event.source.value));
    }
    else{
      formArray.controls.forEach((ctrl: FormControl)=>{
        let index = formArray.controls.indexOf(ctrl);
        if(ctrl.value == event.source.value){
          formArray.removeAt(index);
          return;
        }
      });
    }
  }


}


