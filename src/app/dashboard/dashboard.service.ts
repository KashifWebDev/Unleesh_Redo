import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {
  allPathMails, breakouts, breakoutUserStatus, createPathMail,
  currentPath, currentPathInterface, discussions,
  getPathMates, login, pathContentComment,
  pathDetail,
  pathView,
  rightBar, rightBarUserDetails, singleBreakout, thread,
  userPaths,
  userProfile
} from './dashboardInterfaces/paht.type';
import {Router} from '@angular/router';
import {FormGroup} from '@angular/forms';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  authToken: string = '';
  userData: rightBarUserDetails;
  currentPathSubject = new Subject<currentPathInterface>();
  userTokensSubject = new Subject<number>();

  constructor(private http: HttpClient,
              private router: Router) {
    if(this.isLoggedIn()){
      var data: rightBarUserDetails = JSON.parse(localStorage.getItem('userData'))
      this.authToken = data.token;
      this.userData = data;
    }
  }

  //v3/users/paths/
  getAllPaths(){
    return this.http.get<userPaths>(
      environment.API_Path+'v3/users/paths/',
      {params: this.attachToken()}
    );
  }

  //v3/users/currentPath/
  currentPath(){
    return this.http.get<currentPath>(
      environment.API_Path+'v3/users/currentPath/',
      {params: this.attachToken()}
    );
  }

  //v2/feed/
  rightBar(){
    return this.http.get<rightBar>(
      environment.API_Path+'v2/feed/',
      {params: this.attachToken()}
    );
  }

  breakoutUserStatuses(id: number){
    return this.http.get<breakoutUserStatus>(
      environment.API_Path+'v2/events/'+id+'/invitees/?id='+id+'&token='+this.authToken
    );
  }

  //v3/paths/:id/
  pathViewDetails(id: number){
    return this.http.get<pathDetail>(
      environment.API_Path+'v3/paths/'+id+'/',
      {params: this.attachToken()}
    );
  }

  //v3/paths/:id/phases/
  pathViewSteps(id: number){
    return this.http.get<pathView>(
      environment.API_Path+'v3/paths/'+id+'/phases/',
      {params: this.attachToken()}
    );
  }

  //v2/users/pathmates/
  getPathMates(){
    return this.http.get<getPathMates>(
      environment.API_Path+'v2/users/pathmates/',
      {params: this.attachToken()}
    );
  }

  // v2/events/users
  fetchUsersOfPath(pathID: number){
    let queryParams = new HttpParams();
    queryParams = queryParams.set("token",this.authToken);
    queryParams = queryParams.append("path",pathID);

    return this.http.get<createPathMail>(
      environment.API_Path+'v2/events/users/?token='+this.authToken+'&path='+pathID
    );
  }

  ///api/v2/users/:id/pathfolio/
  getUserProfile(id: number){
    return this.http.get<userProfile>(
      environment.API_Path+'v2/users/'+id+'/pathfolio/',
      {params: this.attachToken()}
    );
  }

  ///api/v2/pathmail/threads/
  getAllThreads(){
    return this.http.get<allPathMails>(
      environment.API_Path+'v2/pathmail/threads/',
      {params: this.attachToken()}
    );
  }

  // /v2/pathmail/users-paths/
  threadGetUsersPaths(){
    return this.http.get<createPathMail>(
      environment.API_Path+'v2/pathmail/users-paths/',
      {params: this.attachToken()}
    );
  }

  // /2/discussions/posts/'
  getDiscussionList(){
    return this.http.get<discussions>(
      environment.API_Path+'v2/discussions/posts/',
      {params: this.attachToken()}
    );
  }

  login(email: string, password: string){
    let body = new URLSearchParams();
    body.set('email', email);
    body.set('password', password);

    return this.http.post<login>(
      environment.API_Path+'v2/login/',
      body,
      {headers: this.postHeaders()}
    );
  }

  reset(email: string){
    let body = new URLSearchParams();
    body.set('email', email);

    return this.http.post<any>(
      environment.API_Path+'v2/users/reset-password/',
      body,
      {headers: this.postHeaders()}
    );
  }

  editProfile(ProfileData: FormGroup, file:any){
    let body = new FormData();
    console.log(ProfileData.value);
    body.append('firstName', ProfileData.controls['firstName'].value);
    body.append('lastName', ProfileData.controls['lastName'].value);
    body.append('company', ProfileData.controls['company'].value);
    body.append('profession', ProfileData.controls['profession'].value);
    body.append('education', ProfileData.controls['education'].value);
    body.append('email', ProfileData.controls['email'].value);
    body.append('zip', ProfileData.controls['zipCode'].value);
    if(file) body.append('file', file);

    // var data = new FormData();
    // data.append("firstName", "a");
    // data.append("lastName", "v");
    // data.append("company", "");
    // data.append("profession", "");
    // data.append("education", "");
    // data.append("email", "daniel.beller07@gmail.com");
    // data.append("zip", "");
    // data.append("file", file, "/C:/Users/mkash/Desktop/delme/icon-profile.png");

    return this.http.post<login>(
      environment.API_Path+'v2/users/edit-profile/',
      body,
      {
        // headers:
        //   new HttpHeaders({
        //     'Content-Type': 'multipart/form-data;',
        //     'Accept': '*/*',
        //   }),
        params: this.attachToken()
      }
    );
  }

  signup(body: FormData){

    return this.http.post<any>(
      environment.API_Path+'v2/users/',
      body,
      {
        // headers:
        //   new HttpHeaders({
        //     'Content-Type': 'multipart/form-data;',
        //     'Accept': '*/*',
        //   }),
        params: this.attachToken()
      }
    );
  }

  addDiscussion(comment: string){
    let body = new FormData();
    body.set('message', comment);
    body.set('attachmentType', 'text');
    // body.set('attachmentType', 'text');

    return this.http.post<any>(
      environment.API_Path+'v2/discussions/posts/',
      body,
      {headers: this.postHeadersFormData(), params: this.attachToken()}
    );
  }

  switchPath(pathID: number){
    return this.http.get<any>(
      environment.API_Path+'v2/paths/'+pathID+'/start/',
      {params: this.attachToken()}
    );
  }

  loadComments(pathID: number){
    return this.http.get<pathContentComment>(
      environment.API_Path+'v2/actions/'+pathID+'/submits/',
      {
        params: this.attachToken()
          .set('page', 1)
          .set('limit', 25)
      }
    );
  }

  submitComment(pathID: number, msg: string, attachmentType: string, file: any, mode: boolean){
    let body = new FormData();
    body.set('comment', msg);
    body.set('attachmentType', attachmentType);
    if(file) body.set('file', file);
    let url = mode ? environment.API_Path+'v2/actions/'+pathID+'/submit/private/' : environment.API_Path+'v2/actions/'+pathID+'/submit/';

    return this.http.post<any>(
      url,
      body,
      {
        params: this.attachToken()
      }
    );
  }

  submitReply(commentID: number, msg: string, attachmentType: string, file: any, mode: boolean = false){
    let body = new FormData();
    body.set('message', msg);
    body.set('attachmentType', attachmentType==undefined ? 'text' : attachmentType);
    if(file) body.set('file', file);
    // let url = mode ? environment.API_Path+'v2/actions/'+pathID+'/submit/private/' : environment.API_Path+'v2/actions/'+pathID+'/submit/';

    return this.http.post<any>(
      environment.API_Path+'v2/submits/'+commentID+'/comments/',
      body,
      {
        params: this.attachToken()
      }
    );
  }

  submitReplyToAnnouncement(commentID: number, msg: string, attachmentType: string, file: any){
    let body = new FormData();
    body.set('message', msg);
    if(file){
      body.set('attachmentType', attachmentType);
      body.set('file', file);
    }

    return this.http.post<any>(
      environment.API_Path+'v2/discussions/posts/'+commentID+'/replies/',
      body,
      {
        params: this.attachToken()
      }
    );
  }

  deleteComment(commentID: number){
    return this.http.delete<any>(
      environment.API_Path+'v2/submits/'+commentID+'/',
      {params: this.attachToken()}
    );
  }

  deleteReply(commentID: number){
    return this.http.delete<any>(
      environment.API_Path+'v2/discussions/posts/'+commentID+'/',
      {params: this.attachToken()}
    );
  }

  getThreadDetails(threadID: number){
    return this.http.get<thread>(
      environment.API_Path+'pathmail/threads/'+threadID+'/',
      {params: this.attachToken()}
    );
  }

  postThread(threadID: number, msg: string, attachmentType: string, file: any){
    let body = new FormData();
    body.set('message', msg);
    body.set('attachmentType', attachmentType);
    if(file) body.set('file', file);

    return this.http.post<thread>(
      environment.API_Path+'pathmail/threads/'+threadID+'/',
      body,
      {params: this.attachToken()}
    );
  }

  addBreakout(body: FormData){
    return this.http.post<any>(
      environment.API_Path+'v2/events/',
      body,
      {params: this.attachToken()}
    );
  }

  getAllBreakouts(){
    return this.http.get<breakouts>(
      environment.API_Path+'v2/events/',
      {params: this.attachToken()}
    );
  }

  getSingleBreakout(id: number){
    return this.http.get<singleBreakout>(
      environment.API_Path+'v2/events/'+id+'/',
      {params: this.attachToken()}
    );
  }

  changeBreakoutStatus(id: number, eventID: number){
    var body = new FormData();
    body.set('token', this.authToken);
    body.set('status', id.toString());

    return this.http.post<singleBreakout>(
      environment.API_Path+'v2/events/'+eventID+'/status/',
      body
    );
  }

  getAllCommentsBreakout(id: number){
    return this.http.get<pathContentComment>(
      environment.API_Path+'v2/events/'+id+'/comments/',
      {
        params: this.attachToken()
          .set('page', 1)
          .set('limit', 25)
      }
    );
  }

  submitReplyInBreakOut(breakoutID: number, msg: string, attachmentType: string, file: any){
    let body = new FormData();
    body.set('message', msg);
    body.set('attachmentType', attachmentType==undefined ? 'text' : attachmentType);
    if(file) body.set('file', file);

    return this.http.post<any>(
      environment.API_Path+'v2/events/'+breakoutID+'/comments/',
      body,
      {
        params: this.attachToken()
      }
    );
  }

  submitCreateThread(data: FormData){
    return this.http.post<any>(
      environment.API_Path+'v2/pathmail/threads/',
      data,
      {params: this.attachToken()}
    );
  }

  checkAccessCode(code: any){
    var body = new FormData();
    body.append("accessCode", code);

    return this.http.post<any>(
      environment.API_Path+'v2/paths/access_code/',
      body,
      {params: this.attachToken(), headers: this.postHeadersFormData()}
    );
  }

  attachToken(){
    return new HttpParams().set("token",this.authToken)
  }

  reFormatDate(unixTimeStamp: string){
    return new Date(unixTimeStamp).toLocaleString('en-US');
  }

  setSession(userData: rightBarUserDetails) {
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  setCurrentPath(currentPath: currentPathInterface) {
    localStorage.setItem("currentPath", JSON.stringify(currentPath));
  }

  getCurrentPath(){
    var data: currentPathInterface = JSON.parse(localStorage.getItem('currentPath'))
    return data;
  }

  logout(){
    this.deleteSession();
    this.router.navigate(['/']);
  }

  deleteSession(){
    localStorage.removeItem("userData");
    localStorage.removeItem("currentPath");
  }

  isLoggedIn(){
    return localStorage.getItem("userData") !== null;
  }

  postHeaders(){
    return new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*',
    });
  }

  postHeadersFormData(){
    return new HttpHeaders({
      // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*',
    });
  }

  imgFix(img: string){
    return img ? img.replace('8288', '') : 'https://web.unleeshadmin.com/users/c9daa521fa7df1dec5ff92ae0cb0d2e38071ec58.png';
  }

}
