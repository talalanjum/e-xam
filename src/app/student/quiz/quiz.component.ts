import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { QuizService } from './../../services/student-services/quiz.service';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { QuestionService } from 'src/app/services/teacher-services/question.service';
import { CourseshareService } from 'src/app/services/student-services/courseshare.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  quiz: any;
  quizDataArray = []
  currentData: any;
  selectedDataIndex: number;
  disableNext: boolean;
  disablePrev: boolean;
  closeResult: string;
  spinner: boolean = false;
  message

  quizTimer: any = '2020-05-26 15:21:00';
  constructor(
    private courseshare: CourseshareService,
    private questionservice: QuestionService,
    private router: Router,
    private quizservice: QuizService,
    private modalService: NgbModal,
    private toastr : ToastrService
  ) { }

  ngOnInit() {
    this.message = "Fetching Data..."
    this.spinner = true
    this.quiz = this.courseshare.getQuiz()
    if (this.quiz) {
      let quizDate = new Date(this.quiz.datetime)
      let endDate = new Date(quizDate.getTime() + this.quiz.duration * 60000)
      this.quizTimer = endDate
      for (let index in this.quiz.questions) {
        this.questionservice.getQuestion(this.quiz.questions[index].id).subscribe(
          result => {
            if (result['mcq_options'].length !== 0) {
              let options = []
              for (let option of result['mcq_options']) {
                options.push(option)
              }
              let question = {
                id: this.quiz.questions[index].id,
                number: 0,
                question: result['question_text'],
                type: result['type'],
                choices: options,
                answer: '',
                marks: this.quiz.questions[index].marks
              }
              this.quizDataArray.push(question)
            }
            else {
              let question = {
                id: this.quiz.questions[index].id,
                number: 0,
                question: result['question_text'],
                type: result['type'],
                answer: '',
                marks: this.quiz.questions[index].marks
              }
              this.quizDataArray.push(question)
            }
          }
        )
      }
      setTimeout(() => {
        this.quizDataArray.sort(() => Math.random() - 0.5)
        for (let index in this.quizDataArray) {
          this.quizDataArray[index].number = Number.parseInt(index) + 1
        }
        this.currentData = this.quizDataArray[0];
        this.selectedDataIndex = 0;
        if(this.quizDataArray.length == 1){
          this.disableNext = true
          this.disablePrev = true
        }
        else{
          this.disablePrev = true;
        }
        this.spinner = false
      }, 1000)
    }
  }

  prevDiv() {
    this.quizDataArray[this.selectedDataIndex] = this.currentData
    if (this.quizDataArray.length != 0) {
      this.selectedDataIndex--;
      this.disableNext = false;
      if (this.selectedDataIndex < 0) {
        this.selectedDataIndex = 0;
      }
      if (this.selectedDataIndex == 0) {
        this.disablePrev = true;
        this.disableNext = false;
      }
      this.currentData = this.quizDataArray[this.selectedDataIndex];
    }
  }
  nextDiv() {
    this.quizDataArray[this.selectedDataIndex] = this.currentData
    if (this.quizDataArray.length != 0) {
      this.selectedDataIndex++;
      this.disablePrev = false;
      if (this.selectedDataIndex > this.quizDataArray.length - 1) {
        this.selectedDataIndex = this.quizDataArray.length - 1;

      }
      if (this.selectedDataIndex + 1 == this.quizDataArray.length) {
        this.disableNext = true;
        this.disablePrev = false;
      }
      this.currentData = this.quizDataArray[this.selectedDataIndex];
    }
  }

  changeQuestion(questionNumber) {
    this.quizDataArray[this.selectedDataIndex] = this.currentData
    let index = 0
    for (let question of this.quizDataArray) {
      if (question.number == questionNumber) {
        this.currentData = question
        this.selectedDataIndex = index
        this.checkNavigation()
        break;
      }
      index++
    }
  }

  checkNavigation() {
    if (this.selectedDataIndex == 0) {
      this.disablePrev = true;
      this.disableNext = false;
    }
    else if (this.selectedDataIndex == this.quizDataArray.length - 1) {
      this.disablePrev = false;
      this.disableNext = true
    }
    else {
      this.disableNext = false;
      this.disablePrev = false;
    }
  }
  timerEnd() {
    this.submitExam()
    this.router.navigate(['/student/course_menu/list'])
  }

  openPrompt(modal){
    this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  submitExam() {
    this.modalService.dismissAll()
    this.message = "Submitting Quiz.."
    this.spinner = true
    let submission = []
    for (let quiz of this.quizDataArray) {
      submission.push(
        {
          question_id: quiz.id,
          answer: quiz.answer,
          marks: quiz.marks
        }
      )
    }
    let obj = {
      quiz_id: this.quiz.quiz_id,
      class_id: this.quiz.class_id[0],
      course_id: this.quiz.course_id,
      student_id: localStorage.getItem('token'),
      submission: submission
    }
    this.quizservice.submitQuiz(obj).subscribe(
      result=>{
        if(result){
          this.spinner = false
          this.toastr.success('Successfully Submitted Quiz!', "", {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['/student/course_menu/list'])
        }
      }
    )
  }
}
