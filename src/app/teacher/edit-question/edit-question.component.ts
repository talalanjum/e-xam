import { QuestionService } from 'src/app/services/teacher-services/question.service';

import { CourseshareService } from './../../services/teacher-services/courseshare.service';
import { QuestionshareService } from './../../services/teacher-services/questionshare.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {

  constructor(
    private questionshare: QuestionshareService,
    private courseshare: CourseshareService,
    private questionservice: QuestionService
  ) { }

  coursedata
  questionData
  teacher
  form: FormGroup

  ngOnInit() {
    this.questionshare.currentData.subscribe(
      result => {
        this.questionData = result
      }
    )
    this.courseshare.currentData.subscribe(
      result => {
        this.coursedata = result
      }
    )
    this.teacher = localStorage.getItem('token')
    this.form = new FormGroup({
      id: new FormControl(this.questionData._id),
      topic: new FormControl('', Validators.required),
      mapping_CLO: new FormControl('', Validators.required),
      question_text: new FormControl('', Validators.required),
    })
  }

  editQuestion(form: NgForm) {
    console.log(form)
    this.questionservice.updateQuestion(form).subscribe(
      result => {
        console.log(result);
      }
    )
  }

}
