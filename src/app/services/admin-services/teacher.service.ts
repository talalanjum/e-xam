import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private url = "https://e-xam.herokuapp.com/";
  constructor(private http: HttpClient) { }

  getTeachers(){
    return this.http.get(this.url+"admin/view_teachers")
  }

  getTeacher(id){
    return this.http.get(this.url+"admin/teacher/search_id/"+id);
  }
  
  deleteTeacher(id){
    return this.http.delete(this.url+"admin/teacher/remove_teacher/"+id);
  }
  
  addTeacher(data){
    return this.http.post(this.url+"admin/insert_teacher" , data)
  }

  updateTeacher(data){
    return this.http.post(this.url+"admin/teacher/update_teacher", data)
  }
}
