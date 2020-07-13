import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private url = "https://e-xam.herokuapp.com/";

  constructor(
    private http: HttpClient
  ) { }

  getExams(class_id, course_id){
    return this.http.get(this.url+"student/exams/all/"+course_id+"/"+class_id)
  }

  getExam(exam_id){
    return this.http.get(this.url+"student/exam/"+exam_id)
  }

  submitExam(data){
    return this.http.post(this.url+"student/exam/submit", data)
  }
}
