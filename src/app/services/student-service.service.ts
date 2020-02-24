import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {
  private url = "https://e-xam.herokuapp.com/";
  constructor(private http: HttpClient) { }

  addStudents(data){
    return this.http.post(this.url+"admin/insert_student", data, {headers:{'Content-Type':'application/json'}});
  }

  getBatchStudents(batch){
    return this.http.get(this.url+"admin/student/search_batch/"+batch);
  }

  getStudentById(id){
    return this.http.get(this.url+"admin/student/search_reg/"+id);
  }

  updateStudent(data){
    return this.http.post(this.url+"admin/student/update/", data);
  }

  deleteStudent(id){
    return this.http.delete(this.url+"admin/student/remove/"+id);
  }

  getStudents(){
    return this.http.get(this.url+"admin/view_students")
  }
}
