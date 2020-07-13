import { Router } from '@angular/router';
import { QuestionService } from 'src/app/services/teacher-services/question.service';

import { CourseshareService } from './../../services/teacher-services/courseshare.service';
import { QuestionshareService } from './../../services/teacher-services/questionshare.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit {

  constructor(
    private questionshare: QuestionshareService,
    private courseshare: CourseshareService,
    private questionservice: QuestionService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  coursedata
  questionData
  teacher
  form: FormGroup
  spinner: boolean = false;
  message

  ngOnInit() {
    this.message = "Fetching Data..."
    this.spinner = true
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
    if (this.questionData && this.coursedata) {
      this.teacher = localStorage.getItem('token')
      this.form = new FormGroup({
        id: new FormControl(this.questionData._id),
        topic: new FormControl('', Validators.required),
        mapping_CLO: new FormControl('', Validators.required),
        question_text: new FormControl('', Validators.required),
      })
    }
    this.spinner = false
  }

  editQuestion(form: NgForm) {
    this.message = "Updating Question..."
    this.spinner = true
    this.questionservice.updateQuestion(form).subscribe(
      result => {
        if(result){
          this.spinner = false
          this.toastr.success('Successfully Updated Question!', "", {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['teacher/course_menu/course'])
        }
      }
    )
  }

}
