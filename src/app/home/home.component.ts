import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddMemberButton } from '../add-member/add-member.component';
import { AddProjectButton } from '../add-project/add-project.component';
import { AddTicketButton } from '../add-ticket/add-ticket.component';
import { AuthService } from '../auth/shared/auth.service';
import { ProjectsService } from '../projects/projects.service';
import { TicketsService } from '../tickets/tickets.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean;
  constructor(private router: Router, public authService: AuthService, private addProjectButton: AddProjectButton,
    private projectService: ProjectsService, private ticketsService: TicketsService,
    private addTicketButton: AddTicketButton, private addMemberButton: AddMemberButton) { }

  ngOnInit(): void {
    this.authService.isLoading.subscribe(data =>{
      setTimeout(() => this.isLoading = data, 0)
    })
  }

  setHeaderName(name: string){
    this.authService.headerName.next(name);
  }

  openAddProjectDialog(): void {
    this.addProjectButton.openDialog();
  }

  openAddTicketDialog(): void {
    this.projectService.addTicketSidePanel = true;
    if (this.router.url.split('/')[2] == 'project') {
      this.projectService.addMemberFromProjectPage = true;
    }

    this.addTicketButton.openDialog();
  }
  setOwnProjectsToTrue(): void {
    this.authService.headerName.next('Created Projects');
    this.projectService.ownProjects.next(true);
  }
  setOwnProjectsToFalse(): void {
    this.authService.headerName.next('All Projects');
    this.projectService.ownProjects.next(false);
  }
  setAllTickets() {
    this.ticketsService.ticketPanelFilter.next('ALL');
    this.authService.headerName.next('All Tickets');
  }
  setAssignedTickets() {
    this.ticketsService.ticketPanelFilter.next('ASSIGNED');
    this.authService.headerName.next('Assigned Tickets');
  }
  setOpenTickets() {
    this.authService.headerName.next('Open Tickets');
    this.ticketsService.ticketPanelFilter.next('OPEN');
  }
  setClosedTickets() {
    this.authService.headerName.next('Closed Tickets');
    this.ticketsService.ticketPanelFilter.next('CLOSED');
  }
  addMemberSidePanel() {
    if (this.router.url.split('/')[2] == 'project') {
      this.projectService.addMemberFromProjectPage = true;
    }


    this.projectService.addMemberSidePanel = true;
    this.addMemberButton.openDialog();
  }



}
