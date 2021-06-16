import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseTicketComponent } from './close-ticket.component';

describe('CloseTicketComponent', () => {
  let component: CloseTicketComponent;
  let fixture: ComponentFixture<CloseTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
