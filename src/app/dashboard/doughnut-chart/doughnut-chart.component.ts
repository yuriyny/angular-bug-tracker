import { Component, OnInit } from '@angular/core';
import { Color } from 'ng2-charts';
import { ProjectsService } from 'src/app/projects/projects.service';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit {

  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getProjectByRole("ADMIN").subscribe(adminProjects => {
      this.projectsService.getProjectByRole("USER").subscribe(userProjects => {
        this.pieChartData = [adminProjects.length, userProjects.length];
      });
    });
  }

  public pieChartLabels: string[] = ['Admin', 'User'];
  public pieChartData: number[] = [80, 20];
  public pieChartType: string = 'doughnut';

  public chartClicked(e: any): void {
    //console.log(e);
  }

  doughnutChartColors: Color[] = [
    {
      backgroundColor: ['#dc3545', '#007bff']
    },
  ];

  public chartHovered(e: any): void {
    //console.log(e);
  }

}
