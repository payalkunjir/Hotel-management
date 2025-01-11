import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginserviceService } from './services/loginservice.service';
import { catchError } from "rxjs/operators";

@Injectable()
export class ExampleInterceptorInterceptor implements HttpInterceptor {

  constructor(private loginservice:LoginserviceService,private router: Router) {}

  addAuthenticationToken(request: HttpRequest<any>) {
    const accessToken = localStorage.getItem('token');

    if (!accessToken) {
        return request;
    }
    // if (request.url.includes('http://localhost:2208/')
    //  ) {
    //     let access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySWQiOjIsIlVzZXJGaXJzdE5hbWUiOiJBc2hvayIsIlVzZXJNaWRkbGVOYW1lIjoiIiwiVXNlckxhc3ROYW1lIjoiS2F3YWxlIiwiVXNlckVtYWlsIjoiYXNob2sua2F3YWxlQHRlY2hub2dyb3d0aC5jb20iLCJJc0RlbGV0ZWQiOjAsImlhdCI6MTY3NzA4NTQwNiwiZXhwIjoxNjc3MDg3ODA2fQ.Gvr2ZlelTjpqvROMYRZYE5sJbN2IJnAiN_rkBhTUiPw";
    //     return request.clone({
    //         headers: request.headers.set("authorization", access_token)
    //     });
    // }
    return request.clone({
        headers: request.headers.set("Authorization", "Bearer" + accessToken)
    });
}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    req = this.addAuthenticationToken(req);
   console.log("interceptor call" )
    return next.handle(req).pipe(
        catchError((err:any) => {
            console.log("ExampleInterceptorInterceptor");
            console.log(err);
            return throwError(err);  // This method return error to the component method
            // return of(err);
        })
    );




}
}
