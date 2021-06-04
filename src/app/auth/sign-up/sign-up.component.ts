import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignupRequestPayload } from './signup-request.payload';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../shared/auth.service';
import { MyErrorStateMatcher } from '../shared/my-error-state-matcher';
import { MustMatch } from '../shared/must-match-validator';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;
  signupRequestPayload: SignupRequestPayload;
  matcher = new MyErrorStateMatcher();

  constructor(private authservice: AuthService,
    private router: Router,
    private toastr: ToastrService, private formBuilder: FormBuilder) {
    this.signupRequestPayload = {
      username: '',
      email: '',
      password: ''
    };
  }

  ngOnInit(): void {

    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    } as AbstractControlOptions);
  }

  signup() {
    console.log("Signup triggered");
    this.signupRequestPayload.username = this.signupForm.get('username').value;
    this.signupRequestPayload.email = this.signupForm.get('email').value;
    this.signupRequestPayload.password = this.signupForm.get('password').value;

    this.authservice.signup(this.signupRequestPayload)
      .subscribe(() => {
        this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }, () => {
        this.toastr.error('Registration Failed! Please try again');
      });
  }

  passwordErrorMatcher = {
    isErrorState: (control: FormControl, form: FormGroupDirective): boolean => {
      const controlInvalid = control.touched && control.invalid;

      return controlInvalid;
    }
  }



}
