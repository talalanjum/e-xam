import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket;
  constructor() { }

  setupSocketConnection() {
    this.socket = io("https://e-xam.herokuapp.com/", { query: "groupname=" + localStorage.getItem("groupname") })

    // this.socket.emit('output', '')
  }
  getMessages() {
    return Observable.create((observer) => {
      this.socket.on('output', function (data) {
        observer.next(data)
      })
    })
  }

  sendMessage(message){
    this.socket.emit('input', message)
  }
}
