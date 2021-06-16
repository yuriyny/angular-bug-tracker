import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ParticipantDto } from '../project-details/project-members/participant-dto';
import { NotificationDto } from './notification-dto';
import { ParticipantRequest } from './participant-request';
import { ProjectResponse } from './project-response';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  projects = new BehaviorSubject<Array<ProjectResponse>>(null);
  members = new BehaviorSubject<Array<ParticipantDto>>(null);
  projectList: Array<ProjectResponse> = [];
  membersList: Array<ParticipantDto> = [];
  addTicketSidePanel = false;
  addMemberSidePanel = false;
  addMemberFromProjectPage = false;
  ownProjects = new BehaviorSubject<Boolean>(false);
  notificationList: Array<NotificationDto> = [];
  notifications = new BehaviorSubject<Array<NotificationDto>>(null);
  recentProjects: Array<ProjectResponse> = [];
  recentProjectsSubject = new BehaviorSubject<Array<ProjectResponse>>(null);
  ownProjectsSubject = new BehaviorSubject<Array<ProjectResponse>>(null);
  participatedProjectsSubject = new BehaviorSubject<Array<ProjectResponse>>(null);


  constructor(private http: HttpClient) { }

  addProject(projectResponse: ProjectResponse): Observable<any> {
    return this.http.post('http://localhost:8080/api/project', projectResponse);
  }

  getProjects(id: number): Observable<Array<ProjectResponse>> {
    return this.http.get<Array<ProjectResponse>>('http://localhost:8080/api/project/by-user/' + id);
  }

  getProjectsByUsername(username: string): Observable<Array<ProjectResponse>> {
    return this.http.get<Array<ProjectResponse>>('http://localhost:8080/api/project/by-username/' + username);
  }

  getProjectById(projectid: number): Observable<ProjectResponse>{
    return this.http.get<ProjectResponse>('http://localhost:8080/api/project/get-project/' + projectid);
  }

  getProjectMembersByProjectId(projectId: number): Observable<Array<ParticipantDto>>{
    return this.http.get<Array<ParticipantDto>>('http://localhost:8080/api/project/get-participants/' + projectId);
  }

  addParticipant(participantRequest: ParticipantRequest): Observable<any> {
    return this.http.post('http://localhost:8080/api/project/add-participant', participantRequest);
  }

  updateProject(projectResponse: ProjectResponse): Observable<any> {
    return this.http.post('http://localhost:8080/api/project/update', projectResponse);
  }

  getProjectsForCurrentUser(): Observable<Array<ProjectResponse>> {
    return this.http.get<Array<ProjectResponse>>('http://localhost:8080/api/project/get-projects');
  }

  getOwnProjectsForCurrentUser(): Observable<Array<ProjectResponse>> {
    return this.http.get<Array<ProjectResponse>>('http://localhost:8080/api/project/get-own-projects');
  } 

  getAllProjectParticipantsCurrentUser(): Observable<Array<ParticipantDto>>{
    return this.http.get<Array<ParticipantDto>>('http://localhost:8080/api/project/get-participants-all');
  }

  getCurrentProjectParticipant(projectid: number): Observable<ParticipantDto>{
    return this.http.get<ParticipantDto>('http://localhost:8080/api/project/get-participant/' + projectid);
  }

  sendParticipantNotification(notificationDto: NotificationDto):Observable<NotificationDto>{
    return this.http.post<NotificationDto>('http://localhost:8080/api/project/send-notification', notificationDto);
  }

  getParticipantNotifications():Observable<Array<NotificationDto>>{
    return this.http.get<Array<NotificationDto>>('http://localhost:8080/api/project/get-notifications');
  }

  deleteNotification(id: number):Observable<boolean>{
    return this.http.delete<boolean>('http://localhost:8080/api/project/delete-notification/' + id);
  }

  getRecentProjects():Observable<Array<ProjectResponse>>{
    return this.http.get<Array<ProjectResponse>>('http://localhost:8080/api/project/get-recent-projects');
  }

  getProjectByRole(role: string): Observable<Array<ProjectResponse>>{
    return this.http.get<Array<ProjectResponse>>('http://localhost:8080/api/project/get-projects-by-role/' + role);
  }





}
