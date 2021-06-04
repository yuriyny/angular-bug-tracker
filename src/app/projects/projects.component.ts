import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { throwError } from 'rxjs';
import { ProjectResponse } from './project-response';
import { ProjectsService } from './projects.service';
import { AuthService } from '../auth/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  displayedColumns = ['projectId', 'projectName', 'projectDescription', 'creator', 'details'];
  dataSource: MatTableDataSource<ProjectResponse>;
  //projects: Array<ProjectResponse> = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  projectDto: ProjectResponse;
  constructor(private router: Router, private projectsService: ProjectsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.projectsService.ownProjects.subscribe(isOwnProjects=>{
      if (isOwnProjects) {
        //this.projectsService.ownProjects.next(false);
        this.projectsService.getOwnProjectsForCurrentUser().subscribe(data => {
          this.projectsService.projectList = data;
          this.dataSource = new MatTableDataSource(this.projectsService.projectList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.projectsService.projects.next(data);
          this.projectsService.projects.subscribe(data2 => {
            this.dataSource.data = this.projectsService.projectList;
          })
          console.log(data);
        }, error => {
          throwError(error);
        });
      }
      else {
        this.projectsService.getProjectsByUsername(this.authService.getUserName()).subscribe(data => { 
          this.projectsService.projectList = data;
          //this.projects = data;
          this.dataSource = new MatTableDataSource(this.projectsService.projectList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.projectsService.projects.next(data);
          this.projectsService.projects.subscribe(data2 => {
            //this.projectsService.projectList.push(data2);
            this.dataSource.data = this.projectsService.projectList;
            //this.changeDetectorRefs.detectChanges();        
          })
          console.log(data);
        }, error => {
          throwError(error);
        });
      }
    })
    


  }
  /*
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  getProjectInfo(row) {
    console.log(row);

  }

  showProjectDetails(projectId: number) {
    this.router.navigate

  }





}


