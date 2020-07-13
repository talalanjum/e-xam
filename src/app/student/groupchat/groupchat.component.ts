import { ChatService } from './../../services/student-services/chat.service';
import { GroupshareService } from './../../services/student-services/groupshare.service';
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
  currentUser
  spinner: boolean = false;
  spinnerMessage
  constructor(
    private groupShare: GroupshareService,
    private chatService: ChatService,
  ) {
    this.spinnerMessage = "Fetching Messages.."
    this.spinner = true
    this.groupShare.currentName.subscribe(
      result => {
        this.groupName = result
      }
    )
    this.chatService.setupSocketConnection(this.groupName)
    this.chatService.getMessages().subscribe(
      result => { 
        this.messages = []
        for (let message of result.message) {
          let msg = {
            sender: message.sender,
            text: message.text,
            _id: message._id
          }
          this.messages.push(msg)
        }
        this.spinner = false
      }
    )
  }

  applyFilter(filterValue: string) {
    this.messages = this.messages.filter(t=> t == filterValue.trim().toLowerCase())
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem('token')
  }

  sendMessage() {
    let obj = {
      message: [{
        sender: localStorage.getItem('token'),
        text: (this.message as String).slice(0)
      }],
      groupname: this.groupName
    }
    this.chatService.sendMessage(obj)
    this.message = ""
  }

  deleteMessage(_id){ 
    this.chatService.deleteMessage(this.groupName, _id)

  }

}
