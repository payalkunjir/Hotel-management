import { Component, ElementRef } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

import * as moment from 'moment';
import Swal from 'sweetalert2';
// NgxMaterialTimepickerModule

export interface Iparticipant {


  ParticipantDetailsId?:number;
  ParticipantFirstName?:string;
  ParticipantMiddleName?:string;
  ParticipantLastName?:string;
  IdentityNo?:string;
  DesignationId?:string;
  ContactNo?:string;
  State?:string;
  GuestCategoryId?:string;
  ExpectedArrivalTime?:string;
  ExpectedDepartureTime?:string;
  CheckinTime?:string;
  CheckinDate?:string;
  CheckoutTime?:string;
  CheckoutDate?:string;
  VenueId?:string;
  AreaId?:string;
  HotelId?:string;
  AllotedRoomNo?:string;
  OccupanyType?:string;
  LOFirstName?:string;
  LOMiddleName?:string;
  LOLastName?:string;
  IdentityNoOfLO?:string;
  ContactNoOfLO?:string;
  VehicleId?:string;
  AllotedVehicle?:string;
  DriverId?:string;


}

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent {
  displayedColumns: string[] = ['Srno', 'ParticipantName','IdentityNo','DesignationId','ContactNo','State','GuestCategoryId','ExpectedArrivalTime','ExpectedDepartureTime','CheckInDate','CheckInTime','CheckOutDate','CheckOutTime','VenueId','HotelId','VehicleId','DriverId','AllotedRoomNo','OccupanyType','LOName','IdentityNoOfLO','ContactNoOfLO','AllotedVehicle','action'];
  dataSource = new MatTableDataSource<Iparticipant>();
  public date: Date = new Date();
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  decodeToken: any;
  token: any;
  participant: Iparticipant[] = []; //pass the data through participant
  isUpdate = false;
  participantId: any;
  getAreas:any
  getDesignations:any;
  getGuestCategories:any;
  getVenue:any;
  hotels: any=[];
  areaData:any;
  getHotels:any;
  getVehicles:any;
  getDrivers:any;
  AreaId:any;
  // occupanyType:any=[];
  isValid!:boolean | undefined;
  stateData:any=[];

  constructor(
    private _formBuilder: FormBuilder,
    private httpservice: HttpService,
    private toastr: ToastrService
  ) {
    this.token = localStorage.getItem('token');
    const helper = new JwtHelperService();
    this.decodeToken = helper.decodeToken(this.token);
  }

  ngOnInit(): void {
    this.getAllState();
    this.getAllParticipant();
    this.getAllDriver();
    this.getAllVehicle();
    this.getAllGuestCategory();
    this.getAllHotel();
    this.getAllDesignation();
    this.getAllVenue();
    this.getAllArea();



  }
  participantForm = this._formBuilder.group({
    ParticipantFirstName: ['',[Validators.required, Validators.pattern("^[a-zA-Z]*$"),Validators.maxLength(15),Validators.minLength(2) ]],
    ParticipantMiddleName: ['',[Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15),Validators.minLength(2)]],
    ParticipantLastName: ['',[Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15),Validators.minLength(2)]],
    IdentityNo: ['',[Validators.required, Validators.pattern("^(?!\')+[a-zA-Z0-9 -_\']+$"), Validators.maxLength(10),Validators.minLength(2)]],
    DesignationId: ['',[Validators.required,]],
    ContactNo: ['',[Validators.required, Validators.pattern("^^[7-9]{1}[0-9]{9}$"), Validators.maxLength(10)]],
    State: ['',[Validators.required,]],
    GuestCategoryId: ['',[Validators.required, ]],
    ExpectedArrivalTime: ['',[Validators.required,]],
    ExpectedDepartureTime: ['',[Validators.required,]],
    CheckinTime: ['',[Validators.required,]],
    CheckinDate: ['',[Validators.required]],
    CheckoutTime: ['',[Validators.required]],
    CheckoutDate: ['',[Validators.required]],
    VenueId: ['',[Validators.required,]],
    AreaId:['',[Validators.required]],
    HotelId: ['',[Validators.required,]],
    AllotedRoomNo: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"), Validators.maxLength(15),Validators.minLength(2)]],
    OccupanyType: ['',[Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(10),Validators.minLength(2)]],
    LOFirstName: ['',[Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15),Validators.minLength(2)]],
    LOMiddleName: ['',[Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15),Validators.minLength(2)]],
    LOLastName: ['',[Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15),Validators.minLength(2)]],
    IdentityNoOfLO: ['',[Validators.required, Validators.pattern("^(?!\')+[a-zA-Z0-9  -_\']+$"), Validators.maxLength(10),Validators.minLength(2)]],
    ContactNoOfLO: ['',[Validators.required, Validators.pattern("^[7-9]{1}[0-9]{9}$"), Validators.maxLength(10)]],
    VehicleId: ['',[Validators.required,]],
    AllotedVehicle: ['',[Validators.required,Validators.pattern("^[a-zA-Z0-9 \s-]+$"), Validators.maxLength(30),,Validators.minLength(2)]],
    DriverId: ['',[Validators.required]],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],

  });

  // method for for error
  ishotelFormFieldValid(field: string) {
     this.isValid = (
      (!this.participantForm.get(field)?.valid && this.participantForm.get(field)?.touched) ||
      this.participantForm.get(field)?.untouched
    );
    return this.isValid
  }

  get hotelFormFieldValid() {
    return this.participantForm.controls;
  }

  participantSubmit() {
    if (this.participantForm.valid) {
      this.participantForm.controls.CheckinDate.setValue(moment(this.participantForm.controls.CheckinDate.value).format('YYYY-MM-DD HH:MM:SS'));
      this.participantForm.controls.CheckoutDate.setValue(moment(this.participantForm.controls.CheckoutDate.value).format('YYYY-MM-DD HH:MM:SS'));
      this.httpservice
        .postSecured(environment.addParticipant, this.participantForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.getAllParticipant();
            this.toastr.success('Participant added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }
        });
    } else {
      this.participantForm.markAllAsTouched();
    }
  }

  // Get State
  getAllState(){
    this.httpservice.getJson('assets/json/state.json').subscribe((res:any)=>{
      this.stateData=res;
     console.log('state data', res)
    })
   }

  // Designation name
  getAllDesignation(){
    this.httpservice.getSecure(environment.getDesignation).subscribe((res:any)=>{
     this.getDesignations=res.data.filter((element:any) => {
       if(element.IsDeleted == 0){ return element;};
     });
     console.log(this.getDesignations)
    })
   }

  // Guest Category name
  getAllGuestCategory(){
    this.httpservice.getSecure(environment.getGuestCategories).subscribe((res:any)=>{
     this.getGuestCategories=res.data.filter((element:any) => {
       if(element.IsDeleted == 0){ return element;};
     });
     console.log(this.getGuestCategories)
    })
   }

  //  venue name
  getAllVenue(){
    this.httpservice.getSecure(environment.getVenue).subscribe((res:any)=>{
      this.getVenue=res.data.filter((element:any) => {
        if(element.IsDeleted == 0){ return element;};
      });
      console.log(this.getVenue)
     })
  }
   //  area name
  getAllArea(){
    this.httpservice.getSecure(environment.getArea).subscribe((res:any)=>{
     this.areaData=res.data.filter((element:any) => {
       if(element.IsDeleted == 0){ return element;};
     });
     console.log(this.areaData);
    })
   }


  getAllHotelsByArea(AreaId:any){
    let payload = {AreaId:AreaId};
    this.httpservice.postSecured(environment.getHotelsByArea, payload).subscribe((res: any) => {
      this.hotels = res.data.length > 0 ? res.data:[];
      console.log("Hotels",this.hotels);
    });
  }
    // Hotel name
   getAllHotel(){
    this.httpservice.getSecure(environment.getHotel).subscribe((res:any)=>{
     this.getHotels=res.data.filter((element:any) => {
       if(element.IsDeleted == 0){ return element;};
     });
     console.log(this.getHotels)
    })
   }

   // Vehicle name
  getAllVehicle(){
   this.httpservice.getSecure(environment.getVehicle).subscribe((res:any)=>{
    this.getVehicles=res.data.filter((element:any) => {
      if(element.IsDeleted == 0){ return element;};
    });
    console.log(this.getVehicles)
   })
  }

