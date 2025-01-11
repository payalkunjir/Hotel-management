import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModulesComponent } from './modules.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AreaComponent } from './area/area.component';
import { DesignationComponent } from './designation/designation.component';
import { DriverComponent } from './driver/driver.component';
import { GuestCategoryComponent } from './guest-category/guest-category.component';
import { HotelComponent } from './hotel/hotel.component';
import { ParticipantComponent } from './participant/participant.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { UserComponent } from './user/user.component';
import { ReportsComponent } from './reports/reports.component';
import { WrapperComponent } from './layout/layout/wrapper/wrapper.component';
import { VenueComponent } from './venue/venue.component';
import { AllocationComponent } from './reports/allocation/allocation.component';
import { OccupancyComponent } from './reports/occupancy/occupancy.component';
import { VacancyComponent } from './reports/vacancy/vacancy.component';
// import { LayoutComponent } from '../layout/layout.component';

const routes: Routes = [
  // { path: '', component: WrapperComponent },
  {
    path: '',
    component: WrapperComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'area',
        component: AreaComponent,
      },
      {
        path: 'designation',
        component: DesignationComponent,
      },
      {
        path: 'driver',
        component: DriverComponent,
      },
      {
        path: 'guest_category',
        component: GuestCategoryComponent,
      },
      {
        path: 'hotel',
        component: HotelComponent,
      },
      {
        path: 'participant',
        component: ParticipantComponent,
      },
      {
        path: 'vehicle',
        component: VehicleComponent,
      },
      {
        path: 'venue',
        component: VenueComponent,
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: 'reports',
        children: [
          {
            path: '',
            component: ReportsComponent,
          },
          {
            path: 'allocation',
            component: AllocationComponent,
          },
          {
            path: 'occupancy',
            component: OccupancyComponent,
          },
          {
            path: 'vacancy',
            component: VacancyComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModulesRoutingModule {}
