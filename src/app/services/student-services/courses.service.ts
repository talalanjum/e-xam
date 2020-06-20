import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentCoursesService {

  private url = "https://e-xam.herokuapp.com/";
  student
  constructor(
    private http: HttpClient
  ) { }

  getCourses() {
    this.setUser()
    return this.http.get(this.url + "student/courses/" + this.student)
  }

  setUser() {
    this.student = localStorage.getItem('token')
  }
}
