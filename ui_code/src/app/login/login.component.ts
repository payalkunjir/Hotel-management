import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { LoginserviceService } from '../services/loginservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  title = 'login';
  showpassword = false;
  isUpdate=false;
  loginform = new FormGroup({
    Username: new FormControl('', [Validators.required,Validators.maxLength(40),Validators.minLength(6)]),
    Password: new FormControl('', [Validators.required,Validators.maxLength(40),Validators.minLength(4)]),
  });
  loginStatus: boolean = false;

  constructor(
    private router: Router,
    private httpservice: HttpService,
    private toastr: ToastrService,
    private loginService:LoginserviceService
  ) {

  }
  toggleShow() {
    this.showpassword = !this.showpassword;
  }
  login() {
    if (this.loginform.valid){
      this.httpservice
      .postSecured(environment.login, this.loginform.value).subscribe((res: any) => {
        console.log(res);
        if (res.success) {
          this.toastr.success('Login Success');
          // this.loginStatus = true;
          // localStorage.setItem('loginStatus', JSON.stringify(this.loginStatus));
          localStorage.setItem('token', res.token);
          this.httpservice.showHeader = true;
          this.router.navigate(['/modules/dashboard']);
        } else {
          this.toastr.error('Login Failed');
        }
      })
    }else{
      this.loginform.markAllAsTouched()
    };
  }
  ngOnInit(): void {
    this.isLoggedInUser();
  }

  isLoggedInUser(){
    console.log("loged in user",this.loginService.isLoggedIn())
  if(this.loginService.isLoggedIn()){
    this.router.navigate(['/modules'])
  }
  }
  close() {
    this.loginform.reset();
  }
}
