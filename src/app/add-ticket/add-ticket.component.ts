import { Component, Inject, Injectable, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/shared/auth.service';
import { MyErrorStateMatcher } from '../auth/shared/my-error-state-matcher';
import { ParticipantDto } from '../project-details/project-members/participant-dto';
import { ProjectResponse } from '../projects/project-response';
import { ProjectsService } from '../projects/projects.service';
import { TicketResponse } from '../tickets/ticket-response';
import { TicketsService } from '../tickets/tickets.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'add-ticket-button',
  templateUrl: 'add-ticket-button.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketButton {
  @Input() projectId: number;
  ticketName: string;
  ticketDescription: string;


  constructor(public dialog: MatDialog, private projectService: ProjectsService, private activateRoute: ActivatedRoute) { }

  openDialog(): void {
    if (this.projectService.addTicketSidePanel) {
      this.projectService.addTicketSidePanel = false;
      this.projectService.getProjectsForCurrentUser().subscribe(project => {
        const dialogRef = this.dialog.open(AddTicketComponent, {
          width: '500px',
          data: { project: project, sidePanel: true, route: this.activateRoute.snapshot.params.projectId }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      })
    }
    else {
      this.projectService.getProjectById(this.projectId).subscribe(project => {
        const dialogRef = this.dialog.open(AddTicketComponent, {
          width: '500px',
          data: { project: project, sidePanel: false, route: this.activateRoute.snapshot.params.projectId }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      });
    }
  }
}


@Component({
  selector: 'app-add-ticket',
  templateUrl: './add-ticket.component.html',
  styleUrls: ['./add-ticket.component.scss']
})
export class AddTicketComponent implements OnInit {
  addTicketForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  projectList: Array<ProjectResponse> = [];
  memberList: Array<ParticipantDto> = [];
  priority = 0;
  ticketResponse: TicketResponse;
  projectId = 1;
  selectedProject = "";

  assignTo: ParticipantDto;
  constructor(private router: Router, public authService: AuthService, public dialogRef: MatDialogRef<AddTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData,
    private ticketsService: TicketsService,
    private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.addTicketForm = new FormGroup({
      ticketName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      selectedProject: new FormControl('', Validators.required),
      assignTo: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required)
    });
  
    if (this.dialogData.sidePanel == false) {
      this.projectList.push(this.dialogData.project);
      this.addTicketForm.get('selectedProject').setValue(this.dialogData.project);    
      this.selectedProject = this.dialogData.project;
      this.projectId = this.dialogData.project.projectId;
      this.projectsService.getProjectMembersByProjectId(this.dialogData.project.projectId).subscribe(members => {
        this.memberList = members;
      });
    } else {
      this.projectList = this.dialogData.project;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTicket(form: NgForm) {
    this.ticketResponse = {
      ticketId: null,
      ticketName: form.value.ticketName,
      projectId: this.projectId,
      projectName: "",
      description: form.value.description,
      priority: this.addTicketForm.get('priority').value,
      createdDate: null,
      updatedDate: null,
      creatorName: null,
      creatorId: null,
      assignedParticipant:  this.addTicketForm.get('assignTo').value.participantId, 
      assignedParticipantName: null,
      status: 0
    }
  
     this.ticketsService.addTicket(this.ticketResponse).subscribe(data => {
       if (this.dialogData.route && this.dialogData.route == data.projectId) {
         if (this.ticketsService.ticketCardFilter.value === 'ALL' ||
           (this.ticketsService.ticketCardFilter.value === 'ASSIGNED' && data.assignedParticipantName == this.authService.getUserName())) {           
           this.ticketsService.ticketList.push(data);
           this.ticketsService.tickets.next(this.ticketsService.ticketList);
         }
       } else{
         this.router.navigate(['/home/tickets']);
       }
     });
    
            
    // form.reset();
  }

  updateMemberList(p: ProjectResponse) {
    this.projectId = p.projectId;
    this.projectsService.getProjectMembersByProjectId(p.projectId).subscribe(members => {
      this.memberList = members;
    })

  }

}
