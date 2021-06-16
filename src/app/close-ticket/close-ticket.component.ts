import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTicketComponent } from '../add-ticket/add-ticket.component';
import { AuthService } from '../auth/shared/auth.service';
import { MyErrorStateMatcher } from '../auth/shared/my-error-state-matcher';
import { ParticipantDto } from '../project-details/project-members/participant-dto';
import { ProjectsService } from '../projects/projects.service';
import { TicketHistoryDto } from '../tickets/ticket-history-dto';
import { TicketResponse } from '../tickets/ticket-response';
import { TicketsService } from '../tickets/tickets.service';

@Component({
  selector: 'close-ticket-button',
  templateUrl: 'close-ticket-button.html',
  styleUrls: ['./close-ticket.component.scss']
})
export class CloseTicketButton {
  //projectId: number;
  @Input() ticketId: number;
  @Input() status: string;
  @Input() isCreator: boolean;
  @Input() isAssigned: boolean;

  constructor(public dialog: MatDialog, private ticketService: TicketsService) {
  }

  openDialog(): void {

    this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {

      const dialogRef = this.dialog.open(CloseTicketComponent, {
        width: '500px',
        data: { ticket: ticket }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });


  }

  openDialogCloseTicket(): void  {
    this.ticketService.getTicketById(this.ticketId).subscribe(ticket => {

      const dialogRef = this.dialog.open(CloseTicketComponent, {
        width: '500px',
        data: { ticket: ticket }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });
  
  }
}




@Component({
  selector: 'app-close-ticket',
  templateUrl: './close-ticket.component.html',
  styleUrls: ['./close-ticket.component.scss']
})
export class CloseTicketComponent implements OnInit {

  updateTicketForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  //projectList: Array<ProjectResponse> = [];
  //memberList: Array<ParticipantDto> = []
  priority = 0;
  ticketResponse: TicketResponse;
  ticketHistoryDto: TicketHistoryDto;
  selectedProject = "";
  memberList: Array<ParticipantDto> = [];
  assignTo: ParticipantDto;
  isCreator: boolean;
  isAssigned: boolean;
  assignedId: number;
  assignedName: string;

  constructor(public authService: AuthService, private projectService: ProjectsService, private ticketService: TicketsService, public dialogRef: MatDialogRef<AddTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) { }

  ngOnInit(): void {
    this.updateTicketForm = new FormGroup({
      ticketName: new FormControl(''),
      description: new FormControl('', Validators.required),
      //assignTo: new FormControl(''),
      //priority: new FormControl('', Validators.required)
    });

    this.ticketResponse = this.dialogData.ticket;


    //this.updateTicketForm.get('ticketName').setValue(this.ticketResponse.ticketName);
    //this.updateTicketForm.get('description').setValue(this.ticketResponse.description);
    this.projectService.getProjectMembersByProjectId(this.dialogData.ticket.projectId).subscribe(members => {
      this.memberList = members;

    });
    //prepopulate forms for the current ticket

    // this.projectList.push(this.dialogData.project);
    // this.selectedProject = this.dialogData.project.projectName; 
    // this.projectsService.getProjectMembersByProjectId(this.dialogData.project.projectId).subscribe(members=>{
    //   this.memberList = members;
    // });  
  }


  closeTicket(form: NgForm) {

    console.log(form.value.ticketName);
    console.log(this.ticketResponse);
    console.log(this.assignTo);

    // if (this.isAssigned) {
    //   this.assignedId = this.ticketResponse.assignedParticipant;
    //   this.assignedName = this.ticketResponse.assignedParticipantName;
    // } else {
    //   this.assignedId = this.updateTicketForm.get('assignTo').value.participantId;
    //   this.assignedName = this.updateTicketForm.get('assignTo').value.username;
    // }

    this.ticketHistoryDto = {
      ticketHistoryId: null,
      ticketName: this.ticketResponse.ticketName,
      description: this.updateTicketForm.get('description').value,
      ticket: this.ticketResponse.ticketId,
      updatedDate: null,
      priority: this.ticketResponse.priority,
      updateParticipant: null,
      updateParticipantName: null,
      assignedParticipant: this.ticketResponse.assignedParticipant,
      assignedParticipantName: null,
      status: 1
    }
    console.log(this.ticketHistoryDto);



    this.ticketService.updateTicket(this.ticketHistoryDto).subscribe(th => {
      console.log(th);

      this.ticketResponse.assignedParticipantName = this.ticketResponse.assignedParticipantName;
      this.ticketResponse.priority = th.priority;
      this.ticketResponse.ticketName = th.ticketName;
      this.ticketResponse.description = th.description;
      this.ticketResponse.updatedDate = th.updatedDate;

      //console.log(ticketHistory);
      this.ticketService.ticketResponse.next(this.ticketResponse);

    });


  }

}
