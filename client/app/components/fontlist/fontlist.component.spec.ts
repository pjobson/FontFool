import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontlistComponent } from './fontlist.component';

describe('FontlistComponent', () => {
  let component: FontlistComponent;
  let fixture: ComponentFixture<FontlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FontlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FontlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
