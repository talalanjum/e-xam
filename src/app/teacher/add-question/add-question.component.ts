import { QuestionService } from './../../services/teacher-services/question.service';
import { FormGroup, FormArray, FormControl, Validators, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CourseshareService } from 'src/app/services/teacher-services/courseshare.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss']
})
export class AddQuestionComponent implements OnInit {

  constructor(
    private courseshare: CourseshareService,
    private questionservice: QuestionService
  ) { }
  selectedtype
  coursedata
  teacher

  form: FormGroup

  get options(){
    return this.form.get('options') as FormArray
  }
  get keywords(){
    return this.form.get('keywords') as FormArray
  }
  ngOnInit() {
    this.courseshare.currentData.subscribe(
      res=>{
        this.coursedata = res 
      }
    )
    this.teacher = localStorage.getItem('token')
    this.form = new FormGroup({
      course_code: new FormControl(this.coursedata.course_code),
      uploaded_by: new FormControl(this.teacher),
      topic: new FormControl('', Validators.required),
      mapping_CLO: new FormControl('', Validators.required),
      question_text: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      answer: new FormControl('', Validators.required),
      options: new FormArray([]),
      keywords: new FormArray([])
    })
  }

  typechange(event){
    this.selectedtype = event.target.value
    this.options.clear()
    this.keywords.clear()
  }

  addOption(addoption){
    this.options.push(
      new FormControl('', Validators.required)
    )
  }

  removeOption(option){
    let index = this.options.controls.indexOf(option)
    this.options.removeAt(index)
  }

  addKeyword(event){
    this.keywords.push(
      new FormControl(event.target.value, Validators.required)
    )
    event.target.value = '';
  }

  removeKeywprd(keyword){
    let index = this.keywords.controls.indexOf(keyword)
    this.keywords.removeAt(index)
  }



  addQuestion(form:NgForm){
    this.questionservice.addQuestion(form).subscribe(
      result=>{ 
        console.log(result);
      }
    )
  }
}
