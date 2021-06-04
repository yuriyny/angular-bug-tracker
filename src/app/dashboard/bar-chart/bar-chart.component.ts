import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ProjectResponse } from 'src/app/projects/project-response';
import { ProjectsService } from 'src/app/projects/projects.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']

})

export class BarChartComponent implements OnInit {

  constructor(private projectsService: ProjectsService) { };

  ngOnInit(): void {
    this.projectsService.recentProjectsSubject.subscribe(rp => {
      this.projectsService.ownProjectsSubject.subscribe(op => {
        this.projectsService.participatedProjectsSubject.subscribe(pp =>{
          this.projectsService.notifications.subscribe(notf =>{
            if (rp && op && pp && notf) {
              this.barChartData = [
                { data: [rp.length, op.length, pp.length, notf.length], label: '' }
              ];
            }
          });        
        });       
      });     
    });

  }

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['New Projects', 'Created Projects', 'Participated Projects', 'Pending Projects'];

  barChartColors: Color[] = [
    {
      backgroundColor: ['#28a745',
        '#17a2b8',
        '#007bff', '#ffc107']
    },
  ];


  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [0, 37, 60, 70], label: '' }
  ];

}