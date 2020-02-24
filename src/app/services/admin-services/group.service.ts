import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private url = "https://e-xam.herokuapp.com/";

  constructor(
    private http: HttpClient
  ) { }

  addGroup(data){
    return this.http.post(this.url+"admin/group/add", data)
  }

  getGroups(){
    return this.http.get(this.url+"admin/groups/all")
  }

  deleteGroup(id){
    return this.http.delete(this.url+"admin/group/delete/"+id)
  }

  getGroup(name){
    return this.http.get(this.url+"admin/group/"+name)
  }
}
