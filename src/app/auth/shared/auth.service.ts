import { EventEmitter, Injectable, Output } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { SignupRequestPayload } from '../sign-up/signup-request.payload';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginResponse } from '../login/login-response';
import { LoginRequestPayload } from '../login/login-request.payload';
import { map, tap } from 'rxjs/operators';
import { UserResponse } from './user-response';
import { PasswordDto } from 'src/app/update-password/password-dto';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();
  headerName = new BehaviorSubject<string>('');
  currentUser = new BehaviorSubject<UserResponse>(null);
  isLoading = new BehaviorSubject<boolean>(false);
  
  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }
  
  constructor(private httpClient: HttpClient,
    public localStorage: LocalStorageService) {
  }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post('http://localhost:8080/api/auth/signup', signupRequestPayload, { responseType: 'text' });
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/login',
      loginRequestPayload).pipe(map(data => {
        //console.log(data);
        
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', data.expiresAt);

        this.loggedIn.emit(true);
        this.username.emit(data.username);

        return true;
      }));
  }

  refreshToken() {
    const refreshTokenPayload = {
      refreshToken: this.getRefreshToken(),
      username: this.getUserName()
    }
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/refresh/token',
      refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');
        this.localStorage.store('authenticationToken', response.authenticationToken);
        this.localStorage.store('expiresAt', response.expiresAt);
      }));
  }

  getJwtToken() {
    console.log();
    
    return this.localStorage.retrieve('authenticationToken');
  }

  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }

  getExpirationTime() {
    return this.localStorage.retrieve('expiresAt');
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }

  logout() {
    this.httpClient.post('http://localhost:8080/api/auth/logout', this.refreshTokenPayload,
      { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
  }

  getAllUsers(){
    return this.httpClient.get<Array<UserResponse>>('http://localhost:8080/api/auth/all-users');
  }

  getAllUsersNotInList(users: Array<String>): Observable<any>{
    return this.httpClient.post('http://localhost:8080/api/auth/all-users-not-in-list', users);
  }

  getCurrentUserData():Observable<UserResponse>{
    return this.httpClient.get<UserResponse>('http://localhost:8080/api/auth/get-user-data');
  }

  updateUser(user: UserResponse):Observable<UserResponse>{
    return this.httpClient.post<UserResponse>('http://localhost:8080/api/auth/update-user', user);
  }

  updatePassword(password: PasswordDto):Observable<Boolean>{
    return this.httpClient.post<Boolean>('http://localhost:8080/api/auth/update-password', password);
  }


}