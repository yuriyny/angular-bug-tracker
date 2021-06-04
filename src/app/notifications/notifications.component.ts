import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/shared/auth.service';
import { NotificationDto } from '../projects/notification-dto';
import { ParticipantRequest } from '../projects/participant-request';
import { ProjectsService } from '../projects/projects.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Array<NotificationDto> = [];
  participantRequest: ParticipantRequest;
  constructor(private authService: AuthService, private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.notifications.subscribe(notf =>{
      this.projectsService.notificationList = notf;
      this.notifications = notf;
    })
  }

  acceptRequest(n: NotificationDto){
    this.participantRequest = {
      userId: n.receiverId,
      role: n.role,
      projectId: n.projectId
    }
    this.projectsService.addParticipant(this.participantRequest).subscribe(data =>{
      console.log(data);
      this.removeNotification(n);
    })
  }

  declineRequest(n: NotificationDto){
    this.removeNotification(n);
  }

  removeNotification(n: NotificationDto){
    this.projectsService.deleteNotification(n.notificationId).subscribe(res =>{
      this.notifications = this.notifications.filter(notf => notf !== n);
      this.projectsService.notifications.next(this.notifications);
    });
  }

}
