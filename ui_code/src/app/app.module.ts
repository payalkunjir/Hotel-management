import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { MenuItems } from 'src/menu-items/menu_items';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from "@auth0/angular-jwt";
import { ToastrModule } from 'ngx-toastr';
import {ReactiveFormsModule, FormsModule}  from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { LayoutModule } from './modules/layout/layout/layout.module';
import { HomeComponent } from './home/home.component';

// import { LayoutComponent } from './layout/layout.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {ExampleInterceptorInterceptor} from './interceptor.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ModulesModule } from './modules/modules.module';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        AlertDialogComponent,
        // LayoutComponent
     
    ],
    providers: [MenuItems,
    {
       provide:HTTP_INTERCEPTORS,
       useClass:ExampleInterceptorInterceptor,
       multi:true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CommonModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientModule,
        ReactiveFormsModule, FormsModule,
        JwtModule,
        LayoutModule,
        NgxMatTimepickerModule,
        ModulesModule,
        ToastrModule.forRoot()
    ],
    exports:[
      MaterialModule,
        LayoutModule ,
        ToastrModule,
        NgxMatTimepickerModule,
        MaterialModule,
    ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }
