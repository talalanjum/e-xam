import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeacherCourseService {
  private url = "https://e-xam.herokuapp.com/";
  teacher 
  constructor(
    private http:HttpClient
  ) { }

  getCourses(){
    this.setUser()
    return this.http.get(this.url+"teacher/courses/"+this.teacher)
  }

  setUser(){
    this.teacher = localStorage.getItem('token')
  }


}
