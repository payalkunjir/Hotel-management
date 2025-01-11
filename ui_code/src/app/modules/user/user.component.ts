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
import { HttpClient } from '@angular/common/http';

export interface IUser {
  UserId?: number;
  UserFirstName?: string;
  UserMiddleName?: string;
  UserLastName?: string;
  UserEmail?: string;
  UserContactNo?: string;
  ProfilePicture?: string;
  IsProfilePictureUpload?: boolean;

}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  displayedColumns: string[] = ['UserId', 'UserName', 'UserEmail', 'UserContactNo', 'action'];
  dataSource = new MatTableDataSource<IUser>();

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('hotelImage') hotelImage!: ElementRef;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  decodeToken: any;
  token: any;
  user: IUser[] = []; //pass the data through User
  isUpdate = false;
  isValid!: boolean | undefined;
  userId: any;
  selectedFile: boolean = false;
  formData = new FormData();
imageColor:any;



  constructor(
    private _formBuilder: FormBuilder,
    private httpservice: HttpService,
    private toastr: ToastrService,
    private http: HttpClient,
  ) {
    this.token = localStorage.getItem('token');
    const helper = new JwtHelperService();
    this.decodeToken = helper.decodeToken(this.token);
  }

  ngOnInit(): void {
    this.getAllUser();
  }

  UserForm = this._formBuilder.group({
    UserFirstName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    UserMiddleName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    UserLastName: ['', [Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(15), Validators.minLength(2)]],
    UserEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$"), Validators.maxLength(30), Validators.minLength(2)]],
    UserContactNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    ProfilePicture: [''],
    IsProfilePictureUpload: [false],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],
  });

  // method for for error
  isUserFormFieldValid(field: string) {
    this.isValid = (
      (!this.UserForm.get(field)?.valid && this.UserForm.get(field)?.touched) ||
      this.UserForm.get(field)?.untouched
    );
    return this.isValid
  }

  get UserFormFieldValid() {
    return this.UserForm.controls;
  }



  UserSumbit() {
    if (this.UserForm.valid) {
      this.httpservice
        .postSecured(environment.addUser, this.UserForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.UserForm.reset();
            this.hotelImage.nativeElement.value = '';
            this.getAllUser();
            this.selectedFile = false;
            this.toastr.success('User added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }
        });
    } else {
      this.UserForm.markAllAsTouched();
    }
  }

  getAllUser() {
    this.httpservice.getSecure(environment.getUser).subscribe((res: any) => {
      this.user = res.data;
      this.dataSource = new MatTableDataSource(this.user);
      this.dataSource.sortingDataAccessor = (element: any, property) => {
        switch (property) {
          case 'UserName': return element.UserFirstName + " " + element.UserMiddleName + " " + element.UserLastName;

          default: return element[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;


    });
  }

  add() {
    this.isUpdate = false;
    this.UserForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.UserForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
    this.UserForm.controls.IsProfilePictureUpload.setValue(false);
    var fileLabel:any = document.getElementById('fileLabel');
    fileLabel.innerHTML ='';
  }

  close() {
    this.selectedFile = false;
    this.isUpdate = false;
    this.UserForm.reset();
    this.hotelImage.nativeElement.value = '';
  }

  updateUser(data: any) {
    this.isUpdate = true;
    this.userId = data.UserId; //{id}  store
    var fileLabel:any = document.getElementById('fileLabel');
    var splitData = data.ProfilePicture !=null ? data.ProfilePicture.split('/') : [];
    fileLabel.innerHTML = splitData.length > 0 ? splitData[splitData.length - 1]:'';
    this.imageColor=data.ProfilePicture !=null ?{color:'transparent'}:{color:'black'}

    this.UserForm.patchValue(data);
  }

  updateUserData() {
    if (this.UserForm.valid) {
      this.httpservice.putSecured(environment.updateUser.replace('{id}', this.userId), this.UserForm.value).subscribe((res: any) => {
        if (res.success) {
          this.closeModal.nativeElement.click();
          this.getAllUser();
          this.UserForm.reset();
          this.hotelImage.nativeElement.value = '';
          this.toastr.success('User updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else {
      this.UserForm.markAllAsTouched();
    }
  }

  deleteUser(element: any, status: any, msg: any) {
    let payload = { IsDeleted: !element.IsDeleted, ModifiedBy: this.decodeToken.UserId };
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to " + msg + " this user",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.httpservice.postSecured(environment.deleteUser.replace('{id}', element.UserId), payload).subscribe((result: any) => {
          if (result.success) {
            this.getAllUser();

            status == 0 ? this.toastr.error('User deleted sucessfully!') : this.toastr.success('User restore sucessfully!');
          } else {
            this.toastr.error(status == 0 ? 'User not deleted!' : 'User not restore!');
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
    if (!control.touched || control.hasError('pattern')) {
      control.markAsTouched();
    }
  }

  onFileChange(event: any) {
    this.formData= new FormData();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let fileExtension = file.name.split('?')[0].split('.').pop();;
      if (fileExtension == "png" || fileExtension == "jpg" || fileExtension == "jpeg") {
        this.selectedFile = true;
        this.formData.append('user', file)
        this.imageColor={color:'black'}

      }
      else
      {
        this.selectedFile = false;
        this.toastr.error('Please upload jpg, jpeg or png files');
      }
    }
  }

  submitData() {
    if (this.selectedFile) {
      this.fileUpload();
    }
    else {
      this.isUpdate ? this.updateUserData() : this.UserSumbit();
    }
  }

  fileUpload() {
    this.http.post(environment.uploadUser, this.formData)
      .subscribe((res: any) => {
        if (res.success) {
          this.UserForm.controls.ProfilePicture.setValue(res.uploadpath);
          this.UserForm.controls.ProfilePicture.markAsDirty();
          this.UserForm.controls.IsProfilePictureUpload.setValue(true);
          this.UserForm.controls.IsProfilePictureUpload.markAsDirty();
          this.isUpdate ? this.updateUserData() : this.UserSumbit();
          this.selectedFile = false;
        }
        else {
          this.UserForm.controls.ProfilePicture.setValue('');
          this.UserForm.controls.ProfilePicture.markAsDirty();
          this.UserForm.controls.IsProfilePictureUpload.setValue(false);
          this.UserForm.controls.IsProfilePictureUpload.markAsDirty();
        }
      });
  }

}
