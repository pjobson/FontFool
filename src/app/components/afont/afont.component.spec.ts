import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AFontComponent } from './font.component';

describe('AFontComponent', () => {
  let component: AFontComponent;
  let fixture: ComponentFixture<AFontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AFontComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AFontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
