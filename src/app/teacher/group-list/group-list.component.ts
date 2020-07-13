import { GroupshareService } from './../../services/teacher-services/groupshare.service';
import { MatTableDataSource } from '@angular/material';
import { GroupService } from './../../services/teacher-services/group.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface PeriodicElement {
  position: any;
  name: any;
  members: any;
}


@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns: string[] = ['position', 'name', 'members'];
  dataSource
  spinner = false;
  message = "Getting group data.."


  constructor(
    private groupService: GroupService,
    private groupshare: GroupshareService,
    private router : Router
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.spinner = true;
    this.groupService.getGroups().subscribe(
      result=>{
        this.populateTable(result) 
      }
    )
  }

  populateTable(data){
    let position = 1
    for(let item in data){
      let group: PeriodicElement = {
        position: position,
        name: data[item].name,
        members: (data[item].members as Array<any>).length
      }
      this.ELEMENT_DATA.push(group)
      position++
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
    this.spinner = false;
  }

  navigateGroup(row){
    this.groupshare.changeName(row.name)
    this.router.navigate(['teacher/group_menu/chat'])
  }



}
