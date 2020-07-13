import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private url = "https://e-xam.herokuapp.com/";

  constructor(
    private http: HttpClient
  ) { }

  addQuestion(data){
    return this.http.post(this.url+"teacher/question/add", data)
  }

  getQuestions(course_code){
    return this.http.get(this.url+"teacher/questions/"+course_code)
  }

  deleteQuestion(_id){
    return this.http.delete(this.url+"teacher/question/remove/"+_id)
  }

  updateQuestion(data){
    return this.http.patch(this.url+"teacher/question/update", data)
  }

  getQuestion(id){
    return this.http.get(this.url+"teacher/question/view/"+id)
  }
}
