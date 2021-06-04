import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, Injectable, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../auth/shared/auth.service';
import { MyErrorStateMatcher } from '../auth/shared/my-error-state-matcher';
import { UserResponse } from '../auth/shared/user-response';
import { NotificationDto } from '../projects/notification-dto';
import { ParticipantRequest } from '../projects/participant-request';
import { ProjectResponse } from '../projects/project-response';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'add-member-button',
  templateUrl: 'add-member-button.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberButton {
  
  @Input() projectId: number;
  isSideBarClicked = false;
  constructor(public dialog: MatDialog, private authService: AuthService, private projectService: ProjectsService) { }

  openDialog(): void {
    if (this.projectService.addMemberSidePanel) {
      this.projectService.addMemberSidePanel = false;
      this.isSideBarClicked = true;
      this.projectService.getProjectsForCurrentUser().subscribe(projects => {
        const dialogRef = this.dialog.open(AddMemberComponent, {
          width: '500px',
          data: { projects: projects, sidePanel: true }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      })
    }
    else {
      this.isSideBarClicked = false;
      //  this.authService.getAllUsers().subscribe(allUsers => {
      this.projectService.getProjectMembersByProjectId(this.projectId).subscribe(projectMembers => {
        const memberNames = projectMembers.map(a => a.username);
        this.authService.getAllUsersNotInList(memberNames).subscribe(userNotInList => {
          const dialogRef = this.dialog.open(AddMemberComponent, {
            width: '500px',
            data: { projectId: this.projectId, sidePanel: true, users: userNotInList }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
          });
        });
      });
      //  });
    }
  }
}

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {
  addMemberForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  participantRequest: ParticipantRequest;
  allUsers: UserResponse[];
  selectedUser: UserResponse;
  selectedRole: number;
  selectedProject: ProjectResponse;
  projectList: Array<ProjectResponse>;
  sideBarClick: boolean;
  projectId: number;
  notificationDto: NotificationDto;


  constructor(private authService: AuthService, private projectService: ProjectsService, public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData) {
  }

  ngOnInit(): void {
    this.addMemberForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required)
    });
    if (this.dialogData.projectId) {
      this.sideBarClick = false;
      this.projectId = this.dialogData.projectId;
      this.allUsers = this.dialogData.users;
    }
    else {
      this.projectList = this.dialogData.projects;
      this.sideBarClick = true;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addMember(form: NgForm) {
    this.participantRequest = {
      userId: this.selectedUser.userId,
      role: this.selectedRole,
      projectId: this.projectId
    }
    this.projectService.addParticipant(this.participantRequest).subscribe(data => {
      if (!this.projectService.addMemberFromProjectPage && this.sideBarClick) {
        this.projectService.getAllProjectParticipantsCurrentUser().subscribe(memberlist => {
          this.projectService.membersList = memberlist;
          this.projectService.members.next(memberlist);
        });
      }
      else {
        this.projectService.addMemberFromProjectPage = false;
        this.projectService.getProjectMembersByProjectId(this.participantRequest.projectId).subscribe(memberlist => {
          this.projectService.membersList = memberlist;
          this.projectService.members.next(memberlist);
        });
      }
    });
    form.reset();
  }

  updateMemberList(p: ProjectResponse) {
    this.selectedProject = p;
    this.projectId = p.projectId;
    //this.authService.getAllUsers().subscribe(allUsers => {
    this.projectService.getProjectMembersByProjectId(p.projectId).subscribe(projectMembers => {
      const memberNames = projectMembers.map(a => a.username);
      this.authService.getAllUsersNotInList(memberNames).subscribe(userNotInList => {
        this.allUsers = userNotInList;
      });
    });
    // });
  }

  sendNotification() {
    this.notificationDto = {
      notificationId: null,
      senderName: null,
      senderId: null,
      receiverName: this.addMemberForm.get('username').value.username,
      receiverId: this.addMemberForm.get('username').value.userId,
      projectName: null,
      projectId: this.projectId,
      role: this.addMemberForm.get('role').value,
      date: null
    }
    this.projectService.sendParticipantNotification(this.notificationDto).subscribe(res =>{
      console.log(res);
      console.log("Notification sent");
    })
    

  }
}
