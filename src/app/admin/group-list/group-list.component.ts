import { GroupshareService } from './../../services/admin-services/groupshare.service';
import { GroupService } from './../../services/admin-services/group.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

interface PeriodicElement {
  position: any;
  name: any;
  id: any;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns: string[] = ['position', 'name', 'actions'];
  dataSource
  groupId

  constructor(
    private groupService: GroupService,
    private groupshare : GroupshareService,
    private router : Router
  ) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.groupService.getGroups().subscribe(
      result=>{
        this.populateTable(result)
      }
    )
  }

  populateTable(data){
    let position = 1
    for(let item of data){
      let group: PeriodicElement = {
        position: position,
        id : item._id,
        name: item.name,
      }
      this.ELEMENT_DATA.push(group)
      position++
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  deleteGroup(id){
    this.groupService.deleteGroup(id).subscribe(
      result=>{
        console.log(result)
      }
    )
  }

  navigateGroup(name){
    this.groupshare.changeName(name)
    this.router.navigate(['admin/manage_groups/details'])
  }
}
