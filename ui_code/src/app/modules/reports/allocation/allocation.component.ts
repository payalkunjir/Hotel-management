import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';
import { elementAt } from 'rxjs';
import { Iarea } from '../../area/area.component';

export interface Iallocation {
  HotelId?:string
  ParticipantFirstName?:string;
  ParticipantMiddleName?:string;
  ParticipantLastName?:string;
  venuename?:string;
  areaname?:string;
  hotelname?: string;



}

@Component({
  selector: 'app-allocation',
  templateUrl: './allocation.component.html',
  styleUrls: ['./allocation.component.css']
})
export class AllocationComponent implements OnInit{
  hotels: any=[];
  constructor(private httpservice:HttpService, private router:Router , private _formbuilder:FormBuilder){}
  areaData:any;
  areas:any;
  hotelData:any;
  hotelDataByArea:any;
  allocation:Iallocation[]=[]
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  displayedColumns: string[] = ['HotelId','ParticipantName','venuename','areaname','hotelname'];
  dataSource = new MatTableDataSource<Iallocation>();

  ngOnInit(): void {
    this.getAllArea();
    // this.getAllHotelsByArea();

  }

  allocationForm=this._formbuilder.group({
    areaid:['',Validators.required],
    hotelid:['',Validators.required],
    CheckinDate:['',Validators.required],
    CheckoutDate:['',Validators.required]
  })

  getAllArea(){
    this.httpservice.getSecure(environment.getArea).subscribe((res:any)=>{
     this.areaData=res.data.filter((element:any) => {
       if(element.IsDeleted == 0){ return element;};
     });
     console.log(this.areaData);
    })
   }

   allocationReport(){
    this.httpservice.postSecured(environment.getAllocation, this.allocationForm.value).subscribe((res:any)=>{
  this.allocation=res.data
  console.log('allocation', this.allocation)
  this.dataSource = new MatTableDataSource(this.allocation);
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

  getAllHotelsByArea(AreaId:any){
    let payload = {AreaId:AreaId};
    this.httpservice.postSecured(environment.getHotelsByArea, payload).subscribe((res: any) => {
      this.hotels = res.data.length > 0 ? res.data:[];
      console.log("Hotels",this.hotels);
    });
  }


    // for search box
    Filterchange(event: any) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    back(){
   this.router.navigate(['/reports'])
    }
}
