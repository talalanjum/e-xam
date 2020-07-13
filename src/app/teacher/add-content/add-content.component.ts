import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CourseshareService } from './../../services/teacher-services/courseshare.service';
import { ContentService } from 'src/app/services/teacher-services/content.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.scss']
})
export class AddContentComponent implements OnInit {

  form: FormGroup
  spinner: boolean = false;
  message

  get mapping_CLO(){
    return this.form.get('mapping_CLO')
  }
  get content(){
    return this.form.get('content')
  }
  get description(){
    return this.form.get('description')
  }
  get class_name_uploaded_for(){
    return this.form.get('class_name_uploaded_for') as FormArray
  }
  get course_code(){
    return this.form.get('course_code')
  }
  get uploaded_by(){
    return this.form.get('uploaded_by')
  }
  get topic(){
    return this.form.get('topic')
  }

  constructor(
    private contentservice: ContentService,
    private courseshare: CourseshareService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  teacher
  coursedata
  fileName
  file
  img
  ngOnInit() {
    this.courseshare.currentData.subscribe(
      res=>{
        this.coursedata = res 
      }
    )
    this.teacher = localStorage.getItem('token')
    this.form = new FormGroup({
      mapping_CLO: new FormControl('' , Validators.required),
      class_name_uploaded_for: new FormArray([], Validators.required),
      content: new FormControl(null, Validators.required),
      description: new FormControl('', Validators.required),
      course_code: new FormControl(this.coursedata.course_code),
      uploaded_by: new FormControl(this.teacher),
      topic: new FormControl('', Validators.required)
    })
  }

  oncheckchange(event){
    if(event.checked){
      this.class_name_uploaded_for.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for(let control of this.class_name_uploaded_for.controls){
        if(control.value==event.source.value){
          this.class_name_uploaded_for.removeAt(this.class_name_uploaded_for.controls.indexOf(control))
        }
      }
    }
  }

  public onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      let fileList = event.target.files
      this.file = fileList[0]
      this.form.patchValue({
        content: this.file.name
      })
    }
  }

  addContent(){
    this.message = "Adding Content..."
    this.spinner = true
    let form = new FormData()
    form.set('course_code', this.coursedata.course_code)
    form.set('uploaded_by', this.teacher)
    form.set('class_name_uploaded_for', this.class_name_uploaded_for.value)
    form.set('mapping_CLO', this.mapping_CLO.value)
    form.set('description', this.description.value)
    form.set('content', this.file, this.file.name)
    form.set('topic', this.topic.value)
    this.contentservice.addContent(form).subscribe(
      result=>{ 
        if(result){
          this.spinner = false
          this.toastr.success('Successfully Added Content!', "", {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['/teacher/course_menu/course'])
        }
      }
    )
  }

}
