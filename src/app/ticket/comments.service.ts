import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentDto } from './comments/comment-dto';
import { CommentResponse } from './comments/comment-response';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getCommentsByTicketId(ticketId: number): Observable<Array<CommentResponse>>{
    return this.http.get<Array<CommentResponse>>('http://localhost:8080/api/ticket/comments/by-ticketid/' + ticketId);
  }
  postComment(commentDto: CommentDto): Observable<any>{
    
    return this.http.post<any>('http://localhost:8080/api/ticket/add-comment', commentDto);
  }
}
