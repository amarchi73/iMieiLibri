import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenitoreComponent } from './contenitore.component';

describe('ContenitoreComponent', () => {
  let component: ContenitoreComponent;
  let fixture: ComponentFixture<ContenitoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContenitoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenitoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
