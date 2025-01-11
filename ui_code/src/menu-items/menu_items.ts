
import { state } from "@angular/animations";
import { Injectable } from "@angular/core";

export interface Menu{
  state:string;
  type:string;
  icon:string;
  name:string;
}
const MENUITEMS=[
  // {state:'dashboard',name:'Dashboard',type:'link',icon:'dashboard'},
  {state:'area',name:'Area',type:'link',icon:'pin_drop'},
  {state:'designation',name:'Designation',type:'link',icon:'contact_page'},
  {state:'driver',name:'Driver',type:'link',icon:'engineering'},
  {state:'guest_category',name:'Guest Category',type:'link',icon:'person_pin'},
  {state:'hotel',name:'Hotel',type:'link',icon:'location_city'},
  {state:'venue',name:'Venue',type:'link',icon:'location_on'},
  {state:'vehicle',name:'Vehicle',type:'link',icon:'directions_car'},
  {state:'user',name:'User',type:'link',icon:'account_circle'},
  {state:'participant',name:'Participant',type:'link',icon:'groups'},
  {state:'reports',name:'Reports',type:'link',icon:'description'}
];



@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}

