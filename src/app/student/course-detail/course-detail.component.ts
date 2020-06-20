import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CourseshareService } from 'src/app/services/student-services/courseshare.service';
import { ContentService } from 'src/app/services/teacher-services/content.service';
import { QuestionService } from 'src/app/services/teacher-services/question.service';
import { TeacherCourseService } from 'src/app/services/teacher-services/course.service';
import { Router } from '@angular/router';
import { ContentshareService } from 'src/app/services/teacher-services/contentshare.service';
import { FormGroup, FormControl, FormArray, Validators, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { AssignmentService } from 'src/app/services/student-services/assignment.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  coursedata
  teacher
  clos = []
  classes = []
  quizName: any;
  showQuestions: boolean = false;
  file
  ELEMENT_DATA_content = [];
  displayedColumnsQuizzes: string[] = ['quizNo', 'date', 'time', 'actions'];
  dataSourceQuizzes = [
    { quizNo: "1", date: "22-April-20", time: "12:00pm", attempted: true, },
    { quizNo: "2", date: "2-April-20", time: "12:00pm", attempted: false, }]

  ELEMENT_DATA_assignment = [];
  displayedColumnsAssignment: string[] = ['position', 'name', 'marks', 'topics', 'due_date', 'actions'];
  dataSourceAssignment

  ELEMENT_DATA_question = [];
  displayedColumnsQuestion: string[] = ['position', 'question_text', 'type', 'topic', 'actions'];
  dataSourceQuestion

  closeResult: string;
  modalOptions: NgbModalOptions;
  assignmentData = {
    mapping_CLO: '',
    class_name_uploaded_for: '',
    name: ''
  }

  constructor(
    private courseshare: CourseshareService,
    private contentservice: ContentService,
    private assignmentservice: AssignmentService,
    private questionservice: QuestionService,
    private modalService: NgbModal,
    private courseservce: TeacherCourseService,
    private router: Router,
    private contentshare: ContentshareService

  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }

  upload = new FormGroup({
    assignment: new FormControl()
  })

  assignmentform = new FormGroup({
    assignment_id: new FormControl(),
    mapping_CLO: new FormArray([]),
    class_name_uploaded_for: new FormArray([]),
    name: new FormControl(null, Validators.required)
  })

  get mapping_CLO() {
    return this.assignmentform.get('mapping_CLO') as FormArray
  }
  get class_name_uploaded_for() {
    return this.assignmentform.get('class_name_uploaded_for') as FormArray
  }
  get name() {
    return this.assignmentform.get('name')
  }

  ngOnInit() {
    this.teacher = localStorage.getItem('token')
    this.courseshare.currentData.subscribe(
      result => {
        this.coursedata = result
        console.log(this.coursedata)
        this.populateAssignments()
      }
    )
  }

  populateAssignments() {
    this.assignmentservice.getAssignments(this.coursedata.course_code, this.coursedata.classes).subscribe(
      result => {
        let position = 1
        for (let index in result) {
          let topic = "";
          for (let clo of result[index].mapping_CLO) {
            if ((result[index].mapping_CLO).indexOf(clo) == (result[index].mapping_CLO).length - 1) {
              topic += clo
            }
            else {
              topic += clo + ", "
            }
          }
          let assignment = {
            position: position,
            name: result[index].name,
            marks: result[index].marks,
            topics: topic,
            due_date: result[index].due_date.slice(0,10)
          }
          this.ELEMENT_DATA_assignment.push(assignment)
          position++
        }
        this.dataSourceAssignment = new MatTableDataSource(this.ELEMENT_DATA_assignment)
      }
    )
  }

  openUploadModal(id , j, uploadmodal){
    this.modalService.open(uploadmodal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      let fileList = event.target.files
      this.file = fileList[0]
      this.upload.patchValue({
        assignment: this.file.name
      })
    }
  }

  uploadAssignment(value){
    console.log(value)
    let form = new FormData()
    form.append('assignment', this.file, this.file.name)
  }

  populateQuizzes() {

  }

  populateRecommendations() {

  }

  emptyDataFields() {
    this.assignmentData = {
      mapping_CLO: '',
      class_name_uploaded_for: '',
      name: ''
    }
    this.assignmentform.reset()
    this.classes = []
    this.clos = []
    for (let i = 0; i <= this.class_name_uploaded_for.length; i++) {
      this.class_name_uploaded_for.controls.pop()
    }
    for (let i = 0; i <= this.mapping_CLO.length; i++) {
      this.class_name_uploaded_for.controls.pop()
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.emptyDataFields()
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.emptyDataFields()
      return 'by clicking on a backdrop';
    } else {
      this.emptyDataFields()
      return `with: ${reason}`;
    }
  }

  startQuiz(quiz) {
    this.quizName = quiz.quizNo;
    this.showQuestions = true;
    this.courseshare.setQuiz(quiz);
    this.router.navigate(['/student/quiz'])
  }
}
