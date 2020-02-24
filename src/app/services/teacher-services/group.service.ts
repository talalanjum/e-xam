import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private url = "https://e-xam.herokuapp.com/";

  constructor(
    private http:HttpClient
  ) { }

  getGroups(){
    let id = localStorage.getItem('token')
    return this.http.get(this.url+"teacher/groups/"+id)
  }
}
