import { CourseService } from './../../services/admin-services/course.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, Form } from '@angular/forms';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {

  forminvalid: boolean
  constructor(
    private courseService: CourseService
  ) { }

  ngOnInit() {
    this.CLOs.push(
      new FormControl('' ,Validators.required)
      // new FormGroup({
      //   clo: new FormControl('' ,Validators.required)
      // })
    )
    this.class.push(
      new FormControl('' ,Validators.required)
      // new FormGroup({
      //   cls: new FormControl('' ,Validators.required)
      // })
    )
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

  addCLO(clo : HTMLInputElement){
    this.CLOs.push(
      new FormControl('', Validators.required)
      // new FormGroup({
      //   clo: new FormControl('' ,Validators.required)
      // })
    )
    console.log(this.CLOs.controls)

  }

  removeCLO(clo: FormControl){
    let index = this.CLOs.controls.indexOf(clo)
    this.CLOs.removeAt(index)
  }

  addClass(inputclass: HTMLInputElement){
    this.class.push(
      new FormControl('', Validators.required)
      // new FormGroup({
      //   cls: new FormControl('', Validators.required)
      // })
    )
  }

  removeClass(cls: FormControl){
    let index = this.class.controls.indexOf(cls)
    this.class.removeAt(index)
  }

  addCourse(data){
    console.log(data)
    this.courseService.addCourse(data).subscribe(
      result=>{
        console.log(result)
      }
    )
    this.courseService.getCourses().subscribe(
      result=>{
        console.log(result)
      }
    ) 
  }
}
