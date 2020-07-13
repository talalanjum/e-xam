import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  private url = "https://e-xam.herokuapp.com/";

  constructor(
    private http: HttpClient
  ) { }

  getRecommendations(class_id, course_id, student_id){
    return this.http.get(this.url+"student/recommendations/"+class_id+"/"+course_id+"/"+student_id)
  }
}
