import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WpeditorComponent } from './wpeditor.component';

describe('WpeditorComponent', () => {
  let component: WpeditorComponent;
  let fixture: ComponentFixture<WpeditorComponent>;

  beforeEach(async(() => {
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
