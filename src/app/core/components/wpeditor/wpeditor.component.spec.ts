import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WpeditorComponent } from './wpeditor.component';

describe('WpeditorComponent', () => {
  let component: WpeditorComponent;
  let fixture: ComponentFixture<WpeditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WpeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WpeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
