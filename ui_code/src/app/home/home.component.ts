import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Iarea } from '../modules/area/area.component';
import { Ihotel } from '../modules/hotel/hotel.component';
import { HttpService } from '../services/http.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
export interface Iparticipant {
  ParticipantDetailsId?: number;
  ParticipantFirstName?: string;
  ParticipantMiddleName?: string;
  ParticipantLastName?: string;
  IdentityNo?: string;
  DesignationId?: string;
  ContactNo?: string;
  State?: string;
  GuestCategoryId?: string;
  ExpectedArrivalTime?: string;
  ExpectedDepartureTime?: string;
  CheckinTime?: string;
  CheckinDate?: string;
  CheckoutTime?: string;
  CheckoutDate?: string;
  VenueId?: string;
  HotelId?: number;
  AreaId?: number;
  AllotedRoomNo?: string;
  OccupanyType?: string;
  LOFirstName?: string;
  LOMiddleName?: string;
  LOLastName?: string;
  IdentityNoOfLO?: string;
  ContactNoOfLO?: string;
  VehicleId?: string;
  AllotedVehicle?: string;
  DriverId?: string;
};
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Areas = [
  //   {value: '0', viewValue: 'hadpsar'},
  //   {value: '1', viewValue: 'pune'},
  //   {value: '2', viewValue: 'mumbai'}
  // ];
  Adults = [
    { value: '0', viewValue: '1' },
    { value: '1', viewValue: '2' },
    { value: '2', viewValue: '3' }
  ];
  //for occupany type
  occupanyType: any[] = [
    { id: 1, value: "Single" },
    { id: 2, value: "Double" }
  ]
  areas: any = [];

  selectedAreaId: any;
  isDisabled = true;
  displayedColumns: string[] = ['Srno', 'ParticipantName', 'IdentityNo', 'DesignationId', 'ContactNo', 'State', 'GuestCategoryId', 'ExpectedArrivalTime', 'ExpectedDepartureTime', 'CheckInDate', 'CheckInTime', 'CheckOutDate', 'CheckOutTime', 'VenueId', 'HotelId', 'VehicleId', 'DriverId', 'AllotedRoomNo', 'OccupanyType', 'LOName', 'IdentityNoOfLO', 'ContactNoOfLO', 'AllotedVehicle', 'action'];
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
  getAreas: any
  getDesignations: any;
  getGuestCategories: any;
  getVenue: any;
  getHotels: any;
  getVehicles: any;
  getDrivers: any;
  AreaId: any;
  // occupanyType:any=[];
  isValid!: boolean | undefined;
  stateData: any = [];
  hotels: any = [];
  venueId: any;
  venueForm: any;
  hotelId: any;
  hotelForm: any;
  areaData: any;
  hotel: Ihotel[] = []; //pass the data through hotel

  constructor(
    private _formBuilder: FormBuilder,
    private httpservice: HttpService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.token = localStorage.getItem('token');
    const helper = new JwtHelperService();
    this.decodeToken = helper.decodeToken(this.token);
    this.participantForm.controls.AreaId.disable()
  }
  ngOnInit(): void {
    this.getAllState();
    this.getAllParticipant();
    this.getAllDriver();
    this.getAllVehicle();
    this.getAllGuestCategory();
    this.getAllDesignation();
    this.getAllVenue();
    this.getAllArea();
    this.getAllAreas();
    // this.getAllHotel();
  }
  participantForm = this._formBuilder.group({
    ParticipantFirstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    ParticipantMiddleName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    ParticipantLastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    IdentityNo: ['', [Validators.required, Validators.pattern("^(?!\')+[a-zA-Z0-9 -_\']+$"), Validators.maxLength(10), Validators.minLength(2)]],
    DesignationId: ['', [Validators.required,]],
    ContactNo: ['', [Validators.required, Validators.pattern("^^[7-9]{1}[0-9]{9}$"), Validators.maxLength(10)]],
    State: ['', [Validators.required,]],
    GuestCategoryId: ['', [Validators.required,]],
    ExpectedArrivalTime: ['', [Validators.required,]],
    ExpectedDepartureTime: ['', [Validators.required,]],
    CheckinTime: ['', [Validators.required,]],
    CheckinDate: ['', [Validators.required]],
    CheckoutTime: ['', [Validators.required]],
    CheckoutDate: ['', [Validators.required]],
    VenueId: ['', [Validators.required,]],
    AreaId: ['', [Validators.required,]],
    HotelId: ['', [Validators.required,]],
    AllotedRoomNo: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"), Validators.maxLength(15), Validators.minLength(2)]],
    OccupanyType: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(10), Validators.minLength(2)]],
    LOFirstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    LOMiddleName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    LOLastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    IdentityNoOfLO: ['', [Validators.required, Validators.pattern("^(?!\')+[a-zA-Z0-9  -_\']+$"), Validators.maxLength(10), Validators.minLength(2)]],
    ContactNoOfLO: ['', [Validators.required, Validators.pattern("^^[7-9]{1}[0-9]{9}$"), Validators.maxLength(10)]],
    VehicleId: ['', [Validators.required,]],
    AllotedVehicle: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"), Validators.maxLength(30), , Validators.minLength(2)]],
    DriverId: ['', [Validators.required]],
    // CreatedBy: ['', Validators.required],
    // ModifiedBy: ['', Validators.required],

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
  bookNow(hotelId: any) {
    this.participantForm.controls.AreaId.setValue(this.selectedAreaId);
    this.participantForm.controls.HotelId.setValue(hotelId);
  }
  participantSubmit() {
    this.participantForm.controls.AreaId.enable();
    if (this.participantForm.valid) {
      this.participantForm.controls.CheckinDate.setValue(moment(this.participantForm.controls.CheckinDate.value).format('YYYY-MM-DD HH:MM:SS'));
      this.participantForm.controls.CheckoutDate.setValue(moment(this.participantForm.controls.CheckoutDate.value).format('YYYY-MM-DD HH:MM:SS'));
      this.httpservice
        .postSecured(environment.addParticipant, this.participantForm.value)
        .subscribe(
          (res: any) => {
            if (res.success) {
              this.closeModal.nativeElement.click();
              this.participantForm.controls.AreaId.disable();
              this.getAllParticipant();
              const dialogRef = this.dialog.open(AlertDialogComponent, {
                data: { message: 'Participant added successfully!', type: 'success' }
              });
            } else {
              if (res.message.includes('ContactNo')) {
                const dialogRef = this.dialog.open(AlertDialogComponent, {
                  data: { message: 'Participant with this Contact Number already exists!', type: 'error' }
                });
              } else {
                const dialogRef = this.dialog.open(AlertDialogComponent, {
                  data: { message: 'Failed to add participant!', type: 'error' }
                });
              }
            }
            
          },
          (err: any) => {
            const dialogRef = this.dialog.open(AlertDialogComponent, {
              data: { message: 'Failed to add participant!', type: 'error' }
            });
            console.error(err);
          }
        );
    } else {
      this.participantForm.markAllAsTouched();
      this.toastr.error('Please fill out all required fields!');
    }
}
  


  getAllAreas() {
    this.httpservice.getSecure(environment.getArea).subscribe((res: any) => {
      this.areas = res.data.filter((element: any) => {
        if (element.IsDeleted == 0) { return element; };
      });
      console.log(this.getDesignations)
    });
  }
  // Get State
  getAllState() {
    this.httpservice.getJson('assets/json/state.json').subscribe((res: any) => {
      this.stateData = res;
      console.log('state data', res)
    })
  }
  // Designation name for form
  getAllDesignation() {
    this.httpservice.getSecure(environment.getDesignation).subscribe((res: any) => {
      this.getDesignations = res.data.filter((element: any) => {
        if (element.IsDeleted == 0) { return element; };
      });
      console.log(this.getDesignations)
    })
  }
  // Guest Category name for form
  getAllGuestCategory() {
    this.httpservice.getSecure(environment.getGuestCategories).subscribe((res: any) => {
      this.getGuestCategories = res.data.filter((element: any) => {
        if (element.IsDeleted == 0) { return element; };
      });
      console.log(this.getGuestCategories)
    })
  }
  //  venue name for form
  getAllVenue() {
    this.httpservice.getSecure(environment.getVenue).subscribe((res: any) => {
      this.getVenue = res.data.filter((element: any) => {
        if (element.IsDeleted == 0) { return element; };
      });
      console.log(this.getVenue)
    })
  }

  //  area name
  getAllArea() {
    this.httpservice.getSecure(environment.getArea).subscribe((res: any) => {
      this.areaData = res.data.filter((element: any) => {
        if (element.IsDeleted == 0) { return element; };
      });
      console.log(this.areaData);
    })
  }
  getAllHotelsByArea(AreaId: any) {
    let payload = { AreaId: AreaId };
    this.httpservice.postSecured(environment.getHotelsByArea, payload).subscribe((res: any) => {
      this.hotels = res.data.length > 0 ? res.data : [];
      console.log("Hotels", this.hotels);
    });
  }

  // Vehicle name for form
  getAllVehicle() {
    this.httpservice.getSecure(environment.getVehicle).subscribe((res: any) => {
      this.getVehicles = res.data.filter((element: any) => {
        if (element.IsDeleted == 0) { return element; };
      });
      console.log(this.getVehicles)
    })
  }
  // Driver name for form
  getAllDriver() {
    this.httpservice.getSecure(environment.getDriver).subscribe((res: any) => {
      this.getDrivers = res.data.filter((element: any) => {
        if (element.IsDeleted == 0) { return element; };
      });
      console.log(this.getDrivers)
    })
  }
  //hotel name for form 

  // getAllHotel() {
  //   this.httpservice.getSecure(environment.getHotel).subscribe((res: any) => {
  //     this.hotel = res.data;
  //     console.log(this.hotel)
  //     this.dataSource = new MatTableDataSource(this.hotel);
  //     this.dataSource.sort = this.sort;
  //     this.dataSource.paginator = this.paginator;
  //   });
  // }


  // get all participants
  getAllParticipant() {
    this.httpservice.getSecure(environment.getParticipant).subscribe((res: any) => {
      this.participant = res.data;
      console.log(this.participant)
      this.dataSource = new MatTableDataSource(this.participant);
      this.dataSource.sortingDataAccessor = (element: any, property) => {
        switch (property) {
          case 'ParticipantName': return element.ParticipantFirstName + " " + element.ParticipantMiddleName + " " + element.ParticipantLastName;

          default: return element[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    // this.participantForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    // this.participantForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);    
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


  // for occupancy type
  occupancyType: any[] = [
    { id: 1, value: "Single" },
    { id: 2, value: "Double" }
  ]


  //method for display error msg
  hasError(control: FormControl) {
    if (!control.touched || control.hasError('pattern')) {
      control.markAsTouched();
    }
  }

  // Get State
  getHotelsByArea() {
    let payload = { AreaId: this.selectedAreaId }
    this.httpservice.postSecured(environment.getHotelsByArea, payload).subscribe((res: any) => {
      this.hotels = res.data.filter((element: any) => {
        if (element.IsDeleted == 0) { return element; };
      });
      this.hotels.map((element:any)=>{
         element.HotelImage=element.HotelImage?environment.imageserverBaseUrl+element.HotelImage:'';

      })
      console.log(this.hotels)
    })
  }


}


