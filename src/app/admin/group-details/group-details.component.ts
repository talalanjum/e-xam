import { MatTableDataSource } from '@angular/material';
import { TeacherService } from 'src/app/services/admin-services/teacher.service';
import { StudentServiceService } from 'src/app/services/student-service.service';
import { GroupService } from './../../services/admin-services/group.service';
import { GroupshareService } from './../../services/admin-services/groupshare.service';
import { Component, OnInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  displayedColumns: string[] = ['select', 'position', 'name', 'id'];
  dataSource
  groupName
  selection = new SelectionModel<any>(true, []);
  spinner: boolean = false;
  message

  constructor(
    private groupshare: GroupshareService,
    private groupService: GroupService,
    private studentService: StudentServiceService,
    private teacherService: TeacherService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit() {
    this.message = "Fetching Lists..."
    this.spinner = true
    this.groupshare.currentName.subscribe(
      result => {
        this.groupName = result
      }
    ).add(
      this.groupService.getGroup(this.groupName).subscribe(
        result => {
          this.populateTable(result)
        }
      )
    )
  }

  async populateTable(data) {
    let position = 1;
    if (data) {
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
      setTimeout(() => {
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.spinner = false
      }, 1000)
    }

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  removeMembers() {
    this.message = "Removing Members..."
    this.spinner = true
    let members = []
    for (let member of this.selection.selected) {
      members.push(member.id)
    }
    let data = {
      name: this.groupName,
      members: members
    }
    this.groupService.deleteMembersFromGroup(data).subscribe(
      result => {
        if (result) {
          this.spinner = false
          this.toastr.success('Successfully Deleted Members!', "", {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['/admin/manage_groups/listall'])
        }
      }
    )
  }

  addMembers() {
    this.router.navigate(['/admin/manage_groups/addmembers'])
  }

}
