import { ToastrService } from 'ngx-toastr';
import { QuizService } from './../../services/teacher-services/quiz.service';
import { QuestionService } from './../../services/teacher-services/question.service';
import { CourseshareService } from './../../services/teacher-services/courseshare.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent implements OnInit {

  constructor(
    private courseshare: CourseshareService,
    private questionservice: QuestionService,
    private quizservice: QuizService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  coursedata
  teacher
  form
  clotoggled
  classtoggled
  questiontoggled
  step = 1;
  ELEMENT_DATA_question = []
  dataSourceQuestion
  displayedColumnsQuestion: string[] = ['select', 'position', 'question_text', 'type', 'topic'];
  selection = new SelectionModel<any>(true, []);
  message = "Adding Quiz..."
  spinner
  selectedQuestions = []

  get clo() {
    return this.form.get('clo') as FormArray
  }
  get class_id() {
    return this.form.get('class_id') as FormArray
  }
  get questions() {
    return this.form.get('questions') as FormArray
  }
  get quiz_id() {
    return this.form.get('quiz_id')
  }
  get key() {
    return this.form.get('key')
  }

  ngOnInit() {
    this.courseshare.currentData.subscribe(
      result => {
        this.coursedata = result
      }
    ).add(
      this.questionservice.getQuestions(this.coursedata.course_code).subscribe(
        result => {
          let position = 1
          for (let data in result) {
            let question = {
              _id: result[data]._id,
              position: position,
              question_text: result[data].question_text,
              type: result[data].type,
              topic: result[data].topic,
              answer: result[data].answer,
              course_code: result[data].course_code,
              mapping_CLO: result[data].mapping_CLO,
              uploaded_by: result[data].uploaded_by,
              mcq_options: result[data].mcq_options,
              keywords: result[data].keywords
            }
            this.ELEMENT_DATA_question.push(question)
            position++
          }
          setTimeout(() => {
            this.dataSourceQuestion = new MatTableDataSource(this.ELEMENT_DATA_question)
          }, 1000)
        }
      )
    )
    this.teacher = localStorage.getItem('token')
    this.form = new FormGroup({
      quiz_id: new FormControl('', [Validators.required]),
      course_id: new FormControl(this.coursedata.course_code),
      class_id: new FormArray([], Validators.required),
      clo: new FormArray([], Validators.required),
      questions: new FormArray([], Validators.required),
      uploaded_by: new FormControl(this.teacher),
      key: new FormControl('', Validators.required)
    })
  }

  onCloCheck(event) {
    this.clotoggled = true
    if (event.checked) {
      this.clo.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for (let control of this.clo.controls) {
        if (control.value == event.source.value) {
          this.clo.removeAt(this.clo.controls.indexOf(control))
        }
      }
    }
  }

  onClassCheck(event) {
    this.classtoggled = true
    if (event.checked) {
      this.class_id.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for (let control of this.class_id.controls) {
        if (control.value == event.source.value) {
          this.class_id.removeAt(this.class_id.controls.indexOf(control))
        }
      }
    }
  }

  toggleQuestion(event, row) {
    this.questiontoggled = true
    if(event){
      this.selection.toggle(row)
    }
    else{ 
      null
    }
    console.log(this.selection.selected)
  }

  addQuiz(data: NgForm) {
    console.log(data)
    this.spinner = true
    this.quizservice.addQuiz(data).subscribe(
      result => {
        if (result) {
          this.spinner = false
          this.toastr.info(
            '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">Successfully Added Quiz</span>',
            "",
            {
              closeButton: true,
              enableHtml: true,
              toastClass: "alert alert-success alert-with-icon",
              positionClass: "toast-top-center"
            }
          );
          this.router.navigate(['/teacher/course_menu/course'])
        }
      }
    )
  }

  toggleSelectStep() {
    this.step++
    for(let obj of this.selection.selected){
      this.selectedQuestions.push(obj)
    }
  }

  toggleMarksStep(question, marks) {
    this.questions.push(
      new FormControl({
        id: question._id,
        marks: marks
      })
    )
    this.step++
  }

}
