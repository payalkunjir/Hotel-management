import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  showHeader:boolean=false;

  constructor(private httpclient:HttpClient) { }

  // to get the json data
  getJson(url:any){
   return this.httpclient.get(url)
  }

 // get the data from form
  getSecure(url:any){
    return this.getJson(url);
  }

  // to add the data form
  postSecured(url:any,payload:any){
    return this.httpclient.post(url,payload)
  }

  // to update the secured data
  putSecured(url:any,payload:any){
    return this.httpclient.put(url,payload)
  }

  //to update the secured data
  patchSecured(url:any,payload:any){
    return this.httpclient.patch(url,payload)
  }

  //to delete the secured data
  deleteSecured(url:any){
    return this.httpclient.delete(url)
   }

   //restore or update he data
   restoreSecured(url:any,city:any){
    return this.httpclient.put(url,city)
   }

   //to get login data
   login(url:any,user:any,pass:any){
    return this.httpclient.get(url +'/'+ user +'/'+pass)
   }

   //delete
  delete(url:any){
    return this.httpclient.delete(url)
  }
}
