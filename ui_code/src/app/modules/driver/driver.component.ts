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

export interface IDriver {
  DriverId?: number;
  DriverName?: string;
  DriverCode?: string;
  DriverNumber?:string;
}

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent {
  displayedColumns: string[] = ['DriverId', 'DriverName', 'DriverCode','DriverNumber', 'action'];
  dataSource = new MatTableDataSource<IDriver>();

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  decodeToken: any;
  token: any;
  Driver: IDriver[] = []; //pass the data through Driver
  isUpdate = false;
  isValid!:boolean | undefined;
  driverId: any;

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
    this.getAllDriver();
  }
  // form  ^(?!\')+[a-zA-Z &@#\']+$'
  DriverForm = this._formBuilder.group({
    DriverName: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"),Validators.maxLength(30),Validators.minLength(2) ]],
    DriverCode: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9\s-]+$"), Validators.maxLength(10),Validators.minLength(2)]],
    DriverNumber:['',[Validators.required,Validators.pattern("^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$"),Validators.maxLength(20),Validators.minLength(2)]],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],
  });

  // method for for error
  isDriverFormFieldValid(field: string) {
     this.isValid = (
      (!this.DriverForm.get(field)?.valid && this.DriverForm.get(field)?.touched) ||
      this.DriverForm.get(field)?.untouched
    );
    return this.isValid
  }
  get DriverFormFieldValid() {
    return this.DriverForm.controls;
  }

  DriverSumbit() {
    if (this.DriverForm.valid) {
      this.httpservice
        .postSecured(environment.addDriver, this.DriverForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.getAllDriver();
            this.toastr.success('Driver added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }

        });
    } else {
      this.DriverForm.markAllAsTouched();
    }
  }

  getAllDriver() {
    this.httpservice.getSecure(environment.getDriver).subscribe((res: any) => {
      this.Driver = res.data;
      this.dataSource = new MatTableDataSource(this.Driver);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    this.DriverForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.DriverForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
  }

  close() {
    this.isUpdate = false;
    this.DriverForm.reset();
  }

  updateDriver(data: any) {
    this.isUpdate = true;
    this.driverId = data.DriverId; //{id}  store
    this.DriverForm.patchValue(data);
  }

  updateDriverData() {
    if(this.DriverForm.valid)
    {
    this.httpservice.putSecured(environment.updateDriver.replace('{id}', this.driverId),this.DriverForm.value).subscribe((res:any) => {
        if (res.success) {
          this.closeModal.nativeElement.click();
          this.getAllDriver();
          this.toastr.success('Driver updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else
    {
      this.DriverForm.markAllAsTouched();
    }
  }

  deleteDriver(element: any, status:any, msg:any){
    let payload = { IsDeleted : !element.IsDeleted,ModifiedBy: this.decodeToken.UserId };
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to "+msg+" this driver",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:"No"
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpservice.postSecured(environment.deleteDriver.replace('{id}', element.DriverId), payload).subscribe((result:any) => {
        if (result.success) {
          this.getAllDriver();

          status == 0? this.toastr.error('Driver deleted sucessfully!'):this.toastr.success('Driver restore sucessfully!');
        } else {
          this.toastr.error(status == 0? 'Driver not deleted!':'Driver not restore!');
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
