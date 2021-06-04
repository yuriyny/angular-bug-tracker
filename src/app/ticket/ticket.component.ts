import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { TicketResponse } from '../tickets/ticket-response';
import { TicketsService } from '../tickets/tickets.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  ticketId: number;
  ticketResponse: TicketResponse;
  constructor(private activateRoute: ActivatedRoute, private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.ticketId = this.activateRoute.snapshot.params.ticketId;
    this.ticketsService.getTicketById(this.ticketId).subscribe(ticket =>{
      this.ticketsService.ticketResponse.next(ticket);
      this.ticketsService.ticketResponse.subscribe(tr=>{
        this.ticketResponse = tr;
        //console.log(ticket);
        console.log("HERE");
        
        console.log(tr);
        
      })
      
      
    }, error => {
      throwError(error);
    });
  }
  getPriorityColor(priority: string): string {
    if (priority === 'LOW') return '#28a745';
    else if (priority === 'MEDIUM') return '#ffc107';
    else return '#dc3545';
  }

  getStatusColor(status: string): string {
    if (status === 'OPEN') return '#17a2b8';
    else return 'gray';
  }

}
