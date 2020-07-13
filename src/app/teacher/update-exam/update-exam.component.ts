import { ExamService } from './../../services/teacher-services/exam.service';
import { ExamshareService } from './../../services/teacher-services/examshare.service';
import { Component, OnInit } from '@angular/core';
import { QuestionService } from 'src/app/services/teacher-services/question.service';
import { CourseshareService } from 'src/app/services/teacher-services/courseshare.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormArray, FormGroup, FormControl, Validators, NgForm } from '@angular/forms';

@Component({
  selector: 'app-update-exam',
  templateUrl: './update-exam.component.html',
  styleUrls: ['./update-exam.component.scss']
})
export class UpdateExamComponent implements OnInit {

  constructor(
    private examshare: ExamshareService,
    private examService: ExamService,
    private questionService: QuestionService,
    private courseshare: CourseshareService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.form =  new FormGroup({
      exam_id: new FormControl('',),
      _id: new FormControl(''),
      course_id: new FormControl(''),
      class_id: new FormArray([]),
      clo: new FormArray([]),
      questions: new FormArray([]),
      uploaded_by: new FormControl(''),
      key: new FormControl('',),
      datetime: new FormControl('',),
      duration: new FormControl('',),
    })
  }
  examData
  teacher
  courseData
  step = 1
  message
  spinner
  clotoggled
  classtoggled
  date
  enableRender
  form: FormGroup
  courseIdName;

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
  get duration() {
    return this.form.get('duration')
  }
  get datetime() {
    return this.form.get('datetime')
  }

  ngOnInit() {
    this.teacher = localStorage.getItem('token')
    this.courseshare.currentData.subscribe(
      result => {
        this.courseData = result
      }
    )
    this.examshare.currentData.subscribe(
      result => {
        this.examData = result
      }
    )
    if (this.examData != "default" && this.examData != null) {
      for (let index in this.examData.questions) {
        this.questionService.getQuestion(this.examData.questions[index].id).subscribe(
          result => {
            this.examData.questions[index] = {
              question: result,
              marks: this.examData.questions[index].marks
            }
          }
        )
      }
      this.date = new Date(this.examData.datetime)
      this.form.patchValue({
        exam_id: this.examData.exam_id,
        _id: this.examData._id,
        course_id: this.courseData.course_code,
        uploaded_by: this.teacher,
        key: this.examData.key,
        duration: this.examData.duration,
        datetime: this.date
      })
      for (let clo of this.examData.CLO) {
        this.clo.push(new FormControl(clo))
      }
      for (let cls of this.examData.class_id) {
        this.class_id.push(new FormControl(cls))
      }
    }
    this.enableRender = true
  }

  toggleMarksStep(question, marks) {
    this.step++
    this.questions.push(
      new FormGroup({
        id: new FormControl(question.question._id),
        marks: new FormControl(marks)
      })
    )
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

  updateExam(data: NgForm) {
    // console data
    // var data = new Object();
// obj['course_Id'] = this.courseId;
// obj['key'] = this.key.value;
// exam_id: new FormControl('',),
// _id: new FormControl(''),
// course_id: new FormControl(''),
// class_id: new FormArray([]),
// clo: new FormArray([]),
// questions: new FormArray([]),
// uploaded_by: new FormControl(''),
// key: new FormControl('',),
// datetime: new FormControl('',),
// duration: new FormControl('',),
 
    this.message = "Updating Exam..."
    this.spinner = true
    this.examService.updateExam(data).subscribe(
      result => {
        if (result) {
          this.spinner = false
          this.toastr.success('Successfully Updated Exam!', "", {
            positionClass: "toast-top-center"
          })
          this.router.navigate(['/teacher/course_menu/course'])
        }
      }
    )
  }

}
