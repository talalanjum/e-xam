import { ExamService } from './../../services/teacher-services/exam.service';
import { ExamshareService } from './../../services/teacher-services/examshare.service';
import { QuizshareService } from './../../services/teacher-services/quizshare.service';
import { ToastrService } from 'ngx-toastr';
import { QuizService } from './../../services/teacher-services/quiz.service';
import { QuestionshareService } from './../../services/teacher-services/questionshare.service';
import { ContentshareService } from './../../services/teacher-services/contentshare.service';
import { TeacherCourseService } from 'src/app/services/teacher-services/course.service';
import { FormControl, Validators, FormGroup, FormArray, NgForm } from '@angular/forms';
import { QuestionService } from './../../services/teacher-services/question.service';
import { AssignmentsService } from './../../services/teacher-services/assignments.service';
import { saveAs } from 'file-saver';
import { MatTableDataSource } from '@angular/material';
import { CourseshareService } from './../../services/teacher-services/courseshare.service';
import { Component, OnInit } from '@angular/core';
import { ContentService } from 'src/app/services/teacher-services/content.service';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  coursedata
  teacher
  clos = []
  classes = []
  message
  spinner

  ELEMENT_DATA_content = [];
  displayedColumnsContent: string[] = ['position', 'description', 'classes', 'uploaded_on', 'actions'];
  dataSourceContent

  ELEMENT_DATA_assignment = [];
  displayedColumnsAssignment: string[] = ['position', 'name', 'marks', 'classes', 'due_date', 'actions'];
  dataSourceAssignment

  ELEMENT_DATA_question = [];
  displayedColumnsQuestion: string[] = ['position', 'question_text', 'type', 'topic', 'actions'];
  dataSourceQuestion
  detailsDataQuestion = {
    answer: "",
    course_code: "",
    mapping_CLO: "",
    question_text: "",
    topic: "",
    type: "",
    uploaded_by: "",
    mcq_options: "",
    keywords: ""
  }
  closeResult: string;
  modalOptions: NgbModalOptions;
  assignmentData = {
    mapping_CLO: '',
    class_name_uploaded_for: '',
    name: ''
  }

  ELEMENT_DATA_quiz = []
  displayedColumnsQuiz: string[] = ['position', 'quiz_id', 'class_id', 'course_id', 'actions'];
  dataSourceQuiz
  quizData = {
    CLO: "",
    class_id: "",
    course_id: "",
    key: "",
    questions: "",
    quiz_id: "",
    uploaded_by: "",
    duration: "",
    datetime: ""
  }

  ELEMENT_DATA_exam = []
  displayedColumnsExam: string[] = ['position', 'exam_id', 'class_id', 'course_id', 'actions'];
  dataSourceExam
  examData = {
    CLO: "",
    class_id: "",
    course_id: "",
    key: "",
    questions: "",
    exam_id: "",
    uploaded_by: "",
    duration: "",
    datetime: ""
  }

  constructor(
    private courseshare: CourseshareService,
    private contentservice: ContentService,
    private assignmentsservice: AssignmentsService,
    private questionservice: QuestionService,
    private modalService: NgbModal,
    private router: Router,
    private contentshare: ContentshareService,
    private questionshare: QuestionshareService,
    private quizservice: QuizService,
    private toastr: ToastrService,
    private quizshare: QuizshareService,
    private examshare: ExamshareService,
    private examservice: ExamService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
      size: 'lg'
    }
  }

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
      }
    )
    this.questionservice.getQuestions(this.coursedata.course_code).subscribe(
      result => {
        let position = 1
        for (let data in result) {
          let question = {
            _id: result[data]._id,
            position: position,
            question_text: result[data].question_text,
            type: result[data].type,
            topic: result[data].topic,
            answer: result[data].answer,
            course_code: result[data].course_code,
            mapping_CLO: result[data].mapping_CLO,
            uploaded_by: result[data].uploaded_by,
            mcq_options: result[data].mcq_options,
            keywords: result[data].keywords
          }
          this.ELEMENT_DATA_question.push(question)
          position++
        }
        this.dataSourceQuestion = new MatTableDataSource(this.ELEMENT_DATA_question)
      }
    )
  }

  contentchange(event) {
    this.message = "Fetching Content List.."
    this.spinner = true
    if(this.ELEMENT_DATA_content.length !== 0){
      this.ELEMENT_DATA_content = []
      this.dataSourceContent._updateChangeSubscription
    }
    this.contentservice.getContent(this.coursedata.course_code, this.teacher, event.target.value).subscribe(
      result => {
        let position = 1
        for (let data in result) {
          let content = {
            position: position,
            classes: result[data].class_name_uploaded_for,
            content_id: result[data].content_id,
            mapping_CLO: result[data].mapping_CLO,
            uploaded_on: result[data].uploaded_on.slice(0, 10),
            description: result[data].description
          }
          this.ELEMENT_DATA_content.push(content)
          position++
        }
        this.dataSourceContent = new MatTableDataSource(this.ELEMENT_DATA_content)
        this.spinner = false
      }
    )
  }

  assignmentchange(event) {
    this.message = "Fetching Assignment List..."
    this.spinner = true
    if(this.ELEMENT_DATA_assignment.length !== 0){
      this.ELEMENT_DATA_assignment = []
      this.dataSourceAssignment._updateChangeSubscription()
    }
    this.assignmentsservice.getAssignments(this.coursedata.course_code, this.teacher, event.target.value).subscribe(
      result => {
        let position = 1
        for (let data in result) {
          let assignment = {
            position: position,
            _id: result[data]._id,
            name: result[data].name,
            assignment_id: result[data].assignment_id,
            marks: result[data].marks,
            classes: result[data].class_name_uploaded_for,
            clos: result[data].mapping_CLO,
            due_date: (result[data].due_date as string).slice(0, 10)
          }
          this.ELEMENT_DATA_assignment.push(assignment)
          position++
        }
        this.dataSourceAssignment = new MatTableDataSource(this.ELEMENT_DATA_assignment)
        this.spinner = false
      }
    )
  }

  deleteContent(content_id, index) {
    this.message = "Deleting Content..."
    this.spinner = true
    this.contentservice.deleteContent(content_id).subscribe(
      result => {
        this.dataSourceContent.data.splice(index, 1)
        this.dataSourceContent._updateChangeSubscription()
        this.spinner = false
        this.toastr.success('Successfully Deleted Content!', "", {
          positionClass: "toast-top-center"
        })
      }
    )
  }

  downloadContent(content_id) {
    this.contentservice.downloadContent(this.coursedata.course_code, content_id).toPromise().then(
      blob => {
        saveAs(blob, content_id)
      }
    )
  }

  deleteAssignment(assignment_id, index) {
    this.message = "Deleting Assignment..."
    this.spinner = true
    this.assignmentsservice.deleteAssignment(assignment_id).subscribe(
      result => {
        this.dataSourceAssignment.data.splice(index, 1)
        this.dataSourceAssignment._updateChangeSubscription()
        this.spinner = false
        this.toastr.success('Successfully Deleted Assignment!', "", {
          positionClass: "toast-top-center"
        })
      }
    )
  }

  downloadAssignment(assignment_id) {
    this.assignmentsservice.downloadAssignment(this.coursedata.course_code, assignment_id).toPromise().then(
      blob => {
        saveAs(blob, assignment_id)
      }
    )
  }

  deleteQuestion(_id, index) {
    this.message = "Deleting Question..."
    this.spinner = true
    this.questionservice.deleteQuestion(_id).subscribe(
      result => {
        this.dataSourceQuestion.data.splice(index, 1)
        this.dataSourceQuestion._updateChangeSubscription()
        this.spinner = false
        this.toastr.success('Successfully Deleted Question!', "", {
          positionClass: "toast-top-center"
        })
      }
    )
  }

  openEditAssignment(modal, assignment_id) {
    this.assignmentform.patchValue({
      assignment_id: assignment_id
    })
    this.assignmentsservice.getAssignment(assignment_id).subscribe(
      result => {
        this.assignmentData.class_name_uploaded_for = result['class_name_uploaded_for']
        this.assignmentData.mapping_CLO = result['mapping_CLO']
        this.assignmentData.name = result['name']
        for (let clo of this.assignmentData.mapping_CLO) {
          this.mapping_CLO.push(
            new FormControl(clo, Validators.required)
          )
        }
        for (let cls of this.assignmentData.class_name_uploaded_for) {
          this.class_name_uploaded_for.push(
            new FormControl(cls, Validators.required)
          )
        }
        let clochecked
        for (let clo of this.coursedata.clos) {
          for (let Clo of this.assignmentData.mapping_CLO) {
            if (clo == Clo) {
              clochecked = true
              break
            }
            else {
              clochecked = false
            }
          }
          this.clos.push({
            clo: clo,
            checked: clochecked
          })
        }
        let classchecked
        for (let cls of this.coursedata.classes) {
          for (let Cls of this.assignmentData.class_name_uploaded_for) {
            if (cls == Cls) {
              classchecked = true
              break
            }
            else {
              classchecked = false
            }
          }
          this.classes.push({
            class: cls,
            checked: classchecked
          })
        }
      }
    )
    this.modalService.open(modal, this.modalOptions).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  emptyDataFields() {
    this.assignmentData = {
      mapping_CLO: '',
      class_name_uploaded_for: '',
      name: ''
    }
    this.detailsDataQuestion = {
      answer: "",
      course_code: "",
      mapping_CLO: "",
      question_text: "",
      topic: "",
      type: "",
      uploaded_by: "",
      mcq_options: "",
      keywords: ""
    }
    this.quizData = {
      CLO: "",
      class_id: "",
      course_id: "",
      key: "",
      questions: "",
      quiz_id: "",
      uploaded_by: "",
      duration: "",
      datetime: ""
    }
    this.examData = {
      CLO: "",
      class_id: "",
      course_id: "",
      key: "",
      questions: "",
      exam_id: "",
      uploaded_by: "",
      duration: "",
      datetime: ""
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

  onassignmentclasschange(event) {
    if (event.checked) {
      this.class_name_uploaded_for.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for (let control of this.class_name_uploaded_for.controls) {
        if (control.value == event.source.value) {
          this.class_name_uploaded_for.removeAt(this.class_name_uploaded_for.controls.indexOf(control))
        }
      }
    }
  }

  onassignmentclochange(event) {
    if (event.checked) {
      this.mapping_CLO.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for (let control of this.mapping_CLO.controls) {
        if (control.value == event.source.value) {
          this.mapping_CLO.removeAt(this.mapping_CLO.controls.indexOf(control))
        }
      }
    }
  }

  updateAssignment(form: NgForm) {
    this.modalService.dismissAll()
    this.message = "Updating Assignment..."
    this.spinner = true
    this.assignmentsservice.updateAssignment(form).subscribe(
      result => {
        this.emptyDataFields()
        this.spinner = false
        this.toastr.success('Successfully Updated Assignment!', "", {
          positionClass: "toast-top-center"
        })
        this.router.navigate(['teacher/course_menu/list'])
      }
    )
  }

  editContent(id, classes) {
    let content = {
      content_id: id,
      classes: classes
    }
    this.contentshare.changeId(content)
    this.router.navigate(['teacher/content/update'])
  }

  openDetailsQuestion(id, modal) {
    for (let data of this.ELEMENT_DATA_question) {
      if (data._id == id) {
        this.detailsDataQuestion = {
          answer: data.answer,
          course_code: data.course_code,
          mapping_CLO: data.mapping_CLO,
          question_text: data.question_text,
          topic: data.topic,
          type: data.type,
          uploaded_by: data.uploaded_by,
          mcq_options: data.mcq_options,
          keywords: data.keywords
        }
      }
    }
    this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditQuestion(id) {
    for (let data of this.ELEMENT_DATA_question) {
      if (data._id == id) {
        this.questionshare.changeData(data)
        break
      }
    }
    this.router.navigate(['teacher/question/update'])
  }

  quizclasschange(event) {
    this.message = "Fetching Quiz's List..."
    this.spinner = true
    if (this.ELEMENT_DATA_quiz.length !== 0) {
      this.ELEMENT_DATA_quiz = []
      this.dataSourceQuiz._updateChangeSubscription()
    }
    this.quizservice.getQuizzes(event.target.value, this.coursedata.course_code).subscribe(
      result => {
        let position = 1
        for (let data in result) {
          let quiz = result[data]
          quiz.position = position
          this.ELEMENT_DATA_quiz.push(quiz)
          position++
        }
        this.dataSourceQuiz = new MatTableDataSource(this.ELEMENT_DATA_quiz)
        this.spinner = false
      }
    )
  }

  deleteQuiz(quiz) {
    this.message = "Deleting Quiz..."
    this.spinner = true;
    this.dataSourceQuiz.data.splice(this.dataSourceQuiz.data.indexOf(quiz), 1)
    this.dataSourceQuiz._updateChangeSubscription()
    this.quizservice.deleteQuiz(quiz._id).subscribe(
      result => {
        if (result) {
          this.spinner = false;
          this.toastr.success('Successfully Deleted Quiz!', "", {
            positionClass: "toast-top-center"
          })
        }
      }
    )
  }

  detailsQuiz(quiz, modal) {
    let date = new Date(quiz.datetime)
    let strdate = date.toLocaleDateString()
    let strtime = date.toLocaleTimeString()
    this.quizData = {
      CLO: quiz.CLO,
      class_id: quiz.class_id,
      course_id: quiz.course_id,
      key: quiz.key,
      questions: quiz.questions,
      quiz_id: quiz.quiz_id,
      uploaded_by: quiz.uploaded_by,
      duration: quiz.duration,
      datetime: strdate + ",    " + strtime
    }
    this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editQuiz(quiz) {
    this.quizshare.changeData(quiz)
    this.router.navigate(['/teacher/quiz/update'])
  }



  deleteExam(exam) {
    this.message = "Deleting Exam..."
    this.spinner = true;
    this.dataSourceExam.data.splice(this.dataSourceQuiz.data.indexOf(exam), 1)
    this.dataSourceExam._updateChangeSubscription()
    this.examservice.deleteExam(exam._id).subscribe(
      result => {
        if (result) {
          this.spinner = false;
          this.toastr.success('Successfully Deleted Exam!', "", {
            positionClass: "toast-top-center"
          })
        }
      }
    )
  }

  detailsExam(exam, modal) {
    let date = new Date(exam.datetime)
    let strdate = date.toLocaleDateString()
    let strtime = date.toLocaleTimeString()
    this.examData = {
      CLO: exam.CLO,
      class_id: exam.class_id,
      course_id: exam.course_id,
      key: exam.key,
      questions: exam.questions,
      exam_id: exam.exam_id,
      uploaded_by: exam.uploaded_by,
      duration: exam.duration,
      datetime: strdate + ",   " + strtime
    }
    this.modalService.open(modal, { centered: true, windowClass: "width: 200px !important;" }).result.then((result) => {
      this.emptyDataFields();
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  editExam(exam) {
    this.examshare.changeData(exam)
    this.router.navigate(['/teacher/exam/update'])
  }


  examclasschange(event) {
    this.message = "Fetching Exam's List..."
    this.spinner = true
    if (this.ELEMENT_DATA_exam.length !== 0) {
      this.ELEMENT_DATA_exam = []
      this.dataSourceExam._updateChangeSubscription()
    }
    this.examservice.getExams(event.target.value, this.coursedata.course_code).subscribe(
      result => {
        let position = 1
        for (let data in result) {
          let exam = result[data]
          exam.position = position
          this.ELEMENT_DATA_exam.push(exam)
          position++
        }
        this.dataSourceExam = new MatTableDataSource(this.ELEMENT_DATA_exam)
        this.spinner = false
      }
    )
  }

}
