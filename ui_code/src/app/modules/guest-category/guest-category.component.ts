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

export interface IGuestCategory {
  GuestCategoryId?: number;
  GuestCategoryrName?: string;
  GuestCategoryCode?: string;
}


@Component({
  selector: 'app-guest-category',
  templateUrl: './guest-category.component.html',
  styleUrls: ['./guest-category.component.css']
})
export class GuestCategoryComponent  implements OnInit{
  displayedColumns: string[] = ['GuestCategoryId', 'GuestCategoryName', 'GuestCategoryCode', 'action'];
  dataSource = new MatTableDataSource<IGuestCategory>();

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  decodeToken: any;
  token: any;
  GuestCategory: IGuestCategory[] = []; //pass the data through GuestCategory
  isUpdate = false;
  isValid!:boolean | undefined;
  // GuestCategoryId: any;
  guestcategoryId!: string;

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
    this.getAllGuestCategory();
  }
  // form  ^(?!\')+[a-zA-Z &@#\']+$'
  GuestCategoryForm = this._formBuilder.group({
    GuestCategoryName: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"),Validators.maxLength(10) ,Validators.minLength(2)]],
    GuestCategoryCode: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9\s-]+$"), Validators.maxLength(10),Validators.minLength(2)]],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],
  });

  // method for for error
  isGuestCategoryFormFieldValid(field: string) {
     this.isValid = (
      (!this.GuestCategoryForm.get(field)?.valid && this.GuestCategoryForm.get(field)?.touched) ||
      this.GuestCategoryForm.get(field)?.untouched
    );
    return this.isValid
  }
  get GuestCategoryFormFieldValid() {
    return this.GuestCategoryForm.controls;
  }

  GuestCategorySumbit() {
    if (this.GuestCategoryForm.valid) {
      this.httpservice
        .postSecured(environment.addGuestCategory, this.GuestCategoryForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.getAllGuestCategory();
            this.toastr.success('Guest Category added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }

        });
    } else {
      this.GuestCategoryForm.markAllAsTouched();
    }
  }

  getAllGuestCategory() {
    this.httpservice.getSecure(environment.getGuestCategories).subscribe((res: any) => {
      this.GuestCategory = res.data;
      this.dataSource = new MatTableDataSource(this.GuestCategory);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    this.GuestCategoryForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.GuestCategoryForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
  }

  close() {
    this.isUpdate = false;
    this.GuestCategoryForm.reset();
  }

  updateGuestCategory(data: any) {
    this.isUpdate = true;
    this.guestcategoryId = data.GuestCategoryId; //{id}  store
    this.GuestCategoryForm.patchValue(data);
  }

  updateGuestCategoryData() {
    if(this.GuestCategoryForm.valid)
    {
    this.httpservice.putSecured(environment.updateGuestCategory.replace('{id}', this.guestcategoryId),this.GuestCategoryForm.value).subscribe((res:any) => {
        if (res.success) {
          this.closeModal.nativeElement.click();
          this.getAllGuestCategory();
          this.toastr.success('Guest Category updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else
    {
      this.GuestCategoryForm.markAllAsTouched();
    }
  }

  deleteGuestCategory(element: any, status:any, msg:any){
    let payload = { IsDeleted : !element.IsDeleted,ModifiedBy: this.decodeToken.UserId };
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to "+msg+" this Guest Category",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:"No"
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpservice.postSecured(environment.deleteGuestCategory.replace('{id}', element.GuestCategoryId), payload).subscribe((result:any) => {
        if (result.success) {
          this.getAllGuestCategory();

          status == 0? this.toastr.error('Guest Category deleted sucessfully!'):this.toastr.success('Guest Category restore sucessfully!');
        } else {
          this.toastr.error(status == 0? 'Guest Category not deleted!':'Guest Category not restore!');
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
