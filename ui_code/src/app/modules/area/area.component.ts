import { Component, ElementRef } from '@angular/core';
import { OnInit, ViewChild, } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatTableDataSource } from '@angular/material/table';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { MatPaginator,  } from '@angular/material/paginator';
import { MatSort ,Sort} from '@angular/material/sort';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

export interface Iarea {
  AreaId?: number;
  AreaName?: string;
  AreaCode?: string;
}

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class AreaComponent implements OnInit {
  displayedColumns: string[] = ['AreaId', 'AreaName', 'AreaCode', 'action'];
  dataSource = new MatTableDataSource<Iarea>();

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild(MatSort,{static:true}) sort!: MatSort;
  @ViewChild(MatPaginator,{static:true}) paginator!:MatPaginator;

  decodeToken: any;
  token: any;
  area: Iarea[] = []; //pass the data through area
  isUpdate = false;
  areaId: any;
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
    this.getAllArea();
  }
  // form  ^(?!\')+[a-zA-Z &@#\']+$'
  areaForm = this._formBuilder.group({
    AreaName: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 ,\s-]+$"),Validators.maxLength(30) ,Validators.minLength(2) ]],
    AreaCode: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9\s-]+$"), Validators.maxLength(10),Validators.minLength(2)]],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],
  });

  // method for for error
  isareaFormFieldValid(field: string) {
     this.isValid = (
      (!this.areaForm.get(field)?.valid && this.areaForm.get(field)?.touched) ||
      this.areaForm.get(field)?.untouched
    );
    return this.isValid
  }
  get areaFormFieldValid() {
    return this.areaForm.controls;
  }

  areaSumbit() {
    if (this.areaForm.valid) {
      this.httpservice
        .postSecured(environment.addArea, this.areaForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.getAllArea();
            this.toastr.success('Area added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }

        });
    } else {
      this.areaForm.markAllAsTouched();
    }
  }

  getAllArea() {
    this.httpservice.getSecure(environment.getArea).subscribe((res: any) => {
      this.area = res.data;
      this.dataSource = new MatTableDataSource(this.area);
      this.dataSource.sort=this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    this.areaForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.areaForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
  }

  close() {
    this.isUpdate = false;
    this.areaForm.reset();
  }

  updateArea(data: any) {
    this.isUpdate = true;
    this.areaId = data.AreaId; //{id}  store
    this.areaForm.patchValue(data);
  }

  updateAreaData() {
    if(this.areaForm.valid)
    {
    this.httpservice.putSecured(environment.updateArea.replace('{id}', this.areaId),this.areaForm.value).subscribe((res:any) => {
        if (res.success) {
          this.closeModal.nativeElement.click();
          this.getAllArea();
          this.toastr.success('Area updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else
    {
      this.areaForm.markAllAsTouched();
    }
  }

  deleteArea(element: any, status:any, msg:any){
    let payload = { IsDeleted : !element.IsDeleted,ModifiedBy: this.decodeToken.UserId };
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to "+msg+" this area",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:"No"
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpservice.postSecured(environment.deleteArea.replace('{id}', element.AreaId), payload).subscribe((result:any) => {
        if (result.success) {
          this.getAllArea();

          status == 0? this.toastr.error('Area deleted sucessfully!'):this.toastr.success('Area restored sucessfully!');
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
