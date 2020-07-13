import { ToastrService } from 'ngx-toastr';
import { ExamService } from './../../services/student-services/exam.service';
import { Component, OnInit } from '@angular/core';
import { CourseshareService } from 'src/app/services/student-services/courseshare.service';
import { Router } from '@angular/router';
import { QuestionService } from 'src/app/services/teacher-services/question.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  exam: any;
  examDataArray = []
  currentData: any;
  selectedDataIndex: number;
  disableNext: boolean;
  disablePrev: boolean;
  closeResult: string;
  spinner: boolean = false;
  message

  examTimer: any = '2020-05-26 15:21:00';
  constructor(
    private courseshare: CourseshareService,
    private questionservice: QuestionService,
    private router: Router,
    private examservice: ExamService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.message = "Fetching Data..."
    this.spinner = true
    this.exam = this.courseshare.getExam()
    if (this.exam) {
      let examDate = new Date(this.exam.datetime)
      let endDate = new Date(examDate.getTime() + this.exam.duration * 60000)
      this.examTimer = endDate
      for (let index in this.exam.questions) {
        this.questionservice.getQuestion(this.exam.questions[index].id).subscribe(
          result => {
            if (result['mcq_options'].length !== 0) {
              let options = []
              for (let option of result['mcq_options']) {
                options.push(option)
              }
              let question = {
                id: this.exam.questions[index].id,
                number: 0,
                question: result['question_text'],
                type: result['type'],
                choices: options,
                answer: '',
                marks: this.exam.questions[index].marks
              }
              this.examDataArray.push(question)
            }
            else {
              let question = {
                id: this.exam.questions[index].id,
                number: 0,
                question: result['question_text'],
                type: result['type'],
                answer: '',
                marks: this.exam.questions[index].marks
              }
              this.examDataArray.push(question)
            }
          }
        )
      }
      setTimeout(() => {
        this.examDataArray.sort(() => Math.random() - 0.5)
        for (let index in this.examDataArray) {
          this.examDataArray[index].number = Number.parseInt(index) + 1
        }
        this.currentData = this.examDataArray[0];
        this.selectedDataIndex = 0;
        if(this.examDataArray.length == 1){
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
    this.examDataArray[this.selectedDataIndex] = this.currentData
    if (this.examDataArray.length != 0) {
      this.selectedDataIndex--;
      this.disableNext = false;
      if (this.selectedDataIndex < 0) {
        this.selectedDataIndex = 0;
      }
      if (this.selectedDataIndex == 0) {
        this.disablePrev = true;
        this.disableNext = false;
      }
      this.currentData = this.examDataArray[this.selectedDataIndex];
    }
  }
  nextDiv() {
    this.examDataArray[this.selectedDataIndex] = this.currentData
    if (this.examDataArray.length != 0) {
      this.selectedDataIndex++;
      this.disablePrev = false;
      if (this.selectedDataIndex > this.examDataArray.length - 1) {
        this.selectedDataIndex = this.examDataArray.length - 1;

      }
      if (this.selectedDataIndex + 1 == this.examDataArray.length) {
        this.disableNext = true;
        this.disablePrev = false;
      }
      this.currentData = this.examDataArray[this.selectedDataIndex];
    }
  }

  changeQuestion(questionNumber) {
    this.examDataArray[this.selectedDataIndex] = this.currentData
    let index = 0
    for (let question of this.examDataArray) {
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
    else if (this.selectedDataIndex == this.examDataArray.length - 1) {
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
    this.message = "Submitting Exam..."
    this.spinner = true
    let submission = []
    for (let exam of this.examDataArray) {
      submission.push(
        {
          question_id: exam.id,
          answer: exam.answer,
          marks: exam.marks
        }
      )
    }
    let obj = {
      exam_id: this.exam.exam_id,
      class_id: this.exam.class_id[0],
      course_id: this.exam.course_id,
      student_id: localStorage.getItem('token'),
      submission: submission
    }
    this.examservice.submitExam(obj).subscribe(
      result=>{
        if(result){
          this.spinner = false
          this.toastr.success('Successfully Submitted Exam!', "", {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['/student/course_menu/list'])
        }
      }
    )
  }
}


