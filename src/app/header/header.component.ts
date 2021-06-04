import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/shared/auth.service';
import { NotificationDto } from '../projects/notification-dto';
import { ProjectsService } from '../projects/projects.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string;
  headerName: string = '';
  notifications: Array<NotificationDto> = [];
  constructor(private authService: AuthService, private projectsService: ProjectsService, private router: Router ) { }

  ngOnInit(): void {
    this.username = this.authService.getUserName();
    this.projectsService.getParticipantNotifications().subscribe(notf =>{
      this.projectsService.notifications.next(notf);
      this.projectsService.notifications.subscribe(n =>{
        this.projectsService.notificationList = n;
        this.notifications = n;
      });
    
    });
    this.authService.currentUser.subscribe(cu => {
      if(cu != null){
        this.username = cu.username;
      }
    });
    this.authService.headerName.subscribe(name =>{
      this.headerName = name;
    });
  }

  setUserProfileTab(){
    this.authService.headerName.next("User Profile");
  }

  showNotification(n: NotificationDto){
    console.log(n);
    
  }

  showAllNotifications(){
    console.log("All notifications");
    
  }

  logout(){
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

}
