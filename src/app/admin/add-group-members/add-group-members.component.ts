import { Router } from '@angular/router';
import { GroupshareService } from './../../services/admin-services/groupshare.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { StudentServiceService } from 'src/app/services/student-service.service';
import { TeacherService } from 'src/app/services/admin-services/teacher.service';
import { GroupService } from 'src/app/services/admin-services/group.service';
import { GetDataService } from './../../services/get-data.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-group-members',
  templateUrl: './add-group-members.component.html',
  styleUrls: ['./add-group-members.component.scss']
})
export class AddGroupMembersComponent implements OnInit {
  @ViewChild('stdPage', { static: true }) stdpaginator: MatPaginator;
  @ViewChild('teaPage', { static: true }) teapaginator: MatPaginator;

  ELEMENT_DATA_Std = [];
  displayedColumnsStd: string[] = ['select', 'position', 'registration_number', 'name'];
  dataSourceStd
  initialSelectionStd = [];
  allowMultiSelectStd = true;
  selectionStd = new SelectionModel<String>(this.allowMultiSelectStd, this.initialSelectionStd);
  spinner: boolean = false;
  message

  ELEMENT_DATA_Tea = [];
  displayedColumnsTea: string[] = ['select', 'position', 'user_id', 'name'];
  dataSourceTea
  initialSelectionTea = [];
  allowMultiSelectTea = true;
  selectionTea = new SelectionModel<String>(this.allowMultiSelectTea, this.initialSelectionTea);

  constructor(
    private groupshare: GroupshareService,
    private studentservice: StudentServiceService,
    private teacherService: TeacherService,
    private groupService: GroupService,
    private GetDataService: GetDataService,
    private toastr: ToastrService,
    private router: Router
  ) { }
  batches = []
  groupName
  groupMembers

  applyFilterStd(filterValue: string) {
    this.dataSourceStd.filter = filterValue.trim().toLowerCase();
  }

  applyFilterTea(filterValue: string) {
    this.dataSourceTea.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.message = "Fetching Teacher's List..."
    this.spinner = true
    this.groupshare.currentName.subscribe(
      result => {
        this.groupName = result
      }
    )
    if (this.groupName) {
      this.GetDataService.getBatches().subscribe(
        result => {
          for (let data in result) {
            this.batches.push(result[data].name)
          }
        }
      )
      this.teacherService.getTeachers().subscribe(
        result => {
          setTimeout(() => {
            this.populateTableTea(result);
          }, 3000)
        }
      )
      this.groupService.getGroup(this.groupName).subscribe(
        result => {
          this.groupMembers = result['members']
        }
      )
    }
  }

  updateList(batch) {
    this.message = "Fetching Student's List..."
    this.spinner = true
    this.studentservice
      .getBatchStudents(batch)
      .subscribe(result => {
        if ((result as string).includes('No Student found')) {
          console.log(result)
        }
        else {
          this.populateTableStd(result);
        }
      }, err => {

      });
  }

  isAllSelectedStd() {
    const numSelected = this.selectionStd.selected.length;
    const numRows = this.dataSourceStd.data.length;
    return numSelected == numRows;
  }

  masterToggleStd() {
    this.isAllSelectedStd() ?
      this.selectionStd.clear() :
      this.dataSourceStd.data.forEach(row => this.selectionStd.select(row));
  }

  isAllSelectedTea() {
    const numSelected = this.selectionTea.selected.length;
    const numRows = this.dataSourceTea.data.length;
    return numSelected == numRows;
  }

  masterToggleTea() {
    this.isAllSelectedTea() ?
      this.selectionTea.clear() :
      this.dataSourceTea.data.forEach(row => this.selectionTea.select(row));
  }

  populateTableStd(result) {
    let position = 1;
    this.ELEMENT_DATA_Std = []
    for (let data in result) {
      if ((this.groupMembers as Array<any>).includes(result[data].registration_number)) {
        continue;
      }
      else {
        let student = {
          position: position,
          registration_number: result[data].registration_number,
          name: result[data].name,
        }
        this.ELEMENT_DATA_Std.push(student);
        position++;
      }
    }
    this.dataSourceStd = new MatTableDataSource(this.ELEMENT_DATA_Std);
    this.dataSourceStd.paginator = this.stdpaginator;
    this.spinner = false
  }

  populateTableTea(result) {

    let teacher;
    this.ELEMENT_DATA_Tea = [];
    let position = 1;
    for (let data in result) {
      if ((this.groupMembers as Array<any>).includes(result[data].user_id)) {
        continue;
      }
      else {
        teacher = {
          position: position,
          user_id: result[data].user_id,
          name: result[data].name,
        }
        this.ELEMENT_DATA_Tea.push(teacher)
        position++
      }
    }
    this.dataSourceTea = new MatTableDataSource(this.ELEMENT_DATA_Tea);
    this.dataSourceTea.paginator = this.teapaginator;
    this.spinner = false
  }

  addMembers() {
    this.message = "Adding Members..."
    this.spinner = true
    let members = []
    for (let member of this.selectionStd.selected) {
      members.push(member['registration_number'])
    }
    for (let member of this.selectionTea.selected) {
      members.push(member['user_id'])
    }
    let data = {
      name: this.groupName,
      members: members
    }
    this.groupService.addMembersToGroup(data).subscribe(
      result => {
        if(result){
          this.spinner = false
          this.toastr.success('Successfully Added Members!', "", {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['/admin/manage_groups/details'])
        }
      }
    )
  }
}
