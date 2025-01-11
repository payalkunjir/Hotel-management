import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpService } from 'src/app/services/http.service';
import { Router } from '@angular/router';

export interface Ioccupancy {
  HotelId?: number;
  ParticipantFirstName?: string;
  ParticipantMiddleName?: string;
  ParticipantLastName?: string;
  VenueName?: string;
  AreaName?: string;
  HotelName?: string;
  AreaId?: string;
}
@Component({
  selector: 'app-occupancy',
  templateUrl: './occupancy.component.html',
  styleUrls: ['./occupancy.component.css'],
})
export class OccupancyComponent implements OnInit {
  constructor(
    private httpservice: HttpService,
    private router: Router,
    private _formbuilder: FormBuilder
  ) {}

  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild(MatSort, { static: true })
  sort: MatSort = new MatSort();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;

  // Occupancy:any=[];
  areaData: any;
  participantData: any;
  occupancy: Ioccupancy[] = [];
  displayedColumns: string[] = [
    'HotelId',
    'ParticipantName',
    'VenueName',
    'AreaName',
    'HotelName',

  ];
  dataSource = new MatTableDataSource<Ioccupancy>();
  //for occupany type
  occupancyType: any[] = [
    { id: 1, value: 'Single' },
    { id: 2, value: 'Double' },
  ];

  ngOnInit(): void {

  }

  OccupancyForm = this._formbuilder.group({
    OccupanyType: ['', [Validators.required]],
    CheckinDate: ['', [Validators.required]],
    CheckoutDate: ['', [Validators.required]],
  });

  occupancyReport() {
    this.httpservice
      .postSecured(environment.getOccupancy, this.OccupancyForm.value)
      .subscribe((res: any) => {
        this.occupancy = res.data;
        console.log('occupancy', this.occupancy);
        this.dataSource = new MatTableDataSource(this.occupancy);
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

  // for search box
  Filterchange(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  back() {
    this.router.navigate(['/reports']);
  }

  //method for display error msg
  hasError(control: FormControl) {
    if (!control.touched || control.hasError('pattern')) {
      control.markAsTouched();
    }
  }
}
