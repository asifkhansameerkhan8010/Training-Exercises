import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageguestComponent } from './manageguest.component';

describe('ManageguestComponent', () => {
  let component: ManageguestComponent;
  let fixture: ComponentFixture<ManageguestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageguestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageguestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
