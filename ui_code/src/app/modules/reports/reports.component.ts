import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit {


  constructor(private router:Router) {}

  ngOnInit(): void {

  }
  reportsData: any = [
    {
      name: 'Detailed Allocation Report ',
      route: '/allocation',
      index: 0,
    },
    {
      name: 'Detailed Occupancy Report',
      route: '/occupancy',
      index: 1,
    },
    {
      name: 'Detailed Vacancy Report',
      route: '/vacancy',
      index: 2,
    },
  ];


  navigate(route:any){
  this.router.navigate(['reports'+route])
  }

    // for search box
    Filterchange(event: any) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.reportsData.filter=filterValue.trim().toLocaleLowerCase();
      // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

}
