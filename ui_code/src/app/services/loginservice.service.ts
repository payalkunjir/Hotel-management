import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginserviceService {

  constructor(private router:Router,private httpservice:HttpService) {}

  isLoggedIn(){
    if(localStorage.getItem('token')){
     return true;
    }
    else{
      this.router.navigate(['/login']);
      return false;
    }
  }
  logOut(){
    localStorage.clear();
    this.httpservice.showHeader=false;
    this.router.navigate(['/login']);
  }
}
