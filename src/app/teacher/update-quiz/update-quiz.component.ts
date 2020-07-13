import { ToastrService } from 'ngx-toastr';
import { CourseshareService } from 'src/app/services/teacher-services/courseshare.service';
import { QuestionService } from 'src/app/services/teacher-services/question.service';
import { QuizService } from './../../services/teacher-services/quiz.service';
import { QuizshareService } from './../../services/teacher-services/quizshare.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-quiz',
  templateUrl: './update-quiz.component.html',
  styleUrls: ['./update-quiz.component.scss']
})
export class UpdateQuizComponent implements OnInit {

  constructor(
    private quizshare: QuizshareService,
    private quizService: QuizService,
    private questionService: QuestionService,
    private courseshare: CourseshareService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  quizData
  teacher
  courseData
  step = 1
  message
  spinner
  clotoggled
  classtoggled
  startrender
  date
  form = new FormGroup({
    quiz_id: new FormControl('', Validators.required),
    _id: new FormControl('', Validators.required),// not needed yaar y u mekdis
    course_id: new FormControl(''),
    class_id: new FormArray([], Validators.required),
    clo: new FormArray([], Validators.required),
    questions: new FormArray([], Validators.required),
    uploaded_by: new FormControl(''),
    key: new FormControl('', Validators.required),
    datetime: new FormControl('', Validators.required),
    duration: new FormControl('', Validators.required),
  })

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
  get duration() {
    return this.form.get('duration')
  }
  get datetime() {
    return this.form.get('datetime')
  }

  ngOnInit() {
    this.teacher = localStorage.getItem('token')
    this.courseshare.currentData.subscribe(
      result => {
        this.courseData = result
      }
    )
    this.quizshare.currentData.subscribe(
      result => {
        this.quizData = result
      }
    )
    if (this.quizData != "default" && this.quizData!=null) {
      for (let index in this.quizData.questions) {
        this.questionService.getQuestion(this.quizData.questions[index].id).subscribe(
          result => {
            this.quizData.questions[index] = {
              question: result,
              marks: this.quizData.questions[index].marks
            }
          }
        )
      }
      this.date = new Date(this.quizData.datetime)
      this.form.patchValue({
        quiz_id: this.quizData.quiz_id,
        _id: this.quizData._id,
        course_id: this.courseData.course_code,
        uploaded_by: this.teacher,
        key: this.quizData.key,
        duration: this.quizData.duration,
        datetime: this.date
      })
      for (let clo of this.quizData.CLO) {
        this.clo.push(new FormControl(clo))
      }
      for (let cls of this.quizData.class_id) {
        this.class_id.push(new FormControl(cls))
      }
    }
  }

  toggleMarksStep(question, marks) {
    this.step++
    this.questions.push(
      new FormGroup({
        id: new FormControl(question.question._id),
        marks: new FormControl(marks)
      })
    )
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

  updateQuiz(data: NgForm) {
    this.message = "Updating Quiz..."
    this.spinner = true
    this.quizService.updateQuiz(data).subscribe(
      result=>{
        if(result){
          this.spinner = false
          this.toastr.success('Successfully Updated Quiz!', "" , {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['/teacher/course_menu/course'])
        }
      }
    )
  }

}
