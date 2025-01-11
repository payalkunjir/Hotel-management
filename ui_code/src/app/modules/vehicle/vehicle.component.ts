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

export interface IVehicle {
  VehicleId?: number;
  NameOfVehicle?: string;
  TypeOfVehicle?: string;
  VehicleNo?:string;
}



@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent {
  displayedColumns: string[] = ['VehicleId', 'NameOfVehicle', 'TypeOfVehicle','VehicleNo', 'action'];
  dataSource = new MatTableDataSource<IVehicle>();

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  decodeToken: any;
  token: any;
  vehicle: IVehicle[] = []; //pass the data through Vehicle
  isUpdate = false;
  isValid!:boolean | undefined;
  vehicleId: any;

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
    this.getAllVehicle();
  }

  VehicleForm = this._formBuilder.group({
    NameOfVehicle: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"),Validators.maxLength(30) ,Validators.minLength(2)]],
    TypeOfVehicle: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"), Validators.maxLength(10),Validators.minLength(2)]],
    VehicleNo:['',[Validators.required,Validators.pattern("^[A-Z]{2}[ -][0-9]{1,2}(?: [A-Z])?(?: [A-Z]*)? [0-9]{4}$"),Validators.maxLength(20),Validators.minLength(2)]],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],
  });

  // method for for error
  isVehicleFormFieldValid(field: string) {
     this.isValid = (
      (!this.VehicleForm.get(field)?.valid && this.VehicleForm.get(field)?.touched) ||
      this.VehicleForm.get(field)?.untouched
    );
    return this.isValid
  }

  get VehicleFormFieldValid() {
    return this.VehicleForm.controls;
  }

  vehicleSumbit() {
    if (this.VehicleForm.valid) {
      this.httpservice
        .postSecured(environment.addVehicle, this.VehicleForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.getAllVehicle();
            this.toastr.success('Vehicle added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }
        });
    } else {
      this.VehicleForm.markAllAsTouched();
    }
  }

  getAllVehicle() {
    this.httpservice.getSecure(environment.getVehicle).subscribe((res: any) => {
      this.vehicle = res.data;
      this.dataSource = new MatTableDataSource(this.vehicle);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    this.VehicleForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.VehicleForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
  }

  close() {
    this.isUpdate = false;
    this.VehicleForm.reset();
  }

  updateVehicle(data: any) {
    this.isUpdate = true;
    this.vehicleId = data.VehicleId; //{id}  store
    this.VehicleForm.patchValue(data);
  }

  updateVehicleData() {
    if(this.VehicleForm.valid)
    {
    this.httpservice.putSecured(environment.updateVehicle.replace('{id}', this.vehicleId),this.VehicleForm.value).subscribe((res:any) => {
        if (res.success) {
          this.closeModal.nativeElement.click();
          this.getAllVehicle();
          this.toastr.success('Vehicle updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else
    {
      this.VehicleForm.markAllAsTouched();
    }
  }

  deleteVehicle(element: any, status:any, msg:any){
    let payload = { IsDeleted : !element.IsDeleted,ModifiedBy: this.decodeToken.UserId };
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to "+msg+" this Vehicle",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:"No"
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpservice.postSecured(environment.deleteVehicle.replace('{id}', element.VehicleId), payload).subscribe((result:any) => {
        if (result.success) {
          this.getAllVehicle();

          status == 0? this.toastr.error('Vehicle deleted sucessfully!'):this.toastr.success('Vehicle restore sucessfully!');
        } else {
          this.toastr.error(status == 0? 'Vehicle not deleted!':'Vehicle not restore!');
        }
      })
    }
  })
}

  // for search box
  filterchange(event: any) {
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
