import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { MyErrorStateMatcher } from '../shared/my-error-state-matcher';
import { LoginRequestPayload } from './login-request.payload';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userFormControl = new FormControl('', [
    Validators.required,
    //Validators.email,
    //Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);
  matcher = new MyErrorStateMatcher();
  isError: boolean;
  loginRequestPayload: LoginRequestPayload;
  registerSuccessMessage: string;
  constructor(private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router, private toastr: ToastrService) {
    this.loginRequestPayload = {
      username: '',
      password: ''
    };
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
    

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true') {
          this.toastr.success('Signup Successful');
          this.registerSuccessMessage = 'Please Check your inbox for activation email '
            + 'activate your account before you Login!';
        }
      });
  }

  login() {
    this.loginRequestPayload.username = this.loginForm.get('username').value;
    this.loginRequestPayload.password = this.loginForm.get('password').value;

    this.authService.login(this.loginRequestPayload).subscribe(data => {
      if (data) {
        this.isError = false;
        this.router.navigateByUrl('/home/dashboard');
        this.toastr.success('Login Successful');
      } else {
        this.isError = true;
      }
    });
  }


}
