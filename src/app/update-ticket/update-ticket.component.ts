import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddTicketComponent } from '../add-ticket/add-ticket.component';
import { MyErrorStateMatcher } from '../auth/shared/my-error-state-matcher';
import { ParticipantDto } from '../project-details/project-members/participant-dto';
import { ProjectResponse } from '../projects/project-response';
import { ProjectsService } from '../projects/projects.service';
import { TicketHistoryDto } from '../tickets/ticket-history-dto';
import { TicketResponse } from '../tickets/ticket-response';
import { TicketsService } from '../tickets/tickets.service';

@Component({
  selector: 'update-ticket-button',
  templateUrl: 'update-ticket-button.html',
  styleUrls: ['./update-ticket.component.scss']
})
export class UpdateTicketButton {
  //projectId: number;
  @Input() ticketId: number;



  constructor(public dialog: MatDialog, private ticketService: TicketsService) {}

  openDialog(): void {
      this.ticketService.getTicketById(this.ticketId).subscribe(ticket=>{    
        const dialogRef = this.dialog.open(UpdateTicketComponent, {
          width: '500px',
          data: {ticket: ticket}
        }); 
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed'); 
        }); 
      })    
         
     
  }
}



@Component({
  selector: 'app-update-ticket',
  templateUrl: './update-ticket.component.html',
  styleUrls: ['./update-ticket.component.scss']
})
export class UpdateTicketComponent implements OnInit {

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
  constructor(private projectService: ProjectsService, private ticketService: TicketsService, public dialogRef: MatDialogRef<AddTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) { }

  ngOnInit(): void {
    this.updateTicketForm = new FormGroup({
      ticketName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      assignTo: new FormControl('', Validators.required),
      priority: new FormControl('', Validators.required)
    });
    this.ticketResponse = this.dialogData.ticket;
    this.updateTicketForm.get('ticketName').setValue(this.ticketResponse.ticketName);
    this.updateTicketForm.get('description').setValue(this.ticketResponse.description);
    this.projectService.getProjectMembersByProjectId(this.dialogData.ticket.projectId).subscribe(members=>{
      this.memberList = members;
      
    }); 
    //prepopulate forms for the current ticket

    // this.projectList.push(this.dialogData.project);
    // this.selectedProject = this.dialogData.project.projectName; 
    // this.projectsService.getProjectMembersByProjectId(this.dialogData.project.projectId).subscribe(members=>{
    //   this.memberList = members;
    // });  
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTicket(form: NgForm){
    // this.ticketResponse = {
    //   ticketId: null,
    //   ticketName: form.value.ticketName,
    //   projectName: this.selectedProject, 
    //   description: form.value.description,
    //   priority: this.priority,
    //   createdDate: null,
    //   updatedDate: null,
    //   assignedParticipant: this.assignTo.participantId,
    //   participantName: null
    // }
    // this.ticketsService.addTicket(this.ticketResponse).subscribe(data=>{
    //   this.ticketsService.ticketList.push(data);
    //   this.ticketsService.tickets.next(data);
    //   console.log(data);     
    // });
    // form.reset(); 
    console.log(form.value.ticketName);
    console.log(this.ticketResponse);
    console.log(this.assignTo);
    
    
    this.ticketHistoryDto = {
      ticketHistoryId: null,
      ticketName: this.updateTicketForm.get('ticketName').value, 
      description: this.updateTicketForm.get('description').value,
      ticket: this.ticketResponse.ticketId,
      updatedDate: null,
      priority: this.updateTicketForm.get('priority').value,
      updateParticipant: null,
      assignedParticipant: this.updateTicketForm.get('assignTo').value.participantId
    }

    this.ticketService.updateTicket(this.ticketHistoryDto).subscribe(th=>{
      console.log(th);
      
      this.ticketResponse.assignedParticipantName = this.updateTicketForm.get('assignTo').value.username;
      this.ticketResponse.priority = th.priority;
      this.ticketResponse.ticketName = th.ticketName;
      this.ticketResponse.description = th.description;
      this.ticketResponse.updatedDate = th.updatedDate;

      //console.log(ticketHistory);
      this.ticketService.ticketResponse.next(this.ticketResponse);
      
    });
    
    
  }
}
