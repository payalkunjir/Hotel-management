import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
// import { HttpService } from 'src/app/services/http.service';


export interface Iallocation  {
  HotelId?: number;
  HotelName?: string;
  HotelCategory?:string;
  HotelAddress?:string;
  AreaId?:string;

}
@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css']
})
export class VacancyComponent implements OnInit{
  constructor(private httpservice:HttpService, private router:Router){}
  areaData:any;
  participantData:any;
  allocation:Iallocation[]=[]
  displayedColumns: string[] = ['HotelId','HotelCategory','HotelAddress','AreaName','HotelName','action'];
  dataSource = new MatTableDataSource<Iallocation>();

  ngOnInit(): void {
    this.getAllArea()
    this.getAllParticipant();
  }

  getAllArea(){
    this.httpservice.getSecure(environment.getArea).subscribe((res:any)=>{
     this.areaData=res.data.filter((element:any) => {
       if(element.IsDeleted == 0){ return element;};
     });
     console.log(this.areaData)
    })
   }



   getAllParticipant(){
    this.httpservice.getSecure(environment.getParticipant).subscribe((res:any)=>{
      this.participantData=res.data.filter((element:any)=>{
        if(element.IsDeleted==0){
          return element;
        }
      });
      console.log(this.participantData)
    })
   }
 //for occupany type
occupancyType:any[]=[
  {id:1, value:"Single"},
  {id:2, value:"Double"}
]
    // for search box
    Filterchange(event: any) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    back(){
   this.router.navigate(['/reports'])
    }
}
