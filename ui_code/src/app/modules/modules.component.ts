import { Component, OnInit } from '@angular/core';
import { LoginserviceService } from '../services/loginservice.service';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css']
})
export class ModulesComponent implements OnInit {
  constructor(private loginService:LoginserviceService){

  }
  ngOnInit(): void {
  }
}
