import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { throwError } from 'rxjs';
import { AuthService } from '../auth/shared/auth.service';
import { TicketResponse } from './ticket-response';
import { TicketsService } from './tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {
  displayedColumns = ['ticketId', 'ticketName', 'description', 'projectName','assignedParticipantName', 'priority', 'updatedDate', 'status', 'details'];
  dataSource: MatTableDataSource<TicketResponse>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private ticketsService: TicketsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.ticketsService.ticketPanelFilter.subscribe(ticketOption=>{
      if(ticketOption == 'ALL'){
      this.ticketsService.getTicketForCurrentUser().subscribe(data => {
        this.ticketsService.ticketList = data;
        this.dataSource = new MatTableDataSource(this.ticketsService.ticketList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ticketsService.tickets.next(data);
        this.ticketsService.tickets.subscribe(data2 => {
          this.dataSource.data = this.ticketsService.ticketList;
        })
        console.log(data);
  
      }, error => {
        throwError(error);
      });
    }
    else if(ticketOption == 'ASSIGNED'){
      this.ticketsService.getAssignedTicketForCurrentUser().subscribe(data => {
        this.ticketsService.ticketList = data;
        this.dataSource = new MatTableDataSource(this.ticketsService.ticketList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ticketsService.tickets.next(data);
        this.ticketsService.tickets.subscribe(data2 => {
          this.dataSource.data = this.ticketsService.ticketList;
        })
        console.log(data);
  
      }, error => {
        throwError(error);
      });
    }
    else if(ticketOption == 'OPEN'){
      this.ticketsService.getOpenTicketForCurrentUser().subscribe(data => {
        this.ticketsService.ticketList = data;
        this.dataSource = new MatTableDataSource(this.ticketsService.ticketList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ticketsService.tickets.next(data);
        this.ticketsService.tickets.subscribe(data2 => {
          this.dataSource.data = this.ticketsService.ticketList;
        })
        console.log(data);
  
      }, error => {
        throwError(error);
      });
    }
    else if(ticketOption == 'CLOSED'){
      this.ticketsService.getClosedTicketForCurrentUser().subscribe(data => {
        this.ticketsService.ticketList = data;
        this.dataSource = new MatTableDataSource(this.ticketsService.ticketList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.ticketsService.tickets.next(data);
        this.ticketsService.tickets.subscribe(data2 => {
          this.dataSource.data = this.ticketsService.ticketList;
        })
        console.log(data);
  
      }, error => {
        throwError(error);
      });
    }
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
