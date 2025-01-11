import { Component,ElementRef } from '@angular/core';
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

export interface IDesignation {
  DesignationId?: number;
  DesignationName?: string;
  DesignationCode?: string;
}

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css']
})
export class DesignationComponent  implements OnInit{
  displayedColumns: string[] = ['DesignationId', 'DesignationName', 'DesignationCode', 'action'];
  dataSource = new MatTableDataSource<IDesignation>();

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild(MatSort,{static:true}) sort!: MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator!:MatPaginator;

  decodeToken: any;
  token: any;
  designation: IDesignation[] = []; //pass the data through designation in table
  isUpdate = false;
  designationId: any;
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
    this.getAllDesignation();
  }
  // form  ^(?!\')+[a-zA-Z &@#\']+$'
  designationForm = this._formBuilder.group({
    DesignationName: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"),Validators.maxLength(30),Validators.minLength(2) ]],
    DesignationCode: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9\s-]+$"), Validators.maxLength(10),Validators.minLength(2)]],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],
  });

  // method for for error
  isdesignationFormFieldValid(field: string) {
     this.isValid = (
      (!this.designationForm.get(field)?.valid && this.designationForm.get(field)?.touched) ||
      this.designationForm.get(field)?.untouched
    );
    return this.isValid
  }
  get designationFormFieldValid() {
    return this.designationForm.controls;
  }

  designationSubmit() {
    if (this.designationForm.valid) {
      this.httpservice
        .postSecured(environment.addDesignation, this.designationForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.getAllDesignation();
            this.toastr.success('Designation added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }

        });
    } else {
      this.designationForm.markAllAsTouched();
    }
  }

  getAllDesignation() {
    this.httpservice.getSecure(environment.getDesignation).subscribe((res: any) => {
      this.designation = res.data;
      this.dataSource = new MatTableDataSource(this.designation);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    this.designationForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.designationForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
  }

  close() {
    this.isUpdate = false;
    this.designationForm.reset();
  }

  updateDesignation(data: any) {
    this.isUpdate = true;
    this.designationId = data.DesignationId; //{id}  store
    this.designationForm.patchValue(data);
  }
  updateDesignationData() {
    if(this.designationForm.valid)
    {
    this.httpservice.putSecured(environment.updateDesignation.replace('{id}', this.designationId),this.designationForm.value).subscribe((res:any) => {
        if (res.success) {
          this.closeModal.nativeElement.click();
          this.getAllDesignation();
          this.toastr.success('Area updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else
    {
      this.designationForm.markAllAsTouched();
    }
  }

  deleteDesignation(element: any, status:any, msg:any){
    let payload = { IsDeleted : !element.IsDeleted,ModifiedBy: this.decodeToken.UserId };
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to "+msg+" this designation",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:"No"
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpservice.postSecured(environment.deleteDesignation.replace('{id}', element.DesignationId), payload).subscribe((result:any) => {
        if (result.success) {
          this.getAllDesignation();
          status == 0? this.toastr.error('Designation deleted sucessfully!'):this.toastr.success('Designation restored sucessfully!');
        } else {
          this.toastr.error(status == 0? 'Designation not deleted!':'Designation not restore!');
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
