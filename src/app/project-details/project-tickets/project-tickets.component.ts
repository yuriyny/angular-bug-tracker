import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { TicketResponse } from 'src/app/tickets/ticket-response';
import { TicketsService } from 'src/app/tickets/tickets.service';

@Component({
  selector: 'app-project-tickets',
  templateUrl: './project-tickets.component.html',
  styleUrls: ['./project-tickets.component.scss']
})
export class ProjectTicketsComponent implements OnInit {
  displayedColumns = ['ticketId', 'ticketName', 'description', 'assignedParticipantName', 'priority', 'updatedDate', 'status', 'details'];
  dataSource: MatTableDataSource<TicketResponse>;
  //tickets: Array<TicketResponse> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor(private authService: AuthService, private activateRoute: ActivatedRoute, private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.ticketsService.getTicketsByProjectId(this.activateRoute.snapshot.params.projectId).subscribe(data => {
      this.ticketsService.ticketCardFilter.subscribe(ticketType => {
        if (ticketType === 'ALL') {        
          this.ticketsService.ticketList = data;
          this.dataSource = new MatTableDataSource(this.ticketsService.ticketList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.ticketsService.tickets.next(data);
          this.ticketsService.tickets.subscribe(data2 => {
            this.dataSource.data = data2;
          })
        }
        else if(ticketType === 'ASSIGNED') {         
          this.ticketsService.ticketList = data.filter(tikt => tikt.assignedParticipantName === this.authService.getUserName());
          this.dataSource = new MatTableDataSource(this.ticketsService.ticketList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.ticketsService.tickets.next(this.ticketsService.ticketList);
          this.ticketsService.tickets.subscribe(data2 => {
            this.dataSource.data = data2;
          })
        }
        else if(ticketType === 'CLOSED') {      
          this.ticketsService.ticketList = data.filter(tikt => tikt.status === "CLOSED");
          this.dataSource = new MatTableDataSource(this.ticketsService.ticketList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.ticketsService.tickets.next(this.ticketsService.ticketList);
          this.ticketsService.tickets.subscribe(data2 => {
            this.dataSource.data = data2;
          })
        }
      })

    }, error => {
      throwError(error);
    });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
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
