import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
    return this.http.get(this.url+"student/groups/"+id)
  }

  deleteMessage(groupName, _id){
    return this.http.delete(this.url+"student/chat/"+groupName+"/"+_id)
  }
}
