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

  addQuiz(data){
    return this.http.post(this.url+"teacher/quiz/add", data)
  }

  getQuizzes(class_id, course_id){
    return this.http.get(this.url+"teacher/quiz/all/"+class_id+"/"+course_id)
  }

  deleteQuiz(_id){
    return this.http.delete(this.url+"teacher/quiz/delete/"+_id)
  }

  updateQuiz(data){
    return this.http.patch(this.url+"teacher/quiz/update", data)
  }

  

}

