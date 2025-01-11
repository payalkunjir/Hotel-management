import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WrapperComponent } from './wrapper/wrapper.component';
import { HeaderComponent } from './header/header.component';
import { MaterialModule } from 'src/app/material.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MenuItems } from 'src/menu-items/menu_items';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    WrapperComponent,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
       RouterModule
  ],
  providers:[
    [MenuItems]
  ]
})
export class LayoutModule { }