// Driver name
  getAllDriver(){
   this.httpservice.getSecure(environment.getDriver).subscribe((res:any)=>{
    this.getDrivers=res.data.filter((element:any) => {
      if(element.IsDeleted == 0){ return element;};
    });
    console.log(this.getDrivers)
   })
  }

// get all participants
  getAllParticipant() {
    this.httpservice.getSecure(environment.getParticipant).subscribe((res: any) => {
      this.participant = res.data;
      console.log(this.participant)
      this.dataSource = new MatTableDataSource(this.participant);
      this.dataSource.sortingDataAccessor = (element:any, property) => {
        switch(property) {
          case 'ParticipantName': return element.ParticipantFirstName +" "+element.ParticipantMiddleName+" "+element.ParticipantLastName;

          default: return element[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    this.participantForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.participantForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
  }

  close() {
    this.isUpdate = false;
    this.participantForm.reset();
  }

  updateParticipant(data: any) {
    this.isUpdate = true;
    this.participantId = data.ParticipantDetailsId; //{id}  store
    this.participantForm.patchValue(data);
    console.log(data)
  }

  updateParticipantData() {
    if(this.participantForm.valid)
    {
      this.participantForm.controls.CheckinDate.setValue(moment(this.participantForm.controls.CheckinDate.value).format('YYYY-MM-DD HH:MM:SS'));
    this.participantForm.controls.CheckoutDate.setValue(moment(this.participantForm.controls.CheckoutDate.value).format('YYYY-MM-DD HH:MM:SS'));
    this.httpservice.putSecured(environment.updateParticipant.replace('{id}', this.participantId),this.participantForm.value).subscribe((res:any) => {
        if (res.success) {
          this.closeModal.nativeElement.click();
          this.getAllParticipant();
          this.toastr.success('Participant updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else
    {
      this.participantForm.markAllAsTouched();
    }
  }

  deleteParticipant(element: any, status:any, msg:any){
    let payload = { IsDeleted : !element.IsDeleted,ModifiedBy: this.decodeToken.UserId };
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to "+msg+" this participant",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:"No"
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpservice.postSecured(environment.deleteParticipant.replace('{id}',element.ParticipantDetailsId), payload).subscribe((result:any) => {
        if (result.success) {
          this.getAllParticipant();

          status == 0? this.toastr.error('Participant deleted sucessfully!'):this.toastr.success('Participant restore sucessfully!');
        } else {
          this.toastr.error(status == 0? 'Participant not deleted!':'Participant not restore!');
        }
      })
    }
  })
}
// for occupancy type
occupancyType:any[]=[
  {id:1, value:"Single"},
  {id:2, value:"Double"}
]
  // for search box
  Filterchange(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //method for display error msg
  hasError(control: FormControl) {
    if(!control.touched || control.hasError('pattern')){
      control.markAsTouched();
    }
  }

}
