import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabrictestComponent } from './fabrictest.component';

describe('FabrictestComponent', () => {
  let component: FabrictestComponent;
  let fixture: ComponentFixture<FabrictestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FabrictestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FabrictestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
