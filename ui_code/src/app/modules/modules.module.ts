import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulesRoutingModule } from './modules-routing.module';
import { ModulesComponent } from './modules.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AreaComponent } from './area/area.component';
import { DesignationComponent } from './designation/designation.component';
import { DriverComponent } from './driver/driver.component';
import { GuestCategoryComponent } from './guest-category/guest-category.component';
import { ParticipantComponent } from './participant/participant.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { UserComponent } from './user/user.component';
import { MaterialModule } from '../material.module';
import { ReportsComponent } from './reports/reports.component';
import { MenuItems } from 'src/menu-items/menu_items';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VenueComponent } from './venue/venue.component';
import { HotelComponent } from './hotel/hotel.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AllocationComponent } from './reports/allocation/allocation.component';
import { OccupancyComponent } from './reports/occupancy/occupancy.component';
import { VacancyComponent } from './reports/vacancy/vacancy.component';
@NgModule({
  declarations: [
    ModulesComponent,
    DashboardComponent,
    AreaComponent,
    DesignationComponent,
    DriverComponent,
    GuestCategoryComponent,
    ParticipantComponent,
    VehicleComponent,
    UserComponent,
    ReportsComponent,
    VenueComponent,
    HotelComponent,
    AllocationComponent,
    OccupancyComponent,
    VacancyComponent

  ],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    MaterialModule,
    FormsModule,
    NgxMatTimepickerModule,
  ],
  providers:[
    [MenuItems]
  ]

})
export class ModulesModule { }
