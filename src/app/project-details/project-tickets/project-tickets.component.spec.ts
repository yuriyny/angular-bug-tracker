import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectTicketsComponent } from './project-tickets.component';

describe('ProjectTicketsComponent', () => {
  let component: ProjectTicketsComponent;
  let fixture: ComponentFixture<ProjectTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
