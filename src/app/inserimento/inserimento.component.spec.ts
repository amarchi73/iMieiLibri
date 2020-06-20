import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InserimentoComponent } from './inserimento.component';

describe('InserimentoComponent', () => {
  let component: InserimentoComponent;
  let fixture: ComponentFixture<InserimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InserimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InserimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
