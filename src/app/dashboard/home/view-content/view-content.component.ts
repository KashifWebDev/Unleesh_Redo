import {Component, OnInit} from '@angular/core';
import {addDays, formatDistance, parseISO} from 'date-fns';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardService} from '../../dashboard.service';
import {
  currentPathInterface,
  pathContentCommentContent,
  pathViewContent,
  pathViewContentDetails, rightBarUserDetails
} from '../../dashboardInterfaces/paht.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {File} from '@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system';
import {DomSanitizer} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {SideNavComponent} from '../../../shared/template/side-nav/side-nav.component';

@Component({
  selector: 'app-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.css']
})
export class ViewContentComponent implements OnInit {
  time = formatDistance(new Date(), addDays(new Date(), 2));
  textBoxHeight = '80px';
  minimized = '';
  private id: number;
  public path: number;
  private step: number;
  pathContent: pathViewContentDetails;
  addActivityForm: FormGroup;
  addReplyForm: FormGroup;
  pageData: pathViewContent["levels"][0]["actions"];
  nextButton: boolean = true;
  previousButton: boolean = true;
  loggedInUser: rightBarUserDetails;
  //For a new Comment
  fileToUpload:File;
  fileToUploadType: string = 'text';
  //For a new Reply
  fileToUploadReply:File;
  fileToUploadTypeReply: string = 'text';
  commentIdForReply: number;
  comments: pathContentCommentContent[];
  deleteCommentMode: boolean = false;
  delButtonLoading = false;
  delCommentTxt: string;
  delCommentId: number;
  delCommentIsReply: boolean;
  actionSubmitDescription: string = '';
  showPrompt: boolean = false;
  dynamicInputFieldsData: string[] = [];
  deleteCommentType: 'Comment' | 'Reply';
  private: boolean = false;
  privateReply: boolean = false;

  showPromptSubject = new Subject<boolean>();

