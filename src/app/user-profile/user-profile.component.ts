import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/shared/auth.service';
import { UserResponse } from '../auth/shared/user-response';
import { UpdatePasswordButton } from '../update-password/update-password.component';
import { UpdateUserButton } from '../update-user/update-user.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  username = '';
  email = '';
  registrationDate = null;
  user: UserResponse;
  constructor(public authService: AuthService, private updateUserButton: UpdateUserButton,
    private updatePasswordButton: UpdatePasswordButton) { }

  ngOnInit(): void {
    this.authService.getCurrentUserData().subscribe(data => {
      this.user = data;
      this.username = data.username;
      this.email = data.email;
      this.registrationDate = data.created;
      this.authService.currentUser.subscribe(cu => {
        if (cu != null) {
          this.username = cu.username;
          this.email = cu.email;
        }
      })

    })
  }

  updateUser() {
    this.updateUserButton.openDialog(this.user);
  }
  updatePassword(){
    this.updatePasswordButton.openDialog();
  }

}
