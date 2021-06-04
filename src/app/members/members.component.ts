import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { ParticipantDto } from '../project-details/project-members/participant-dto';
import { ProjectsService } from '../projects/projects.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  projectId: number;
  //projectParticipants: Array<ParticipantDto> = [];
  displayedColumns = ['username', 'email', 'projectName', 'role'];
  dataSource: MatTableDataSource<ParticipantDto>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private activateRoute: ActivatedRoute, private projectsServise: ProjectsService) { }

  ngOnInit(): void {
    //this.projectId = this.activateRoute.snapshot.params.projectId;
    this.projectsServise.getAllProjectParticipantsCurrentUser()
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
