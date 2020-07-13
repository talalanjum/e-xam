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

  addExam(data) {
    return this.http.post(this.url + "teacher/exam/add", data)
  }

  getExams(class_id, course_id) {
    return this.http.get(this.url + "teacher/exams/all/" + class_id + "/" + course_id)
  }

  deleteExam(_id) {
    return this.http.delete(this.url + "teacher/exam/delete/" + _id)
  }

  updateExam(data) {
    return this.http.patch(this.url + "teacher/exam/update", data)
  }
}
