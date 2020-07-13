import { RecommendationService } from './../../services/student-services/recommendation.service';
import { ExamService } from './../../services/student-services/exam.service';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CourseshareService } from 'src/app/services/student-services/courseshare.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { AssignmentService } from 'src/app/services/student-services/assignment.service';
import { QuizService } from 'src/app/services/student-services/quiz.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  coursedata
  clos = []
  classes = []
  showQuestions: boolean = false;
  file
  recommendationResults
  showRecommendation = false
  message
  spinner = false
  student
  recommendations



  ELEMENT_DATA_assignment = [];
  displayedColumnsAssignment: string[] = ['position', 'name', 'marks', 'topics', 'due_date', 'actions'];
  dataSourceAssignment

  ELEMENT_DATA_quizzes = [];
  displayedColumnsQuizzes: string[] = ['quiz_id', 'key', 'date', 'time', 'actions'];
  dataSourceQuizzes

  ELEMENT_DATA_Exams = [];
  displayedColumnsExams: string[] = ['quiz_id', 'key', 'date', 'time', 'actions'];
  dataSourceExams

  closeResult: string;
  modalOptions: NgbModalOptions;
  assignmentData = {
    mapping_CLO: '',
    class_name_uploaded_for: '',
    name: ''
  }
  quizmessage
  exammessage

  constructor(
    private courseshare: CourseshareService,
    private assignmentservice: AssignmentService,
    private modalService: NgbModal,
    private router: Router,
    private quizservice: QuizService,
    private examservice: ExamService,
    private recommendationservice: RecommendationService,
    private http: HttpClient

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
    this.message = "Fetching Lists.."
    this.spinner = true
    this.student = localStorage.getItem('token')
    this.courseshare.currentData.subscribe(
      result => {
        this.coursedata = result
        this.populateAssignments()
        this.populateQuizzes()
        this.populateExams()
        this.populateRecommendations()
        this.spinner = false
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
            due_date: result[index].due_date.slice(0, 10)
          }
          this.ELEMENT_DATA_assignment.push(assignment)
          position++
        }
        this.dataSourceAssignment = new MatTableDataSource(this.ELEMENT_DATA_assignment)
      }
    )
  }

  openUploadModal(id, j, uploadmodal) {
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

  uploadAssignment(value) {
    console.log(value)
    let form = new FormData()
    form.append('assignment', this.file, this.file.name)
  }

  populateQuizzes() {
    let myDate = new Date()
    if (this.coursedata.classes) {
      this.quizservice.getQuizzes(this.coursedata.classes, this.coursedata.course_code).subscribe(
        result => {
          let position = 1
          for (let index in result) {
            let obj = result[index]
            obj.position = position
            let quizDate = new Date(result[index].datetime)
            obj.quizDate = quizDate
            let endDate = new Date(quizDate.getTime() + result[index].duration * 60000)
            if (myDate >= quizDate && myDate <= endDate) {
              obj.attemptable = 'now'
            }
            else if (myDate < quizDate) {
              obj.attemptable = 'before'
            }
            else if (myDate > endDate) {
              obj.attemptable = 'after'
            }
            this.ELEMENT_DATA_quizzes.push(obj)
            position++
          }
          this.dataSourceQuizzes = new MatTableDataSource(this.ELEMENT_DATA_quizzes)
        }
      )
      this.quizservice.getQuizSubmissions(this.coursedata.course_code, this.coursedata.classes).subscribe(
        result => {
          console.log(result)
        }
      )

    }
  }

  populateExams() {
    let myDate = new Date()
    this.examservice.getExams(this.coursedata.classes, this.coursedata.course_code).subscribe(
      result => {
        let position = 1
        for (let index in result) {
          let obj = result[index]
          obj.position = position
          let examDate = new Date(result[index].datetime)
          obj.examDate = examDate
          let endDate = new Date(examDate.getTime() + result[index].duration * 60000)
          if (myDate >= examDate && myDate <= endDate) {
            obj.attemptable = 'now'
          }
          else if (myDate < examDate) {
            obj.attemptable = 'before'
          }
          else if (myDate > endDate) {
            obj.attemptable = 'after'
          }
          this.ELEMENT_DATA_Exams.push(obj)
          position++
        }
        this.dataSourceExams = new MatTableDataSource(this.ELEMENT_DATA_Exams)
      }
    )
  }

  populateRecommendations() {
    this.recommendationservice.getRecommendations(this.coursedata.classes, this.coursedata.course_code, this.student).subscribe(
      result => {
        this.recommendations = result
      }
    )
  }

  emptyDataFields() {
    this.assignmentData = {
      mapping_CLO: '',
      class_name_uploaded_for: '',
      name: ''
    }
    this.quizmessage = ""
    this.exammessage = ""
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

  startQuiz(quiz, modal) {
    if (quiz.attemptable === 'before') {
      this.quizmessage = "Your Quiz will be held on " + quiz.quizDate.toLocaleDateString() + ", at " + quiz.quizDate.toLocaleTimeString()
      this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
        this.emptyDataFields();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else if (quiz.attemptable === 'after') {
      this.quizmessage = "Your Quiz was held on " + quiz.quizDate.toLocaleDateString() + ", at " + quiz.quizDate.toLocaleTimeString() +
        ". You have missed the quiz."
      this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
        this.emptyDataFields();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else if (quiz.attemptable === 'now') {
      this.courseshare.setQuiz(quiz);
      this.router.navigate(['/student/quiz'])
    }
  }

  startExam(exam, modal) {
    if (exam.attemptable === 'before') {
      this.exammessage = "Your Exam will be held on " + exam.examDate.toLocaleDateString() + ", at " + exam.examDate.toLocaleTimeString()
      this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
        this.emptyDataFields();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else if (exam.attemptable === 'after') {
      this.exammessage = "Your Exam was held on " + exam.examDate.toLocaleDateString() + ", at " + exam.examDate.toLocaleTimeString() +
        ". You have missed the Exam."
      this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
        this.emptyDataFields();
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    else if (exam.attemptable === 'now') {
      this.courseshare.setExam(exam);
      this.router.navigate(['/student/exam'])
    }
  }

  openRecommendation(item) {
    this.message = "Fetching results..."
    this.spinner = true
    let url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBHL4ZUdbOUWWPVnJriRcZA3olx4k8F3Gc&cx=011164081042927830597:x3hk0uq0xqk&q=' + item + '&safe=high';
    this.http.get(url).subscribe(
      result => {
        this.recommendationResults = result['items']
        this.showRecommendation = true
        this.spinner = false
      }
    )
  }

}
