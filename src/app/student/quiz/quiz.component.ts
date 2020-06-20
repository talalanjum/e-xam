import { CourseshareService } from 'src/app/services/student-services/courseshare.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  quiz: any;
  quizDataArray
  currentData: any;
  selectedDataIndex: number;
  disableNext: boolean;
  disablePrev: boolean;
  quizTimer = '2020-05-26 15:21:00';
  constructor(
    private courseshare: CourseshareService
  ) { }

  ngOnInit() {
    this.quiz = this.courseshare.getQuiz()
    this.quizDataArray = [
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
    this.currentData = this.quizDataArray[0];
    this.selectedDataIndex = 0;
    this.disablePrev = true;
  }

  prevDiv() {
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

  changeQuestion(questionNumber){
    let index = 0
    for(let question of this.quizDataArray){
      if(question.number==questionNumber){
        this.currentData = question
        this.selectedDataIndex = index
        console.log(this.selectedDataIndex)
        this.checkNavigation()
        break;
      }
      index++
    }
  }

  checkNavigation(){
    if(this.selectedDataIndex == 0){
      this.disablePrev = true;
      this.disableNext = false;
    }
    else if(this.selectedDataIndex == this.quizDataArray.length - 1){
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
