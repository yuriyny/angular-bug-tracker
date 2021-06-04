import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { CommentsService } from '../comments.service';
import { CommentDto } from './comment-dto';
import { CommentResponse } from './comment-response';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  commentForm: FormGroup;
  ticketId: number;
  comments: Array<CommentResponse> = [];
  commentDto: CommentDto;
  constructor(private activateRoute: ActivatedRoute, private commentService:CommentsService,
              private authService: AuthService) {
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });
    this.commentDto = {
      ticketId: this.activateRoute.snapshot.params.ticketId,
      text: '',
      participantName: ''
    }
   }

  ngOnInit(): void {
    this.ticketId = this.activateRoute.snapshot.params.ticketId;
    this.commentService.getCommentsByTicketId(this.ticketId).subscribe(comments =>{
    this.comments = comments;
    console.log(this.comments);
    
    }, error => {
      throwError(error);
    });
  }

  postComment(){
    
    this.commentDto.text = this.commentForm.get('text').value;
    this.commentDto.participantName = this.authService.getUserName();
    
    this.commentService.postComment(this.commentDto).subscribe(data => {
      console.log(data);
      
      this.commentForm.get('text').setValue('');
      this.getCommentsForPost();
    }, error => {
      throwError(error);
    });
    console.log("Comment posted");
  }

  private getCommentsForPost() {
    this.commentService.getCommentsByTicketId(this.ticketId).subscribe(data => {
      this.comments = data;
    }, error => {
      throwError(error);
    });
  }

}
