import { GroupService } from './../../services/teacher-services/group.service';

import { AssignmentsService } from './../../services/teacher-services/assignments.service';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { CourseshareService } from 'src/app/services/teacher-services/courseshare.service';
import { ChatService } from 'src/app/services/teacher-services/chat.service';

@Component({
  selector: 'app-add-assignment',
  templateUrl: './add-assignment.component.html',
  styleUrls: ['./add-assignment.component.scss']
})
export class AddAssignmentComponent implements OnInit {

  constructor(
    private courseshare: CourseshareService,
    private assignmentsservice: AssignmentsService,
    private groupservice: GroupService,
    private chatService: ChatService,
  ) { }

  teacher
  coursedata
  file
  form: FormGroup
  groups = []
  ngOnInit() {
    this.courseshare.currentData.subscribe(
      res => {
        this.coursedata = res
      }
    )
    this.groupservice.getGroups().subscribe(
      result => {  
        for (let data in result) {
          this.groups.push(result[data].name)
        }
      }
    )
    this.teacher = localStorage.getItem('token')
    this.form = new FormGroup({
      course_code: new FormControl(this.coursedata.course_code),
      uploaded_by: new FormControl(this.teacher),
      mapping_CLO: new FormArray([], Validators.required),
      content: new FormControl(null, Validators.required),
      marks: new FormControl('', Validators.required),
      due_date: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      class_name_uploaded_for: new FormArray([], Validators.required),
      group_to_notify: new FormControl(null)
    })
  }

  get mapping_CLO() {
    return this.form.get('mapping_CLO') as FormArray
  }
  get content() {
    return this.form.get('content')
  }
  get class_name_uploaded_for() {
    return this.form.get('class_name_uploaded_for') as FormArray
  }
  get course_code() {
    return this.form.get('course_code')
  }
  get uploaded_by() {
    return this.form.get('uploaded_by')
  }
  get marks() {
    return this.form.get('marks')
  }
  get due_date() {
    return this.form.get('due_date')
  }
  get name() {
    return this.form.get('name')
  }
  get group_to_notify() {
    return this.form.get('group_to_notify')
  }

  addAssignment() {
    if (this.group_to_notify.touched) {
      this.chatService.setupSocketConnection(this.group_to_notify.value)
      let obj = {
        message: [{
          sender: localStorage.getItem('token'),
          text: 'Hello Students! A new assignment with name "' + this.name.value + '" has been uploaded and is due on "' + this.due_date.value.slice(0, 10) + '". Please check it'
        }],
        groupname: this.group_to_notify.value
      }
      this.chatService.sendMessage(obj)
    }
    let form = new FormData()
    form.set('course_code', this.coursedata.course_code)
    form.set('uploaded_by', this.teacher)
    form.set('marks', this.marks.value)
    form.set('due_date', this.due_date.value)
    form.set('name', this.name.value)
    form.set('class_name_uploaded_for', this.class_name_uploaded_for.value)
    form.set('mapping_CLO', this.mapping_CLO.value)
    form.set('content', this.file, this.file.name)
    this.assignmentsservice.addAssignment(form).subscribe(
      result => { 
      }
    )
  }

  onclasschange(event) {
    if (event.checked) {
      this.class_name_uploaded_for.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for (let control of this.class_name_uploaded_for.controls) {
        if (control.value == event.source.value) {
          this.class_name_uploaded_for.removeAt(this.class_name_uploaded_for.controls.indexOf(control))
        }
      }
    }
  }

  onclochange(event) {
    if (event.checked) {
      this.mapping_CLO.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for (let control of this.mapping_CLO.controls) {
        if (control.value == event.source.value) {
          this.mapping_CLO.removeAt(this.mapping_CLO.controls.indexOf(control))
        }
      }
    }
  }

  public onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      let fileList = event.target.files
      this.file = fileList[0]
      this.form.patchValue({
        content: this.file.name
      })
    }
  }

}
