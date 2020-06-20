import { Component, OnInit } from '@angular/core';
import { CourseshareService } from 'src/app/services/student-services/courseshare.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {

  exam: any;
  examDataArray
  currentData: any;
  selectedDataIndex: number;
  disableNext: boolean;
  disablePrev: boolean;
  examTimer = '2020-05-26 15:21:00';
  constructor(
    private courseshare: CourseshareService,
    private router: Router
  ) { }

  ngOnInit() {
    this.courseshare.currentData.subscribe(
      result=>{
        console.log(result)
        this.exam = result
      }
    )
    this.examDataArray = [
      {
        number: "1",
        question: "What is your name?",
        type: "mcq",
        choices: ["a", "b", "c"],
        answer: ""
      },
      {
        number: "2",
        question: "What is your father's name?",
        type: "trueFalse",
        choices: ["true", "false"],
        answer: ""
      },
      {
        number: "3",
        question: "What is your mother's name?",
        type: "question/Answer",
        choices: [],
        answer: ""

      }
    ];
    this.currentData = this.examDataArray[0];
    this.selectedDataIndex = 0;
    this.disablePrev = true;
  }

  prevDiv() {
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
    let index = 0
    for (let question of this.examDataArray) {
      if (question.number == questionNumber) {
        this.currentData = question
        this.selectedDataIndex = index
        console.log(this.selectedDataIndex)
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

  timerEnd(){
    console.log("timer ended")
    // this.router.navigate(['/student/course_menu/list'])
  }
}


