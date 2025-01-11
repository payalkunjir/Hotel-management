import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCategoryComponent } from './guest-category.component';

describe('GuestCategoryComponent', () => {
  let component: GuestCategoryComponent;
  let fixture: ComponentFixture<GuestCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
