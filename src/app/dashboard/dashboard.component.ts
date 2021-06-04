import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/shared/auth.service';
import { ProjectResponse } from '../projects/project-response';
import { ProjectsService } from '../projects/projects.service';
import { TicketResponse } from '../tickets/ticket-response';
import { TicketsService } from '../tickets/tickets.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  recentProjects: Array<ProjectResponse> = [];
  assignedTickets: Array<TicketResponse> = [];
  allTickets: Array<TicketResponse> = [];
  createdTickets: Array<TicketResponse> = [];
  openTickets: Array<TicketResponse> = [];
  closedTickets: Array<TicketResponse> = [];
  createdPercentage: number = 0;
  assignedPercentage: number = 0;
  highPercentage: number = 0;
  mediumPercentage: number = 0;
  lowPercentage: number = 0;
  highPriorityTickets: Array<TicketResponse> = [];
  mediumPriorityTickets: Array<TicketResponse> = [];
  lowPriorityTickets: Array<TicketResponse> = [];
  allProjects: Array<ProjectResponse> = [];
  recentTickets: Array<TicketResponse> = [];
  constructor(private projectsService: ProjectsService, private authService: AuthService, private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.projectsService.getRecentProjects().subscribe(data => {
      this.recentProjects = data;
      this.projectsService.recentProjects = data;
      this.projectsService.recentProjectsSubject.next(data);
    });
    this.projectsService.getOwnProjectsForCurrentUser().subscribe(op => {
      this.projectsService.ownProjectsSubject.next(op);
    });
    this.projectsService.getProjectsByUsername(this.authService.getUserName()).subscribe(pp => {
      this.projectsService.participatedProjectsSubject.next(pp);
      this.allProjects = pp;
    });
    this.ticketsService.getTicketForCurrentUser().subscribe(allTickets => {
      const current = Date.now() / 1000; 
      const lastFortheenDays = current - 1209600;
      console.log(current);
      
      console.log(lastFortheenDays);
      
      this.recentTickets = allTickets.filter(allT => allT.createdDate > lastFortheenDays);
      console.log(this.recentTickets);
      
      
      
      
      this.ticketsService.getAssignedTicketForCurrentUser().subscribe(at => {
        this.allTickets = allTickets;
        this.assignedTickets = at;
        this.assignedPercentage = Math.round(at.length / allTickets.length * 100);
        this.lowPriorityTickets = allTickets.filter(ticket => ticket.priority == 'LOW');
        this.mediumPriorityTickets = allTickets.filter(ticket => ticket.priority == 'MEDIUM');
        this.highPriorityTickets = allTickets.filter(ticket => ticket.priority == 'HIGH');
        this.lowPercentage = Math.round(this.lowPriorityTickets.length / allTickets.length * 100);
        this.mediumPercentage = Math.round(this.mediumPriorityTickets.length / allTickets.length * 100);
        this.highPercentage = Math.round(this.highPriorityTickets.length / allTickets.length * 100);
        this.openTickets = allTickets.filter(ticket => ticket.status == 'OPEN');
        this.ticketsService.openTicketsSubject.next(this.openTickets);     
        this.closedTickets = allTickets.filter(ticket => ticket.status == 'CLOSED');
        this.ticketsService.closedTicketsSubject.next(this.closedTickets);
        this.ticketsService.getCreatedTicketByCurrentUser().subscribe(ct => {
          this.createdTickets = ct;
          this.createdPercentage = Math.round(ct.length / allTickets.length * 100);
        });
      });
    


    });
  }

}
