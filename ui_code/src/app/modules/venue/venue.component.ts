
import { Component, ElementRef } from '@angular/core';
import { OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import Swal from 'sweetalert2';

export interface Ivenue {
    VenueId:number;
    VenueName:string;
    VenueCode:string;
}
@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent {
  displayedColumns: string[] = ['VenueId', 'VenueName', 'VenueCode', 'action'];
  dataSource = new MatTableDataSource<Ivenue>();

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  decodeToken: any;
  token: any;
  venue: Ivenue[] = []; //pass the data through venue
  isUpdate = false;
  venueId: any;
  isValid!:boolean | undefined;

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
    this.getAllVenue();
  }
  // form  ^(?!\')+[a-zA-Z &@#\']+$'
  venueForm = this._formBuilder.group({
    VenueName: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"),Validators.maxLength(30),Validators.minLength(2) ]],
    VenueCode: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"), Validators.maxLength(10),Validators.minLength(2)]],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],
  });

  // method for for error
  isvenueFormFieldValid(field: string) {
     this.isValid = (
      (!this.venueForm.get(field)?.valid && this.venueForm.get(field)?.touched) ||
      this.venueForm.get(field)?.untouched
    );
    return this.isValid
  }
  get venueFormFieldValid() {
    return this.venueForm.controls;
  }

  venueSubmit() {
    if (this.venueForm.valid) {
      this.httpservice
        .postSecured(environment.addVenue, this.venueForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.getAllVenue();
            this.toastr.success('Area added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }

        });
    } else {
      this.venueForm.markAllAsTouched();
    }
  }

  getAllVenue() {
    this.httpservice.getSecure(environment.getVenue).subscribe((res: any) => {
      this.venue = res.data;
      this.dataSource = new MatTableDataSource(this.venue);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    this.venueForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.venueForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
  }

  close() {
    this.isUpdate = false;
    this.venueForm.reset();
  }

  updateVenue(data: any) {
    this.isUpdate = true;
    this.venueId = data.VenueId; //{id}  store
    this.venueForm.patchValue(data);
  }

  updateVenueData() {
    if(this.venueForm.valid)
    {
    this.httpservice.putSecured(environment.updateVenue.replace('{id}', this.venueId),this.venueForm.value).subscribe((res:any) => {
        if (res.success) {

          this.closeModal.nativeElement.click();
          this.getAllVenue();
          this.toastr.success('Area updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else
    {
      this.venueForm.markAllAsTouched();
    }
  }

  deleteVenue(element: any, status:any, msg:any){
    let payload = { IsDeleted : !element.IsDeleted,ModifiedBy: this.decodeToken.UserId };
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to "+msg+" this venue",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:"No"
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpservice.postSecured(environment.deleteVenue.replace('{id}', element.VenueId), payload).subscribe((result:any) => {
        if (result.success) {
          this.getAllVenue();

          status == 0? this.toastr.error('Area deleted sucessfully!'):this.toastr.success('Area restore sucessfully!');
        } else {
          this.toastr.error(status == 0? 'Area not deleted!':'Area not restore!');
        }
      })
    }
  })
}


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
