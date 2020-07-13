import { GroupshareService } from './../../services/admin-services/groupshare.service';
import { GroupService } from './../../services/admin-services/group.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface PeriodicElement {
  position: any;
  name: any;
  id: any;
  members: any;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  ELEMENT_DATA: PeriodicElement[] = [];
  displayedColumns: string[] = ['position', 'name', 'actions'];
  dataSource
  groupId
  spinner: boolean = false;
  message

  constructor(
    private groupService: GroupService,
    private groupshare : GroupshareService,
    private router : Router,
    private toastr: ToastrService
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
    for(let item of data){
      let group: PeriodicElement = {
        position: position,
        id : item._id,
        name: item.name,
        members: item.members
      }
      this.ELEMENT_DATA.push(group)
      position++
    }
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
    this.spinner = false
  }

  deleteGroup(id, index){
    this.message = "Deleting Group..."
    this.spinner = true
    this.groupService.deleteGroup(id).subscribe(
      result=>{ 
        this.dataSource.data.splice(index, 1)
        this.dataSource._updateChangeSubscription()
        this.spinner = false
        this.toastr.success('Successfully Deleted Group!', "", {
          positionClass: "toast-top-center"
        })
      }
    )
  }

  navigateGroup(name){
    this.groupshare.changeName(name)
    this.router.navigate(['admin/manage_groups/details'])
  }
}
