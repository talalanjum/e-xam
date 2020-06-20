import { GetDataService } from './../../services/get-data.service';
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
    private courseService: CourseService,
    private getdataservice: GetDataService
  ) { }
  
  departments = []
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
    this.getdataservice.getDepartments().subscribe(
      result=>{
        for(let data in result){
          this.departments.push(result[data].name)
        }
      }
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
    class_name: new FormArray([]),
    department: new FormArray([])
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
  get department(): FormArray{
    return this.form.get('department') as FormArray
  }

  addCLO(clo : HTMLInputElement){
    this.CLOs.push(
      new FormControl('', Validators.required)
      // new FormGroup({
      //   clo: new FormControl('' ,Validators.required)
      // })
    ) 

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
    this.courseService.addCourse(data).subscribe(
      result=>{ 
      }
    )
    this.courseService.getCourses().subscribe(
      result=>{ 
      }
    ) 
  }

  oncheckchange(event){
    var formArray : FormArray = this.department as FormArray;
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
