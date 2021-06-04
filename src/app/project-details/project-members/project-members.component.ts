import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { ProjectsService } from 'src/app/projects/projects.service';
import { ParticipantDto } from './participant-dto';

@Component({
  selector: 'app-project-members',
  templateUrl: './project-members.component.html',
  styleUrls: ['./project-members.component.scss']
})
export class ProjectMembersComponent implements OnInit {
  projectId: number;

  displayedColumns = ['username', 'email', 'role'];
  dataSource: MatTableDataSource<ParticipantDto>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private activateRoute: ActivatedRoute, private projectsServise: ProjectsService) { }

  ngOnInit(): void {
    this.projectId = this.activateRoute.snapshot.params.projectId;
    this.projectsServise.getProjectMembersByProjectId(this.projectId)
      .subscribe(data =>{
        this.projectsServise.membersList = data;
        this.dataSource = new MatTableDataSource(this.projectsServise.membersList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.projectsServise.members.next(data);
        this.projectsServise.members.subscribe(data2=>{
          this.dataSource.data = this.projectsServise.membersList;
        })
        console.log(data);
      }, error =>{
        throwError(error);
      });       
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

}
