import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MyErrorStateMatcher } from '../auth/shared/my-error-state-matcher';
import { ProjectResponse } from '../projects/project-response';
import { ProjectsService } from '../projects/projects.service';


@Component({
  selector: 'update-project-button',
  templateUrl: 'update-project-button.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectButton {
  projectId: number;
  projectName: string;
  projectDescription: string;
  @Input() project: ProjectResponse;


  constructor(private activateRoute: ActivatedRoute, public dialog: MatDialog, private projectsService: ProjectsService) { }

  openDialog(): void {
    this.projectId = this.activateRoute.snapshot.params.projectId;
    // this.projectsService.getProjectById(this.projectId).subscribe(project =>{


    const dialogRef = this.dialog.open(UpdateProjectComponent, {
      width: '500px',
      data: { project: this.project }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
    // });

  }

}



@Component({
  selector: 'app-update-project',
  templateUrl: './update-project.component.html',
  styleUrls: ['./update-project.component.scss']
})
export class UpdateProjectComponent implements OnInit {
  updateProjectForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<UpdateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public projectData,
    private projectService: ProjectsService) {
  }

  ngOnInit(): void {
    this.updateProjectForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
    console.log('======');
    console.log(this.projectData.project);
    this.updateProjectForm.get('projectName').setValue(this.projectData.project.projectName);
    this.updateProjectForm.get('description').setValue(this.projectData.project.projectDescription);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateProject(form: NgForm) {
    const projectDto: ProjectResponse = {
      creator: null,
      projectDescription: this.updateProjectForm.get('description').value,
      projectId: this.projectData.project.projectId,
      projectName: this.updateProjectForm.get('projectName').value
    }
    // this.projectDto.projectName = form.value.projectName;
    // this.projectDto.projectDescription = form.value.description;
    this.projectService.updateProject(projectDto).subscribe(data => { });
    this.dialogRef.close();
    //form.reset();

  }

}
