import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  
  private url = "https://e-xam.herokuapp.com/";

  constructor(
    private http: HttpClient
  ) { }

  getQuizzes(class_id, course_id){
    return this.http.get(this.url+"student/quiz/"+class_id+"/"+course_id)
  }

  getQuiz(quiz_id){
    return this.http.get(this.url+"student/quiz/"+quiz_id)
  }

  getQuizSubmissions(course_id, class_id){
    return this.http.get(this.url+"student/quiz/attempted/"+course_id+"/"+class_id)
  }

  submitQuiz(data){
    return this.http.post(this.url+"student/quiz/submit", data)
  }
}
