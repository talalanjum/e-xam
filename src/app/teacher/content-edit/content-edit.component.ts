import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, NgForm } from '@angular/forms';
import { ContentshareService } from './../../services/teacher-services/contentshare.service';
import { CourseshareService } from './../../services/teacher-services/courseshare.service';
import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/teacher-services/content.service';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html',
  styleUrls: ['./content-edit.component.scss']
})
export class ContentEditComponent implements OnInit {

  constructor(
    private courseshare: CourseshareService,
    private contentshare: ContentshareService,
    private contentservice: ContentService,
    private router: Router
  ) { }


  coursedata
  content
  form: FormGroup
  teacher
  classes = []
  contentdata = {
    topic: '',
    description: '',
    mapping_CLO: ''
  }

  get mapping_CLO() {
    return this.form.get('mapping_CLO')
  }
  get description() {
    return this.form.get('description')
  }
  get class_name_uploaded_for() {
    return this.form.get('class_name_uploaded_for') as FormArray
  }
  get content_id() {
    return this.form.get('content_id')
  }
  get topic() {
    return this.form.get('topic')
  }

  ngOnInit() {
    this.courseshare.currentData.subscribe(res => { this.coursedata = res })

    this.contentshare.currentId.subscribe(res => { this.content = res })

    this.teacher = localStorage.getItem('token')
    this.form = new FormGroup({
      mapping_CLO: new FormControl('', Validators.required),
      class_name_uploaded_for: new FormArray([], Validators.required),
      description: new FormControl('', Validators.required),
      topic: new FormControl('', Validators.required),
      content_id: new FormControl(this.content.content_id)
    }) 

    this.contentservice.getContent(this.coursedata.course_code, this.teacher, this.content.classes[0]).subscribe(
      result => { 
        let classchecked
        for (let cls of this.coursedata.classes) {
          for (let CLS of result[0]['class_name_uploaded_for']) {
            if(cls==CLS){
              classchecked = true
              break
            }
            else{
              classchecked = false
            }
          }
          this.classes.push({
            name: cls,
            checked: classchecked
          })
        }
        for(let cls of this.classes){
          if(cls.checked){
            this.class_name_uploaded_for.push(
              new FormControl(cls.name)
            )
          }
        }
        this.contentdata = {
          topic: result[0]['topic'],
          description: result[0]['description'],
          mapping_CLO: result[0]['mapping_CLO']
        }
      }
    )
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

  updateContent(data:NgForm){ 
    this.contentservice.updateContent(data).subscribe(
      result=>{ 
        this.router.navigate(['teacher/course_menu/course'])
      }
    )
  }



}
