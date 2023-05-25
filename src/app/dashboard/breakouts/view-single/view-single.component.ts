import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../../dashboard.service';
import {breakoutUserStatus, discussionReply, pathContentCommentContent, singleBreakout} from '../../dashboardInterfaces/paht.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {File} from '@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system';

@Component({
  selector: 'app-view-single',
  templateUrl: './view-single.component.html',
  styleUrls: ['./view-single.component.css']
})
export class ViewSingleComponent implements OnInit {
  public id: number;
  breakout: singleBreakout['event'];
  pathIsVisible: boolean = false;
  selectView: boolean = false;
  myStatusText: string = 'Going';
  myStatusIcon: string = 'check';
  invitedCount: number;
  goingCount: number;
  cantCount: number;
  addReplyForm: FormGroup;
  fileToUploadReply:File;
  fileToUploadTypeReply: string = 'text';
  comments: discussionReply[] = [];



  goingUsers: breakoutUserStatus['users'][0]['user'][] = [];
  notGoing: breakoutUserStatus['users'][0]['user'][] = [];
  invited: breakoutUserStatus['users'][0]['user'][] = [];
  modalContent: 'going' | 'notGoing' | 'invited';

  constructor(private route: ActivatedRoute,
              public api: DashboardService, private fb: FormBuilder) {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
    })
    this.getBreakoutData();
  }

  ngOnInit(): void {
    this.addReplyForm = this.fb.group({
      comment: [null, [Validators.required]],
      img: [null],
      video: [null],
      audio: [null],
      document: [null]
    });
  }

  submitReply(){
    this.api.submitReplyInBreakOut(
      this.id,
      this.addReplyForm.controls['comment'].value,
      this.fileToUploadTypeReply,
      this.fileToUploadReply,
    ).subscribe(data => {
      // console.log(data);
      if(data.statusCode==201){
        this.addReplyForm.reset();
        this.loadComments();
      }
    });
  }

  handleUploadReply(event: any, fileType: string): void {
    // console.log("handleUploadReply()");
    this.fileToUploadReply = event.target.files[0];
    this.fileToUploadTypeReply = fileType;
  }

  changeMyStatus(status: number, breakout: singleBreakout['event']){
    this.reflectNewChanges(status, breakout);
    this.api.changeBreakoutStatus(status, this.id).subscribe(data =>{
      if(data.statusCode == 201){
        this.selectView = false;
      }
    });
    this.getBreakoutData();
  }

  reflectNewChanges(status: number, breakout: singleBreakout['event']){
    if(status==4) { this.myStatusText = 'Going'; this.myStatusIcon = 'check' }
    if(status==3) { this.myStatusText = 'Maybe'; this.myStatusIcon = 'question-circle' }
    if(status==2) { this.myStatusText = 'Not Going'; this.myStatusIcon = 'close-circle' }
  }

  getBreakoutData(){
    this.api.getSingleBreakout(this.id).subscribe(data => {
      this.breakout = data.event;
      this.reflectNewChanges(data.event.status, data.event);
    });

    this.loadComments();
    this.fetchStatus();
  }

  loadComments(){
    this.api.getAllCommentsBreakout(this.id).subscribe(data => {
      this.comments = data.posts;
    });
  }

  handleOk(): void {
    this.pathIsVisible = false;
  }
  showPathModal(type: 'going' | 'notGoing' | 'invited'): void {
    this.modalContent = type;
    this.pathIsVisible = true;
    this.fetchStatus();
  }
  handleCancel(): void {
    this.pathIsVisible = false;
  }

  fetchStatus(){
    this.goingUsers = [];
    this.notGoing = [];
    this.invited = [];
    this.api.breakoutUserStatuses(this.id).subscribe(data=>{
      let users = data.users;
      users.forEach(user => {
        this.invited.push(user.user);
      })
      users.forEach(user => {
        if(user.status==4) this.goingUsers.push(user.user);
        if(user.status==2) this.notGoing.push(user.user);
      })
      this.goingCount = this.goingUsers.length;
      this.cantCount = this.notGoing.length;
      this.invitedCount = this.invited.length;
    });
  }

}
