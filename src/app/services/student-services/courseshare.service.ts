import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseshareService {

  quizSelected: any; 
  examSelected: any; 

  constructor() { }

  private dataSource = new BehaviorSubject<any>("default");
  currentData = this.dataSource.asObservable();


  changeData(data: string) {
    this.dataSource.next(data)
  }

  setQuiz(quiz){
    this.quizSelected = quiz;
  }
  getQuiz(){
    return this.quizSelected; 
  }
  setExam(exam){
    this.examSelected = exam;
  }
  getExam(){
    return this.examSelected; 
  }
}
