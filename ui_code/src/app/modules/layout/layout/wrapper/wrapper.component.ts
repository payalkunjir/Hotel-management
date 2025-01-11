import { Component,ChangeDetectorRef } from '@angular/core';
import { MenuItems } from 'src/menu-items/menu_items';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.css']
})
export class WrapperComponent {
  sideBarOpen=true;

  sideBarToggler(){
    this.sideBarOpen= !this.sideBarOpen
  }

  constructor(
  public menuItems: MenuItems,
    private httpService:HttpService
  ) {
    this.httpService.showHeader=true;

  }

  ngOnDestroy(): void {

  }
}