  constructor(private route: ActivatedRoute, private API: DashboardService, private sanitizer: DomSanitizer,
              private router: Router, private fb: FormBuilder, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.showPromptSubject.subscribe(data => {
      console.log("SUB DATA: "+data);
      this.showPrompt = data
      console.log(this.showPrompt);
    });
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.path = +params.get('path');
      this.step = +params.get('step');
      this.getPageContent();
      this.startUp();
    })
    this.loggedInUser = this.API.userData;
    this.addActivityForm = this.fb.group({
      comment: [null, [Validators.required]],
      img: [null],
      video: [null],
      audio: [null],
      document: [null]
    });
    this.addReplyForm = this.fb.group({
      comment: [null, [Validators.required]],
      img: [null],
      video: [null],
      audio: [null],
      document: [null]
    });
    this.startUp();
  }

  privateClicked(event){
    this.private = !this.private;
  }

  startUp(){
    this.getPageContent();
    this.deleteCommentMode = false;
    this.showPrompt = false;
    this.private = false;
  }

  getPageContent(){
    this.pathContent = null;
    // console.log("id: "+this.id+" step: "+this.step);
    this.API.pathViewSteps(this.path).subscribe(data => {
      this.pageData = data.phases.find(x => x.id === this.id).levels[0].actions;
      this.pathContent = this.step == 6969 ? this.pageData[0] : this.pageData.find(x => x.id === this.step);
      this.actionSubmitDescription = this.pathContent.actionSubmitDescription;
      this.loadComments();

      // SHow/Hide next & Previous Buttons
      let index = this.pageData.findIndex(x => x.id === this.step);
      this.previousButton = !!this.pageData[index-1];
      this.nextButton = !!this.pageData[index+1];

    });
  }

  htmlContent(html: string){
    var filtered = html.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    // filtered = filtered.replace("&gt;", ">");
    return this.sanitizer.bypassSecurityTrustHtml(filtered)
  }

  submitAddActivityForm(){

    let reply: string = this.addActivityForm.controls['comment'].value;


    if(this.pathContent.submitOptions.type=='textFields'){
      let counter: number = 0;
      reply = '';
      this.pathContent.submitOptions.list.forEach(line => {
        reply += line.label+': '+this.dynamicInputFieldsData[counter]+'\n';
        counter++;
      })
    }
    // console.log(reply);

    this.API.submitComment(
      this.step,
      reply,
      this.fileToUploadType,
      this.fileToUpload,
      this.private
    ).subscribe(data => {
        if(data.statusCode==200){
          this.loadComments();
          this.addActivityForm.reset();
          this.minimized = '';
          this.updateTokens();
        }
      });
  }

  updateTokens(){
    this.API.getUserProfile(this.API.userData.id).subscribe(
      data => {
        // this.SideNav.userData.token = String(data.user.totalPoints);
        this.API.userTokensSubject.next(data.user.totalPoints);
      }
    );
  }

  submitReply(){
    this.API.submitReply(
      this.commentIdForReply,
      this.addReplyForm.controls['comment'].value,
      this.fileToUploadTypeReply,
      this.fileToUploadReply,
      this.privateReply
    ).subscribe(data => {
      // console.log(data);
        if(data.statusCode==201){
          this.loadComments();
          this.addReplyForm.reset();
          this.minimize();
        }
      });
  }

  toggleRows(){
    if(this.minimized==''){
      this.textBoxHeight = this.textBoxHeight=='80px' ? '145px' : '80px';
    }else{
      this.minimize();
    }

  }

  minimize(delCommentMode: boolean = false){
    this.deleteCommentMode = delCommentMode;
    if(this.minimized == '') this.addActivityForm.reset();
    // if(!delCommentMode) this.minimized =  this.minimized =='minimized' ? '' : 'minimized';
    this.minimized =  this.minimized =='minimized' ? '' : 'minimized';
    this.textBoxHeight = '80px';
  }

  gotoNextStep(){
    let index = this.pageData.indexOf(this.pathContent);
    if(index >= 0 && index < this.pageData.length - 1)
      this.router.navigate(['../', this.pageData[index + 1].id], {relativeTo: this.activatedRoute});


    // if(typeof this.pageData[this.step+1] !== 'undefined') {
    //   this.step++;
    //   this.getPageContent();
    //   this.previousButton = true;
    // }else{
    //   this.nextButton = false;
    // }
  }

  gotoPreviousStep(){
    let index = this.pageData.indexOf(this.pathContent);
    if(index >= 1 && index < this.pageData.length)
      this.router.navigate(['../', this.pageData[index - 1].id], {relativeTo: this.activatedRoute});

    // if(typeof this.pageData[this.step-1] !== 'undefined') {
    //   this.step--;
    //   this.getPageContent();
    //   this.nextButton = true;
    // }else{
    //   this.previousButton = false;
    // }
  }

  loadComments(){
    this.showPrompt = false;
    this.comments = null;
    this.API.loadComments(this.step).subscribe(data => {
      this.comments = data.feeds;

      this.comments.forEach(comment => {
        if(comment.activity.user.id == this.API.userData.id) this.showPromptSubject.next(true);
      })

    });
  }

  handleUpload(event: any, fileType: string): void {
    this.fileToUpload = event.target.files[0];
    this.fileToUploadType = fileType;
  }

  handleUploadReply(event: any, fileType: string, commentID: number): void {
    // console.log("handleUploadReply()");
    this.fileToUploadReply = event.target.files[0];
    this.fileToUploadTypeReply = fileType;
  }

  captureCommentID(commentID: number){
    this.commentIdForReply = commentID;
  }

  formatDate(date: Date | any){
    return formatDistance(
      parseISO(date),
      Date.now(),
      {addSuffix: true}
    )
  }

  commentEditable(userID){
    return this.API.userData.id === userID;
  }

  limitText(str: string){
    return str.length>35 ? str.slice(0,35)+'...' : str;
  }

  editCommentClick(comment: string, id: number, delType: 'Reply' | 'Comment'){
    this.deleteCommentType = delType;
    this.deleteCommentMode = true;
    this.showPrompt = false;
    this.delCommentTxt = comment;
    this.delCommentId = id;
    console.log(this.delCommentTxt);
    this.minimized = "";
    // this.minimize(false);
  }

  loadDelButton(): void {
    this.delButtonLoading = true;

    if(this.deleteCommentType == 'Reply'){
      this.API.deleteReply(this.delCommentId).subscribe(data => {
          if(data.statusCode==200){
            this.delButtonLoading = false;
            this.minimize();
            this.loadComments();
          }
        },
        error => {
          console.error(error);
        });
    }
    if(this.deleteCommentType == 'Comment'){
      this.API.deleteComment(this.delCommentId).subscribe(data => {
          if(data.statusCode==200){
            this.delButtonLoading = false;
            this.minimize();
            this.loadComments();
          }
        },
        error => {
          console.error(error);
        });
    }
    // this.API.deleteComment(this.delCommentId).subscribe(data => {
    //     if(data.statusCode==200){
    //       this.delButtonLoading = false;
    //       this.minimize();
    //       this.loadComments();
    //       this.private = false;
    //       this.updateTokens();
    //     }
    //   },
    //   error => {
    //     console.error(error);
    //   });
  }

  submitTypeButtons(value: string){
    this.addActivityForm.patchValue({
      comment: value,
    });
    console.log(this.addActivityForm.controls['comment'].value);
  }

}
