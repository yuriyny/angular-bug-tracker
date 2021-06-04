import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../auth/shared/auth.service';
import { MustMatch } from '../auth/shared/must-match-validator';
import { MyErrorStateMatcher } from '../auth/shared/my-error-state-matcher';
import { PasswordDto } from './password-dto';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'update-password-button',
  templateUrl: 'update-password-button.html',
})
export class UpdatePasswordButton {


  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(UpdatePasswordComponent, {
      width: '500px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });



  }
}


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  passwordDto: PasswordDto;
  oldPassword: string;
  newPassword: string;
  updatePasswordForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData, private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.updatePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    } as AbstractControlOptions);
  }

  updatePassword(passwordForm: NgForm) {
    this.passwordDto = {
      oldPassword: this.updatePasswordForm.get('oldPassword').value,
      newPassword: this.updatePasswordForm.get('password').value,
    }
    console.log(this.passwordDto);
    
    this.authService.updatePassword(this.passwordDto).subscribe(bool => {
      console.log(bool);
      
     });
  }

  passwordErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      const controlInvalid = control.touched && control.invalid;

      return controlInvalid;
    }
  }

}
