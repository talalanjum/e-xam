import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  url = "https://e-xam.herokuapp.com/"
  constructor(
    private http:HttpClient
  ) { }

  getContent(code, id, cls){
    return this.http.get(this.url+ "teacher/contents/"+code+"/"+id+"/"+cls)
  }

  addContent(data){
    return this.http.post(this.url+"teacher/content/upload", data)
  }

  deleteContent(content_id){
    return this.http.delete(this.url+"teacher/content/delete/"+content_id)
  }

  downloadContent(course_code, content_id){
    return this.http.get(this.url+"teacher/content/download/"+course_code+"/"+content_id, {responseType: 'blob'})
  }

  updateContent(data){
    return this.http.post(this.url+"teacher/content/update", data)
  }
}
