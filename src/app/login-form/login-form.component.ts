import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsernameValidators } from '../validators/username.validators';
import { PasswordValidators } from '../validators/password.validators';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  ngOnInit(){
    
  }

  invalidLogin: Boolean;

  constructor(private router: Router,
    private authService: AuthService) {

  }
  form = new FormGroup({
    username: new FormControl('', [
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
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  get role() {
    return this.form.get('role');
  }

  signin(credentials) {
    console.log(credentials.role);
    
    if(credentials.role=="Admin"){
      this.authService.login(credentials)
      .subscribe(result => {
        if (result) {
          this.router.navigateByUrl("admin");
        }
        else {
          this.invalidLogin = true;
        }
      }
      );    
    }
    if(credentials.role=="Student"){
      
    }
    if(credentials.role=="Teacher"){
      
    }
  }

  signout(){
    this.authService.logout;
  }

}
