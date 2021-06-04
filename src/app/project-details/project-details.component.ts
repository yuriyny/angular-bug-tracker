import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../projects/projects.service';
import { TicketResponse } from '../tickets/ticket-response';
import { TicketsService } from '../tickets/tickets.service';
import { ParticipantDto } from './project-members/participant-dto';


@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  projectTickets: Array<TicketResponse> = [];
  numberOfTickets = 0;
  assignedTickets: Array<TicketResponse> = [];
  numberOfAssignedTickets = 0;
  closedTickets: Array<TicketResponse> = [];
  numberOfClosed = 0;
  closedPersantage = 0;
  memberList: Array<ParticipantDto> = [];
  numberOfMembers = 0;
  constructor(private activateRoute: ActivatedRoute,
    private projectsService: ProjectsService, private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.ticketsService.getTicketsByProjectId(this.activateRoute.snapshot.params.projectId).subscribe(data => {
      this.projectTickets = data;
      this.numberOfTickets = this.projectTickets.length;
      this.assignedTickets = this.projectTickets.filter(at => at.assignedParticipantName == 'angular');
      this.numberOfAssignedTickets = this.assignedTickets.length;
      this.closedTickets = this.projectTickets.filter(ct => ct.status === 'CLOSED');
      this.numberOfClosed = this.closedTickets.length;
      this.closedPersantage = (this.numberOfClosed / this.numberOfTickets) * 100;
      this.projectsService.getProjectMembersByProjectId(this.activateRoute.snapshot.params.projectId).subscribe(members=>{
        this.memberList = members;
        this.numberOfMembers = this.memberList.length;
      })
    });
  }

  scrollToElement(el:string, ticketType:string) {
    if(ticketType === 'ALL'){
      this.ticketsService.ticketCardFilter.next('ALL');
    }
    else if(ticketType === 'ASSIGNED'){
      this.ticketsService.ticketCardFilter.next('ASSIGNED');
    }
    else if(ticketType === 'CLOSED'){
      this.ticketsService.ticketCardFilter.next('CLOSED');
    }
    document.getElementById(el).scrollIntoView({ behavior: 'smooth' });
    }



}
