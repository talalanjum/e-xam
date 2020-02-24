import { MatTableDataSource } from '@angular/material';
import { TeacherService } from 'src/app/services/admin-services/teacher.service';
import { StudentServiceService } from 'src/app/services/student-service.service';
import { GroupService } from './../../services/admin-services/group.service';
import { GroupshareService } from './../../services/admin-services/groupshare.service';
import { Component, OnInit } from '@angular/core';

interface PeriodicElement {
  position: any;
  name: any;
  id: any;
}

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {

  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns: string[] = ['position', 'name', 'actions'];
  dataSource
  groupName

  constructor(
    private groupshare: GroupshareService,
    private groupService: GroupService,
    private studentService: StudentServiceService,
    private teacherService: TeacherService
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit() {
    this.groupshare.currentName.subscribe(
      result => {
        this.groupName = result
      }
    ).add(
      this.groupService.getGroup(this.groupName).subscribe(
        result => {
          this.populateTable(result)
          console.log(this.ELEMENT_DATA)
        }
      )
    )
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  async populateTable(data) {
    let position = 1;
    for (let member of data['members']) {
      if ((member as string).match('^(FA|SP){1}[0-9]{2}[-](BAF|BAR|BBA|BBS|BCE|BCS|BDE|BEC|BEE|BEL|BET|BPH|BPY|BSB|BSE|BSI|BSM|BSO|ECE|EEE|EPE){1}[-]{1}[0-9]{3}')) {
        this.studentService.getStudentById(member).subscribe(
          result => {
            let groupmember: PeriodicElement = {
              position: position,
              name: result[0]['name'],
              id: member
            }
            position++
            this.ELEMENT_DATA.push(groupmember)
          }
        )
      }
      else {
        this.teacherService.getTeacher(member).subscribe(
          result => {
            let groupmember: PeriodicElement = {
              position: position,
              name: result[0]['name'],
              id: member
            }
            position++
            this.ELEMENT_DATA.push(groupmember)
          }
        )
      }
    }
  }

}
