import { Router } from '@angular/router';
import { GroupService } from './../../services/admin-services/group.service';
import { PaginationComponent } from './../../template/pagination/pagination.component';
import { NgForm, FormGroup, FormControl, Validators, FormArray, FormsModule } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentServiceService } from 'src/app/services/student-service.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { GetDataService } from './../../services/get-data.service';
import { SelectionModel } from '@angular/cdk/collections';
import { TeacherService } from 'src/app/services/admin-services/teacher.service';

interface PeriodicElementStd {
  position: any;
  registration_number: any;
  name: any;
  department: any;
}

interface PeriodicElementTea {
  position: any;
  user_id: any;
  name: any;
  department: any;
}

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {

  @ViewChild('stdPage', { static: true }) stdpaginator: MatPaginator;
  @ViewChild('teaPage', { static: true }) teapaginator: MatPaginator;

  ELEMENT_DATA_Std: PeriodicElementStd[] = [];
  displayedColumnsStd: string[] = ['select', 'position', 'registration_number', 'name', 'department'];
  dataSourceStd
  batches = []
  initialSelectionStd = [];
  allowMultiSelectStd = true;
  selectionStd = new SelectionModel<String>(this.allowMultiSelectStd, this.initialSelectionStd);

  ELEMENT_DATA_Tea: PeriodicElementTea[];
  displayedColumnsTea: string[] = ['select', 'position', 'user_id', 'name', 'department'];
  dataSourceTea
  initialSelectionTea = [];
  allowMultiSelectTea = true;
  selectionTea = new SelectionModel<String>(this.allowMultiSelectTea, this.initialSelectionTea);

  constructor(
    private studentservice: StudentServiceService,
    private GetDataService: GetDataService,
    private teacherService: TeacherService,
    private groupService: GroupService,
    private router: Router
  ) { }

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    members: new FormArray([
    ])
  })

  get name(){
    return this.form.get('name')
  }
  get members(){
    return this.form.get('members') as FormArray
  }

  applyFilterStd(filterValue: string) {
    this.dataSourceStd.filter = filterValue.trim().toLowerCase();
  }

  applyFilterTea(filterValue: string) {
    this.dataSourceTea.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.GetDataService.getBatches().subscribe(
      result => {
        for (let data in result) {
          this.batches.push(result[data].name)
        }
      }
    )
    this.studentservice.getStudents().subscribe(
      result => {
        if (result) {
          this.populateTableStd(result);
        }
      });
    this.teacherService.getTeachers().subscribe(
      result => {
        this.populateTableTea(result);
      }
    )
  }

  isAllSelectedStd() {
    const numSelected = this.selectionStd.selected.length;
    const numRows = this.dataSourceStd.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleTea() {
    this.isAllSelectedTea() ?
      this.selectionTea.clear() :
      this.dataSourceTea.data.forEach(row => this.selectionTea.select(row));
  }

  populateTableStd(result) {
    let position = 1;
    this.ELEMENT_DATA_Std = [];
    for (let data in result) {
      let student: PeriodicElementStd = {
        position: position,
        registration_number: result[data].registration_number,
        name: result[data].name,
        department: result[data].department
      }
      this.ELEMENT_DATA_Std.push(student);
      position++;
    }
    this.dataSourceStd = new MatTableDataSource(this.ELEMENT_DATA_Std);
    this.dataSourceStd.paginator = this.stdpaginator;
  }

  populateTableTea(result) {
    let teacher: PeriodicElementTea;
    this.ELEMENT_DATA_Tea = [];
    let position = 1;
    for (let data in result) {
      teacher = {
        position: position,
        user_id: result[data].user_id,
        name: result[data].name,
        department: result[data].department,
      }
      this.ELEMENT_DATA_Tea.push(teacher)
      position++
    }
    this.dataSourceTea = new MatTableDataSource(this.ELEMENT_DATA_Tea);
    this.dataSourceTea.paginator = this.teapaginator;
  }

  createGroup(data:NgForm){
    for(let value of this.selectionStd.selected){
      this.members.push(new FormControl(value['registration_number'], []))
    }
    for(let value of this.selectionTea.selected){
      this.members.push(new FormControl(value['user_id'], []))
    } 
    this.groupService.addGroup(this.form.value).subscribe(
      result=>{ 
        this.router.navigate(['admin/manage_groups/listall'])
      }
    )
  }

}
