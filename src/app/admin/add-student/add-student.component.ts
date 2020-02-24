import { Router } from '@angular/router';
import { StudentServiceService } from './../../services/student-service.service';
import { GetDataService } from './../../services/get-data.service';
import { ContactValidators } from './../../validators/contact.validators';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
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
  
  user = localStorage.getItem('token');
  checked: boolean = false;
  dataposted: boolean = false;
  private batches: any = [];
  private departments: any = [];
  private courses: any = [];

  ngOnInit() {
    this.GetDataService.getBatches().subscribe(
      result => {
        if (result) {
          console.log("gettingresult");
          for (let data in result) {
            this.batches.push(result[data].name);
          }
          console.log(this.batches);
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
    
    this.GetDataService.getCourses().subscribe(
      result => {
        if(result){
          console.log(result);
          for (let data in result) {
            this.courses.push(result[data].title);
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
  get formcourses(){
    return this.form.get('formcourses');
  }
 
  addStudent(value) {
    console.log(value);
    this.studentService.addStudents(value).subscribe(res => {
      if(res){
        this.dataposted = true;
      }
      else{
        this.dataposted=false;
      }
    });
  }

  oncheckchange(event){
    var formArray : FormArray = this.formcourses as FormArray;
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
