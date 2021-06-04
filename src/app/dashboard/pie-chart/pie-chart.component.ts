import { Component, Input, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';
import { TicketResponse } from 'src/app/tickets/ticket-response';
import { TicketsService } from 'src/app/tickets/tickets.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  openTickets: Array<TicketResponse>;

  constructor(private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.ticketsService.openTicketsSubject.subscribe(ot => {
      this.ticketsService.closedTicketsSubject.subscribe(ct => {
        if (ot && ct) {
          this.pieChartData = [ot.length, ct.length];
        }
      });
    });
  }

  public pieChartLabels: string[] = ['Open', 'Closed'];
  public pieChartData: number[] = [0, 0];
  public pieChartType: string = 'pie';

  public chartClicked(e: any): void {
    //console.log(e);
  }

  barChartColors: Color[] = [
    {
      backgroundColor: ['#28a745', '#17a2b8']
    },
  ];

  public chartHovered(e: any): void {
    //console.log(e);
  }

}
