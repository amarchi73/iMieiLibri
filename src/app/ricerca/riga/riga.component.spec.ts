import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RigaComponent } from './riga.component';

describe('RigaComponent', () => {
  let component: RigaComponent;
  let fixture: ComponentFixture<RigaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RigaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RigaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
