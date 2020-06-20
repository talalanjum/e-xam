import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  url = "https://e-xam.herokuapp.com/"

  constructor(
    private http: HttpClient
  ) { }

  getAssignments(course_code, class_name){
    return this.http.get(this.url+"student/assignments/"+course_code+"/"+class_name)
  }

}
