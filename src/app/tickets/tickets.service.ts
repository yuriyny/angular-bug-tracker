import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TicketHistoryDto } from './ticket-history-dto';
import { TicketResponse } from './ticket-response';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  tickets = new BehaviorSubject<Array<TicketResponse>>(null);
  ticketList: Array<TicketResponse> = [];
  ticketPanelFilter = new BehaviorSubject<string>("ALL");
  ticketCardFilter = new BehaviorSubject<string>('ALL');

  ticketResponse = new BehaviorSubject<TicketResponse>(null);
  openTicketsSubject = new BehaviorSubject<Array<TicketResponse>>(null);
  closedTicketsSubject = new BehaviorSubject<Array<TicketResponse>>(null);
  constructor(private http: HttpClient) { }

  addTicket(ticketResponse: TicketResponse): Observable<any> {
    return this.http.post('http://localhost:8080/api/ticket', ticketResponse);
  }

  getTicketsByProjectName(projectname: string): Observable<Array<TicketResponse>> {
    return this.http.get<Array<TicketResponse>>('http://localhost:8080/api/ticket/by-projectname/' + projectname);
  }

  getTicketsByProjectId(projectId: number): Observable<Array<TicketResponse>>{
    return this.http.get<Array<TicketResponse>>('http://localhost:8080/api/ticket/by-projectid/' + projectId);
  }

  getTicketById(ticketId: number): Observable<TicketResponse> {
    return this.http.get<TicketResponse>('http://localhost:8080/api/ticket/by-id/' + ticketId);
  }

  updateTicket(ticketHistorydto: TicketHistoryDto): Observable<any> {
    return this.http.post('http://localhost:8080/api/ticket/update', ticketHistorydto);
  }

  getTicketHistory(ticketId: number): Observable<Array<TicketHistoryDto>>{
    return this.http.get<Array<TicketHistoryDto>>('http://localhost:8080/api/ticket/ticket-history/' + ticketId);
  }

  getTicketForCurrentUser(): Observable<Array<TicketResponse>> {
    return this.http.get<Array<TicketResponse>>('http://localhost:8080/api/ticket/tickets-current-user');
  }
  getAssignedTicketForCurrentUser(): Observable<Array<TicketResponse>> {
    return this.http.get<Array<TicketResponse>>('http://localhost:8080/api/ticket/tickets-assigned-current-user');
  }
  getCreatedTicketByCurrentUser(): Observable<Array<TicketResponse>> {
    return this.http.get<Array<TicketResponse>>('http://localhost:8080/api/ticket/tickets-created-by-user');
  }

  getOpenTicketForCurrentUser(): Observable<Array<TicketResponse>> {
    return this.http.get<Array<TicketResponse>>('http://localhost:8080/api/ticket/tickets-open-current-user');
  }

  getClosedTicketForCurrentUser(): Observable<Array<TicketResponse>> {
    return this.http.get<Array<TicketResponse>>('http://localhost:8080/api/ticket/tickets-closed-current-user');
  }


}
