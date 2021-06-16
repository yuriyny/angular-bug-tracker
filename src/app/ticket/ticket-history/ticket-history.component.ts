import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TicketHistoryDto } from 'src/app/tickets/ticket-history-dto';
import { TicketsService } from 'src/app/tickets/tickets.service';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.component.html',
  styleUrls: ['./ticket-history.component.scss']
})
export class TicketHistoryComponent implements OnInit {
  displayedColumns = ['ticketName', 'description', 'priority', 'assignedParticipant', 'updateParticipant', 'updatedDate'];
  dataSource: MatTableDataSource<TicketHistoryDto>;
  ticketHistory: Array<TicketHistoryDto> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private activateRoute: ActivatedRoute, private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.ticketsService.getTicketHistory(this.activateRoute.snapshot.params.ticketId).subscribe(data=>{
      this.ticketHistory = data;
      this.dataSource = new MatTableDataSource(this.ticketHistory);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(data);
      
    })
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

}
