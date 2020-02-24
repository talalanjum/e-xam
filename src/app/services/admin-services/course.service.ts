import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private url = "https://e-xam.herokuapp.com/";

  constructor(
    private http: HttpClient
  ) { }

  addCourse(data) {
    return this.http.post(this.url + "admin/course/add", data)
  }

  getCourses(){
    return this.http.get(this.url + "admin/courses/all")
  }

  getCourseCode(id) {
    return this.http.get(this.url + "admin/course/code/" + id)
  }

  getCourseTitle(id) {
    return this.http.get(this.url + "admin/course/title/" + id)
  }

  deleteCourse(data) {
    return this.http.post(this.url + "admin/course/del", data)

  }

  updateCourse(data) {
    return this.http.post(this.url + "admin/course/update", data)

  }
}
