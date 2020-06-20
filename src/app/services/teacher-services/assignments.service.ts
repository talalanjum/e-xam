import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  url = "https://e-xam.herokuapp.com/"

  constructor(
    private http: HttpClient
  ) { }

  addAssignment(data) {
    return this.http.post(this.url + "teacher/assignment/upload", data)
  }

  getAssignments(course_code, user_id, class_name) {
    return this.http.get(this.url + "teacher/assignments/" + course_code + "/" + user_id + "/" + class_name)
  }

  deleteAssignment(assignment_id){
    return this.http.delete(this.url+"teacher/assignment/delete/"+assignment_id)
  }

  getAssignment(assignment_id){
    return this.http.get(this.url+"teacher/assignment/"+assignment_id)
  }

  downloadAssignment(course_code, assignment_id){
    return this.http.get(this.url+"teacher/assignment/download/"+course_code+"/"+assignment_id, {responseType: 'blob'})
  }

  updateAssignment(data){
    return this.http.post(this.url+"teacher/assignment/update", data)
  }
}
