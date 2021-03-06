import { GroupshareService } from './../../services/student-services/groupshare.service';
import { GroupService } from './../../services/student-services/group.service';


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

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
  spinner: boolean = false;
  message


  constructor(
    private groupService: GroupService,
    private groupshare: GroupshareService,
    private router : Router
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.message = "Fetching List..."
    this.spinner = true
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
    this.spinner = false
  }

  navigateGroup(row){
    this.groupshare.changeName(row.name)
    this.router.navigate(['student/group_menu/chat'])
  }

}
