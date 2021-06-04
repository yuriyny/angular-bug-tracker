import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { MembersComponent } from './members/members.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ProjectsComponent } from './projects/projects.component';
import { TicketComponent } from './ticket/ticket.component';
import { TicketsComponent } from './tickets/tickets.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/home/dashboard', pathMatch: 'full'},
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuard]},
      { path: 'notifications', component: NotificationsComponent,canActivate: [AuthGuard]},
      { path: 'projects', component: ProjectsComponent,canActivate: [AuthGuard]},
      { path: 'tickets', component: TicketsComponent,canActivate: [AuthGuard]},
      { path: 'members', component: MembersComponent,canActivate: [AuthGuard]},
      { path: 'project/:projectId', component: ProjectDetailsComponent,canActivate: [AuthGuard]},
      { path: 'ticket/:ticketId', component: TicketComponent,canActivate: [AuthGuard]}
    ]},
  { path: 'sign-up', component: SignUpComponent},
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home/dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
