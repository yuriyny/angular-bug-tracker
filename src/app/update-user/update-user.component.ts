import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../auth/shared/auth.service';
import { MyErrorStateMatcher } from '../auth/shared/my-error-state-matcher';
import { UserResponse } from '../auth/shared/user-response';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'update-user-button',
  templateUrl: 'update-user-button.html',
})
export class UpdateUserButton {

  constructor(public dialog: MatDialog) {}

  openDialog(user: UserResponse): void {
    console.log(user);
    
        const dialogRef = this.dialog.open(UpdateUserComponent, {
          width: '500px',
          data: {user:user}
        }); 
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed'); 
        }); 
 
         
     
  }
}

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})

export class UpdateUserComponent implements OnInit {

  updateUserForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  user: UserResponse;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData, private authService: AuthService, ) { }

  ngOnInit(): void {
    this.user = this.dialogData.user;
    this.updateUserForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
    });
    this.updateUserForm.get('username').setValue(this.user.username);
    this.updateUserForm.get('email').setValue(this.user.email);
  }

  updateUser(userForm: NgForm){
    this.user = {
      created: null,
      userId: this.user.userId,
      email: this.updateUserForm.get('email').value,
      username: this.updateUserForm.get('username').value,
    }
    this.authService.updateUser(this.user).subscribe(data =>{
      console.log(data);
      this.authService.localStorage.clear('username');
      this.authService.localStorage.store('username', data.username);
      this.authService.localStorage.clear('email');
      this.authService.localStorage.store('email', data.email);
      this.authService.currentUser.next(data);
      
    });

    
  }

}
