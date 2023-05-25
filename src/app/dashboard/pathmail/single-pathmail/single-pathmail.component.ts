import {Component, OnInit} from '@angular/core';
import {AppsService} from '../../../shared/services/apps.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardService} from '../../dashboard.service';
import {pathMailAuthor, threadDetails} from '../../dashboardInterfaces/paht.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {File} from '@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system';

@Component({
  selector: 'app-single-pathmail',
  templateUrl: './single-pathmail.component.html',
  styleUrls: ['./single-pathmail.component.css']
})
export class SinglePathmailComponent implements OnInit {

  threadID: number = null;
  threads: threadDetails[] = [];
  loading: boolean = true;
  addActivityForm: FormGroup;
  fileToUpload:File;
  fileToUploadType: string = 'text';


  constructor( private chatSvc : AppsService,
               private router: Router,
               private activatedRoute:ActivatedRoute,
               private api: DashboardService,
               private fb: FormBuilder) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.threadID = +params.get('id');
      this.getThreads();
    })
  }

  ngOnInit(){
    this.addActivityForm = this.fb.group({
      comment: [null, [Validators.required]],
      img: [null],
      video: [null],
      audio: [null],
      document: [null]
    });
  }


  submitAddActivityForm(){
    // let data = new FormData();
    // // for (let userID of this.createThreadForm.controls['userIDs'].value) {
    // //     console.log(userID)
    // //     data.set('recipients', userID);
    // // }
    // const userIds = this.createThreadForm.controls['userIDs'].value;
    // for(var i=0;i< userIds.length;i++){
    //   console.log(userIds[i])
    //   data.append("recipients["+i+"]",userIds[i]);
    // }

    if(this.addActivityForm.controls['comment'].value == '' || !this.addActivityForm.controls['comment'].value) return;

    const now = new Date();


    this.api.postThread(
      this.threadID,
      this.addActivityForm.controls['comment'].value,
      this.fileToUploadType,
      this.fileToUpload
    ).subscribe(data => {
      if(data.statusCode==201){

        const test: threadDetails = {
          isRead: 0,
          id: 23,
          message: this.addActivityForm.controls['comment'].value,
          created: now.toLocaleString(),
          author: {
            id: this.api.userData.id,
            firstName: this.api.userData.firstName,
            lastName: this.api.userData.lastName,
            photo: this.api.userData.photo,
          },
          attachment: this.fileToUpload,
          attachmentType: this.fileToUploadType,
          eventId: 0
        };
        this.threads = [...this.threads, test];

        this.addActivityForm.reset();
      }
    });
  }

  handleUpload(event: any, fileType: string): void {
    this.fileToUpload = event.target.files[0];
    this.fileToUploadType = fileType;
    console.log(this.fileToUpload);
  }

  getThreads(){
    this.api.getThreadDetails(this.threadID).subscribe(data => {
      this.threads = data.pathmailMessages;
      this.threads.reverse();
      this.loading = false;
    })
  }

  gotoAllThreads(){
    this.router.navigate(['dashboard', 'pathmails']);
  }

  checkSelfMsg(author: pathMailAuthor){
    return author.id === this.api.userData.id;
  }

  checkOtherMsg(author: pathMailAuthor){
    return author.id !== this.api.userData.id;
  }

}
