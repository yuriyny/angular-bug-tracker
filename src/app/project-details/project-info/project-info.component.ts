import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { ProjectResponse } from 'src/app/projects/project-response';
import { ProjectsService } from 'src/app/projects/projects.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit {
  projectResponse: ProjectResponse;
  projectId: number;
  project: ProjectResponse;
  constructor(private activateRoute: ActivatedRoute, private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectId = this.activateRoute.snapshot.params.projectId;
    this.projectsService.getProjectById(this.projectId).subscribe(project => {
      this.project = project;
      this.projectResponse = project;         
    }, error => {
      throwError(error);
    });
    
    
  }

}
