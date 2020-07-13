import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsernameValidators } from '../validators/username.validators';
import { PasswordValidators } from '../validators/password.validators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  spinner: boolean = false;
  message = "Signing In..";
  ngOnInit() {

  }

  invalidLogin: Boolean;

  constructor(private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {

  }


  form = new FormGroup({
    user_id: new FormControl('', [
      Validators.required,
      UsernameValidators.cannotContainSpace,
    ]),
    password: new FormControl('', [
      Validators.required,
      PasswordValidators.cannotContainSpace,
    ]),
    role: new FormControl('', [
      Validators.required,
    ])
  });



  get username() {
    return this.form.get('user_id');
  }

  get password() {
    return this.form.get('password');
  }

  get role() {
    return this.form.get('role');
  }

  signin(credentials) {
    this.spinner = true;
    if (credentials.role == "Admin") {
      this.authService.login(credentials)
        .subscribe(result => {
          if (result) {
            this.router.navigate(["admin"]);
            this.toastr.success('Successfully Logged In!', "", {
              positionClass: "toast-top-center"
            })
            this.spinner = false;
          }
          else {
            this.invalidLogin = true;
            this.spinner = false;

          }
        }
        );
    }
    if (credentials.role == "Student") {
      this.authService.login(credentials)
        .subscribe(result => {
          if (result) {
            this.router.navigate(["student"]);
            this.spinner = false;
            this.toastr.success('Successfully Logged In!', "", {
              positionClass: "toast-top-center"
            })

          }
          else {
            this.invalidLogin = true;
            this.spinner = false;

          }
        }
        );
    }
    if (credentials.role == "Teacher") {
      this.authService.login(credentials)
        .subscribe(result => {
          if (result) {
            this.router.navigate(["teacher"]);
            this.spinner = false;
            this.toastr.success('Successfully Logged In!', "", {
              positionClass: "toast-top-center"
            })

          }
          else {
            this.invalidLogin = true;
            this.spinner = false;

          }
        }
        );
    }
  }

  signout() {
    this.authService.logout;
  }

}
