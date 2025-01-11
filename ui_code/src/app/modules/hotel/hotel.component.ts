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
import Swal from 'sweetalert2';
import { HttpClient, HttpEventType } from '@angular/common/http';

export interface Ihotel {
  HotelId?: number;
  HotelName?: string;
  HotelCategory?:string;
  HotelAddress?:string;
  RoomCategory?:string;
  TotalRoom?:string;
  HotelDistanceFromVenue?:string;
  HotelContactNo?:string;
  AreaId?:string;
  HotelImage?:string;
  IsHotelImageUpload?:boolean;
}
@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.css']
})

export class HotelComponent implements OnInit{
  displayedColumns: string[] = ['HotelId', 'HotelName','HotelCategory','HotelAddress','AreaName','RoomCategory','TotalRoom','HotelDistanceFromVenue','HotelContactNo','action'];
  dataSource = new MatTableDataSource<Ihotel>();

  @ViewChild('labelImport')
  labelImport!: ElementRef;

  formImport!: FormGroup;
  fileToUpload!: any;
  formData = new FormData();

  @ViewChild('closeModal') closeModal!: ElementRef;
 @ViewChild('hotelImage') hotelImage!:ElementRef;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort,{ static: true})  sort !:MatSort;

  decodeToken: any;
  token: any;
  hotel: Ihotel[] = []; //pass the data through hotel
  isUpdate = false;
  hotelId: any;
  getAreas:any;
  AreaId:any
  isValid!:boolean | undefined;
  selectedFile:boolean=false;
  imageColor: any;

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
    this.getAllHotel();
    this.getAllArea();

  }
  hotelForm = this._formBuilder.group({
    HotelName: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"),Validators.maxLength(30),Validators.minLength(2) ]],
    HotelCategory: ['',[Validators.required, Validators.pattern("^[a-zA-Z0-9 \s-]+$"), Validators.maxLength(10),Validators.minLength(2)]],
    HotelAddress: ['',[Validators.required, Validators.pattern("^(?!\')+[a-zA-Z0-9 -_\']+$"), Validators.maxLength(40),Validators.minLength(2)]],
    RoomCategory: ['',[Validators.required, Validators.pattern("^[a-zA-Z]*$"), Validators.maxLength(20),Validators.minLength(2)]],
    TotalRoom: ['',[Validators.required, Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
    HotelContactNo: ['',[Validators.required, Validators.pattern("^[7-9]{1}[0-9]{9}$"),]],
    HotelDistanceFromVenue: ['',[Validators.required, Validators.pattern("^(?!\')+[a-zA-Z0-9 -_\']+$"), Validators.maxLength(10),Validators.minLength(2)]],
    AreaId: ['',[Validators.required]],
    HotelImage: [''],
    IsHotelImageUpload: [false],
    CreatedBy: ['', Validators.required],
    ModifiedBy: ['', Validators.required],
  });

  // method for  error
  ishotelFormFieldValid(field: string) {
     this.isValid = (
      (!this.hotelForm.get(field)?.valid && this.hotelForm.get(field)?.touched) ||
      this.hotelForm.get(field)?.untouched
    );
    return this.isValid
  }

  get hotelFormFieldValid() {
    return this.hotelForm.controls;
  }

  hotelSubmit() {
    if (this.hotelForm.valid) {
      this.httpservice
        .postSecured(environment.addHotel, this.hotelForm.value)
        .subscribe((res: any) => {
          if (res.success) {
            this.closeModal.nativeElement.click();
            this.hotelForm.reset();
            this.hotelImage.nativeElement.value='';
            this.getAllHotel();
            this.selectedFile=false;
            this.toastr.success('Hotel added Sucessfully!');
          } else {
            this.toastr.error(res.message);
          }
        });
    } else {
      this.hotelForm.markAllAsTouched();
    }
  }

  getAllArea(){
   this.httpservice.getSecure(environment.getArea).subscribe((res:any)=>{
    this.getAreas=res.data.filter((element:any) => {
      if(element.IsDeleted == 0){ return element;};
    });
    console.log(this.getAreas)
   })
  }

  getAllHotel() {
    this.httpservice.getSecure(environment.getHotel).subscribe((res: any) => {
      this.hotel = res.data;
      console.log("allHotelData",this.hotel)
      this.dataSource = new MatTableDataSource(this.hotel);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  add() {
    this.isUpdate = false;
    this.hotelForm.controls.CreatedBy.setValue(this.decodeToken.UserId);
    this.hotelForm.controls.ModifiedBy.setValue(this.decodeToken.UserId);
    this.hotelForm.controls.IsHotelImageUpload.setValue(false);
    var fileLabel:any = document.getElementById('fileLabel');
    fileLabel.innerHTML ='';
  }

  close() {
    this.selectedFile=false;
    this.isUpdate = false;
    this.hotelForm.reset();
    this.hotelImage.nativeElement.value ='';
  }

  updateHotel(data: any) {
    this.isUpdate = true;
    this.hotelId = data.HotelId; //{id}  store
    var fileLabel:any = document.getElementById('fileLabel');
    var splitData= data.HotelImage !=null ? data.HotelImage.split('/'):[];
    fileLabel.innerHTML= splitData.length > 0 ? splitData[splitData.length - 1]:'';
    this.imageColor = data.HotelImage !=null ? {color:'transparent'}:{color:'black'}
    this.hotelForm.patchValue(data);
    console.log("filedata",data)

  }

  updateHotelData() {
    if(this.hotelForm.valid)
    {
    this.httpservice.putSecured(environment.updateHotel.replace('{id}', this.hotelId),this.hotelForm.value).subscribe((res:any) => {
        if (res.success) {
          this.closeModal.nativeElement.click();
          this.getAllHotel();
          this.hotelForm.reset();
          this.hotelImage.nativeElement.value='';
          this.toastr.success('Hotel updated Sucessfully!');
        } else {
          this.toastr.error(res.message);
        }
      });
    }
    else
    {
      this.hotelForm.markAllAsTouched();
    }
  }

  deleteHotel(element: any, status:any, msg:any){
    let payload = { IsDeleted : !element.IsDeleted,ModifiedBy: this.decodeToken.UserId };
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to "+msg+" this hotel",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes',
    cancelButtonText:"No"
  }).then((result) => {
    if (result.isConfirmed) {
      this.httpservice.postSecured(environment.deleteHotel.replace('{id}',element.HotelId), payload).subscribe((result:any) => {
        if (result.success) {
          this.getAllHotel();

          status == 0? this.toastr.error('Hotel deleted sucessfully!'):this.toastr.success('Hotel restore sucessfully!');
        } else {
          this.toastr.error(status == 0? 'Hotel not deleted!':'Hotel not restore!');
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

  onFileChange(event: any) {
    this.formData= new FormData();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      let fileExtension = file.name.split('?')[0].split('.').pop();;
      if (fileExtension == "png" || fileExtension == "jpg" || fileExtension == "jpeg") {
        this.selectedFile = true;
        this.formData.append('hotel', file)
        this.imageColor={color:'black'}
      }
      else
      {
        this.selectedFile = false;
        this.toastr.error('Please upload jpg, jpeg or png files');
      }
    }
  }

  submitData()
  {
    if(this.selectedFile)
    {
      this.fileUpload();
    }
    else
    {
      this.isUpdate? this.updateHotelData():this.hotelSubmit();
    }
  }

  fileUpload()
  {
    this.http.post(environment.uploadHotel, this.formData)
    .subscribe((res: any) => {
      if (res.success)
      {
        this.hotelForm.controls.HotelImage.setValue(res.uploadpath);
        this.hotelForm.controls.HotelImage.markAsDirty();
        this.hotelForm.controls.IsHotelImageUpload.setValue(true);
        this.hotelForm.controls.IsHotelImageUpload.markAsDirty();
        this.isUpdate? this.updateHotelData():this.hotelSubmit();
        this.selectedFile=false;
      }
      else
      {
        this.hotelForm.controls.HotelImage.setValue('');
        this.hotelForm.controls.HotelImage.markAsDirty();
        this.hotelForm.controls.IsHotelImageUpload.setValue(false);
        this.hotelForm.controls.IsHotelImageUpload.markAsDirty();
      }
    });
  }

}


