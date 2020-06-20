import { TeacherService } from './../../services/admin-services/teacher.service';
import { GetDataService } from './../../services/get-data.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray, AbstractControl } from '@angular/forms';
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
  selectedindex
  hidden = false;
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
    courses: new FormArray([], Validators.required),
    courseclasses: new FormArray([])
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
  get courses() {
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
  }

  populateCourses() {
    let dept = this.department.value
    this.GetDataService.getCourseofDept(dept).subscribe(
      result => {
        if (result) {
          this.courseArray = []
          this.form.get('courseclasses').reset()
          for (let data in result) {
            let course = {
              title: result[data].title,
              course_code: result[data].course_code
            }
            this.courseArray.push(course);
          }
        }
      }
    )
  }

  addTeacher(data) { 
    this.teacherService.addTeacher(data).subscribe(
      result => { 
      }
    )
  }

  oncheckchange(event, i) { 
    this.selectedindex = i
    var formArray: FormArray = this.courses as FormArray; 
    if (event.checked) { 
        this.GetDataService.getClassesofCourse(event.source.value).subscribe(
          result => {
            let courseclass = this.form.get('courseclasses') as FormArray
            let course = []
            for (let crs in result) {
              course.push(result[crs])
            }
            courseclass.push(
              new FormGroup({
                course_code: new FormControl(event.source.value, []),
                class_name: new FormControl(course, [])
              })
            )
          }
        )
      // }
    }
    else {
      let courseclass = this.form.get('courseclasses') as FormArray 
      let i = 0
      for (let control of courseclass.controls) {
        if (control.value.course_code == event.source.value) {
          courseclass.removeAt(i)
          break;
        }
        i++
      }
      let courses = this.courses as FormArray
      for (let control of courses.controls){
        if(control.get('course_code').value == event.source.value){
          courses.removeAt(courses.controls.indexOf(control))
        }
      }
    }
  }

  onclasschange(event, coursecode) {
    let formArray: FormArray = this.courses as FormArray
    let exists = false
    if (event.checked) {
      if (formArray.length > 0) {
        for (let control of formArray.controls) {
          if(control.get('course_code').value == coursecode){
            let classes = control.get('class_name') as FormArray
            let ctrl = new FormControl(event.source.value)
            classes.push(ctrl)
            exists=true
          }
        }
        if(!exists){
          let grp = new FormGroup({
            course_code: new FormControl(coursecode),
            class_name: new FormArray([
              new FormControl(event.source.value)
            ])
          })
          formArray.push(grp)
        }
      }
      else {
        let grp = new FormGroup({
          course_code: new FormControl(coursecode),
          class_name: new FormArray([
            new FormControl(event.source.value)
          ])
        })
        formArray.push(grp)
      }
    }
    else {
      for(let control of formArray.controls){
        if(control.get('course_code').value==coursecode){
          let classes = control.get('class_name') as FormArray
          for(let cls of classes.controls){
            if(cls.value == event.source.value){
              classes.removeAt(classes.controls.indexOf(cls))
            }
          }
          if(classes.length==0){
            formArray.removeAt(formArray.controls.indexOf(control))
          }
        }
      }
    }

  }



}


