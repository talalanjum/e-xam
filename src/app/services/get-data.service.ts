import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetDataService {
  private url = "https://e-xam.herokuapp.com/";
  constructor(private http: HttpClient) { }

  getBatches(){
    return this.http.get(this.url+"admin/batches/all");
  }
  getDepartments(){
    return this.http.get(this.url+"admin/departments/all");
  }
  getCourses(){
    return this.http.get(this.url+"admin/courses/all");
  }

  getCourseofDept(dept){
    return this.http.get(this.url+"admin/course/department/"+dept)
  }

  getClassesofCourse(course){
    return this.http.get(this.url+"admin/course/classes/"+course)
  }
}
