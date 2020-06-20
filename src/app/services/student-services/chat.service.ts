import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  socket;
  constructor() { }

  setupSocketConnection(groupname) {
    this.socket = io("https://e-xam.herokuapp.com/", { query: "groupname=" + groupname })
  }
  getMessages() {
    return Observable.create((observer) => {
      this.socket.on('output', function (data) {
        observer.next(data)
      })
    })
  }

  deleteMessage(groupName, _id){
    let obj = {
      groupName : groupName,
      _id : _id
    }
    this.socket.emit('del', obj)
  }

  sendMessage(message){
    this.socket.emit('input', message)
  }
}
