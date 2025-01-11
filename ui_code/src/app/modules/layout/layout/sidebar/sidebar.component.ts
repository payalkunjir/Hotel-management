import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { MenuItems } from 'src/menu-items/menu_items';           //sidebar items

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  decodeToken: any;
  token: any;
  userData:any;
  defaultUserImage='../../../../../assets/images/blank-profile-picture-973460__340.webp';


  constructor(public menuItems: MenuItems, private _http:HttpService){
    this.token = localStorage.getItem('token');
    const helper = new JwtHelperService();
    this.decodeToken = helper.decodeToken(this.token);
    this.getUserImage( this.decodeToken.UserId)
  }

  getUserImage(id :any){
   this._http.getSecure(environment.updateUser.replace('{id}', id)).subscribe((res:any)=>{
   this.userData=res.data
   this.userData.ProfilePicture = this.userData.ProfilePicture? environment.imageserverBaseUrl + this.userData.ProfilePicture:null;
   console.log("user image ",this.userData)
 })}

}
