import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {addDays, formatDistance} from 'date-fns';
import {DashboardService} from '../../dashboard.service';
import {currentPathInterface, discussionContent} from '../../dashboardInterfaces/paht.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {File} from '@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system';

@Component({
  selector: 'app-all-announcements',
  templateUrl: './all-announcements.component.html',
  styleUrls: ['./all-announcements.component.css']
})
export class AllAnnouncementsComponent implements OnInit {

  inputValue: string;
  time = formatDistance(new Date(), addDays(new Date(), 2));
  showNew = false;
  textBoxHeight = '80px';
  minimized = '';
  discussions: discussionContent[] = [];
  noDiscussions = true;
  addDiscussionForm: FormGroup;
  commentIdForReply: number;
  fileToUploadReply:File;
  fileToUploadTypeReply: string;
  addReplyForm: FormGroup;

  constructor(private router: Router, private activatedRoute:ActivatedRoute,
              private api: DashboardService,  private fb: FormBuilder) {
    this.addDiscussionForm = this.fb.group({
      comment: [null, [Validators.required]]
    });
    this.addReplyForm = this.fb.group({
      comment: [null, [Validators.required]],
      img: [null],
      video: [null],
      audio: [null],
      document: [null]
    });
  }

  ngOnInit(): void {
    this.loadDiscussions();
  }

  submitReply(){
    this.api.submitReplyToAnnouncement(
      this.commentIdForReply,
      this.addReplyForm.controls['comment'].value,
      this.fileToUploadTypeReply,
      this.fileToUploadReply
    ).subscribe(data => {
      console.log(data);
      if(data.statusCode==201){
        this.addReplyForm.reset();
        this.loadDiscussions();
      }
    });
  }

  handleUploadReply(event: any, fileType: string, commentID: number): void {
    this.fileToUploadReply = event.target.files[0];
    this.fileToUploadTypeReply = fileType;
  }

  captureCommentID(commentID: number){
    this.commentIdForReply = commentID;
  }

  loadDiscussions(){
    this.api.getDiscussionList().subscribe(data => {
      if(data.posts.length){
        this.noDiscussions = false;
        this.discussions = data.posts;
      }
    });
  }

  submitAddActivityForm(){
    this.api.addDiscussion(
      this.addDiscussionForm.controls['comment'].value,
    ).subscribe(data => {
      if(data.statusCode==201){
        this.addDiscussionForm.reset();
        this.minimize();
        this.noDiscussions = true;
        this.loadDiscussions();
      }
    });
  }

  reformatDate(date:string){
    return this.api.reFormatDate(date);
  }

  onChange(value: string): void {
      if(this.inputValue == ''){
      this.ngOnInit();
    }else{
      this.discussions = this.discussions.filter(res => {
        return res.user.firstName.toLowerCase().match(this.inputValue.toLowerCase()) ||
        res.user.lastName.toLowerCase().match(this.inputValue.toLowerCase()) ||
        res.message.toLowerCase().match(this.inputValue.toLowerCase());
      });
    }
  }

  addNewAssignment(){
    this.router.navigate(['../add-new'], {relativeTo: this.activatedRoute});
  }

  showDrawer(){
    this.showNew = true;
  }

  toggleRows(){
    if(this.minimized==''){
      this.textBoxHeight = this.textBoxHeight=='80px' ? '145px' : '80px';
    }else{
      this.minimize();
    }

  }

  minimize(delCommentMode: boolean = false){
    if(this.minimized == '') this.addDiscussionForm.reset();
    this.minimized =  this.minimized =='minimized' ? '' : 'minimized';
    this.textBoxHeight = '80px';
  }
}
