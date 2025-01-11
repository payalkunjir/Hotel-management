import { Component,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../../services/http.service';
import { LoginserviceService } from '../../../../services/loginservice.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output()toggleSidebarForMe:EventEmitter<any>=new EventEmitter
  constructor(private router:Router,private httpservice:HttpService){

  }
  ngOnInit(): void {

  }
  toggleSidebar(){
    this.toggleSidebarForMe.emit(null);
  }
  logOut(){
    localStorage.clear();
    this.httpservice.showHeader=false;
    // this.toggleSidebar();
    this.router.navigate(['/login']);
  }
}
