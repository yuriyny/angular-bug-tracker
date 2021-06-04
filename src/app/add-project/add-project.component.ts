import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MyErrorStateMatcher } from '../auth/shared/my-error-state-matcher';
import { ProjectResponse } from '../projects/project-response';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'add-project-button',
  templateUrl: 'add-project-button.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectButton {
  projectId: number;
  projectName: string;
  projectDescription: string;
  userFormControl = new FormControl('', [
    Validators.required,
  ]);


  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '500px',
      data: { projectName: this.projectName, projectDescription: this.projectDescription }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

}


@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public projectDto: ProjectResponse,
    private projectService: ProjectsService) {
    this.projectDto = {
      projectId: null,
      projectName: '',
      projectDescription: '',
      creator: ''

    }
  }

  ngOnInit(): void {
    this.addProjectForm = new FormGroup({
      projectname: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addProject(form: NgForm) {

    this.projectDto.projectName = form.value.projectname;
    this.projectDto.projectDescription = form.value.description;
    console.log(this.projectDto);

    //this.projectService.projectList.push(this.projectDto);
    this.projectService.addProject(this.projectDto).subscribe(data => {
      this.projectService.projectList.push(data);
      this.projectService.projects.next(data);
    });
    this.dialogRef.close();
    //form.reset(); 
  }
  /*
  open(content) {

    this.modalService.open(content, {
      centered:true
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {

    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  */

}



