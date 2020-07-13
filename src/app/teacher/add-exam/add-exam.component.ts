import { ExamService } from './../../services/teacher-services/exam.service';
import { Component, OnInit } from '@angular/core';
import { CourseshareService } from 'src/app/services/teacher-services/courseshare.service';
import { QuestionService } from 'src/app/services/teacher-services/question.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FormArray, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.scss']
})
export class AddExamComponent implements OnInit {

  constructor(
    private courseshare: CourseshareService,
    private questionservice: QuestionService,
    private examService: ExamService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  coursedata
  teacher
  form
  clotoggled
  classtoggled
  questiontoggled
  step = 1;
  ELEMENT_DATA_question = []
  dataSourceQuestion
  displayedColumnsQuestion: string[] = ['select', 'position', 'question_text', 'type', 'topic'];
  selection = new SelectionModel<any>(true, []);
  message
  spinner = false
  selectedQuestions = []

  get clo() {
    return this.form.get('clo') as FormArray
  }
  get class_id() {
    return this.form.get('class_id') as FormArray
  }
  get questions() {
    return this.form.get('questions') as FormArray
  }
  get exam_id() {
    return this.form.get('exam_id')
  }
  get key() {
    return this.form.get('key')
  }
  get datetime() {
    return this.form.get('datetime')
  }
  get duration() {
    return this.form.get('duration')
  }


  ngOnInit() {
    this.message = "Fetching List..."
    this.spinner = true
    this.courseshare.currentData.subscribe(
      result => {
        this.coursedata = result
      }
    ).add(
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
          setTimeout(() => {
            this.dataSourceQuestion = new MatTableDataSource(this.ELEMENT_DATA_question)
            this.spinner = false
          }, 1000)
        }
      )
    )
    this.teacher = localStorage.getItem('token')
    this.form = new FormGroup({
      exam_id: new FormControl('', [Validators.required]),
      course_id: new FormControl(this.coursedata.course_code),
      class_id: new FormArray([], Validators.required),
      clo: new FormArray([], Validators.required),
      questions: new FormArray([], Validators.required),
      uploaded_by: new FormControl(this.teacher),
      datetime: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      key: new FormControl('', Validators.required)
    })
  }

  onCloCheck(event) {
    this.clotoggled = true
    if (event.checked) {
      this.clo.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for (let control of this.clo.controls) {
        if (control.value == event.source.value) {
          this.clo.removeAt(this.clo.controls.indexOf(control))
        }
      }
    }
  }

  onClassCheck(event) {
    this.classtoggled = true
    if (event.checked) {
      this.class_id.push(
        new FormControl(event.source.value)
      )
    }
    else {
      for (let control of this.class_id.controls) {
        if (control.value == event.source.value) {
          this.class_id.removeAt(this.class_id.controls.indexOf(control))
        }
      }
    }
  }

  toggleQuestion(event, row) {
    this.questiontoggled = true
    if (event) {
      this.selection.toggle(row)
    }
    else {
      null
    }
  }

  addExam(data: NgForm) {
    this.message = "Adding Exam..."
    this.spinner = true
    this.examService.addExam(data).subscribe(
      result => {
        if (result) {
          this.spinner = false
          this.toastr.success('Successfully Added Exam!', "", {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['/teacher/course_menu/course'])
        }
      }
    )
  }

  toggleSelectStep() {
    this.step++
    for (let obj of this.selection.selected) {
      this.selectedQuestions.push(obj)
    }
  }

  toggleMarksStep(question, marks) {
    this.questions.push(
      new FormControl({
        id: question._id,
        marks: marks
      })
    )
    this.step++
  }


}
