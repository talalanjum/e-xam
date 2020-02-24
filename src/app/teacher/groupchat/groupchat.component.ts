import { StudentListComponent } from './../student-list/student-list.component';
import { ChatService } from './../../services/teacher-services/chat.service';
import { GroupshareService } from './../../services/teacher-services/groupshare.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-groupchat',
  templateUrl: './groupchat.component.html',
  styleUrls: ['./groupchat.component.scss']
})
export class GroupchatComponent implements OnInit {

  groupName
  messages = []
  message

  constructor(
    private groupShare: GroupshareService,
    private chatService: ChatService
  ) {
    this.groupShare.currentName.subscribe(
      result => {
        this.groupName = result
      }
    )
    this.chatService.setupSocketConnection()
    this.chatService.getMessages().subscribe(
      result => {
        for (let message of result[0].message) {
          let msg = {
            sender: message.sender,
            text: message.text
          }
          this.messages.push(msg)
        }
      }
    )
  }

  ngOnInit() {
    
  }

  sendMessage() {
    let obj = {
      message: [{
        sender: localStorage.getItem('token'),
        text: (this.message as String).slice(0, this.)
      }],
      groupname: localStorage.getItem('groupname')
    }
    this.chatService.sendMessage(obj)
    this.messages.push(obj.message)
    console.log(this.messages)
    this.message = ""
  }
}
