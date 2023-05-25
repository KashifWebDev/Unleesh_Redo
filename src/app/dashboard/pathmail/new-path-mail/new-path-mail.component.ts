import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {pathMailPaths, pathMailUsers} from '../../dashboardInterfaces/paht.type';
import {DashboardService} from '../../dashboard.service';
import {File} from '@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system';

@Component({
  selector: 'app-new-path-mail',
  templateUrl: './new-path-mail.component.html',
  styleUrls: ['./new-path-mail.component.css']
})
export class NewPathMailComponent implements OnInit {
  tabs = [1, 2, 3];
  selectedEntirePath = '';
  selectedUsers: {id: number, name: string}[] = [];
  searchIndividual = "";
  createThreadForm: FormGroup;
  createPathMailForm: FormGroup;
  usersList: pathMailUsers[] = [];
  pathsList: pathMailPaths[] = [];
  individualPage: boolean = true;
  userID: number = null;
  pathMailID: number;
  fileToUpload: File | any;
  fileToUploadType: string = 'text';

  constructor(private fb: FormBuilder, private router: Router, private service: DashboardService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userID = +params.get('userID');
    })
    this.createThreadForm = this.fb.group({
      comment: [null, [Validators.required]],
      userIDs: this.fb.array([], [Validators.required])
    });
    this.createPathMailForm = this.fb.group({
      check1: this.fb.control('', [Validators.required]),
      msg: [null, [Validators.required]],
      pathID: this.fb.array([], [Validators.required])
    });

    this.service.threadGetUsersPaths().subscribe(data => {
      this.usersList = data.users;
      this.pathsList = data.paths;


      //select any user if user id was provided in route
      if(this.userID != null && this.userID){
        const website: FormArray = this.createThreadForm.get('userIDs') as FormArray;
        website.push(new FormControl(this.userID));
        let users = new Array();
        website.value.forEach(id => {
          users.push(this.usersList.find(x => x.id == id).firstName);
        });
        this.selectedUsers = users;
        this.createThreadForm.controls['userIDs'].value;
      }
    });
  }

  get filteredData(){
    if(this.searchIndividual == '') return this.usersList;
    return this.usersList.filter(res => {
      return res.firstName.toLocaleLowerCase().match(this.searchIndividual.toLocaleLowerCase());
    });
  }

  onCheckboxChange(e) {
    const website: FormArray = this.createThreadForm.get('userIDs') as FormArray;
    if (e.target.checked) {
      console.log('e value: '+ e.target.value);
      website.push(new FormControl(e.target.value));
    } else {
      const index = website.controls.findIndex(x => x.value === e.target.value);
      website.removeAt(index);
    }

   let users = new Array();
    console.log(website);
    website.value.forEach(id => {
      users.push(this.usersList.find(x => x.id == id).firstName);
    });
    this.selectedUsers = users;
  }

  entirePathInputChange(pathID: number){
    this.selectedEntirePath = this.createPathMailForm.value.check1;
    console.log(this.createThreadForm.value);
    this.pathMailID = pathID;
  }

  submitCreateThread(){
    console.log(this.createThreadForm.value);
    let data = new FormData();
    // for (let userID of this.createThreadForm.controls['userIDs'].value) {
    //     console.log(userID)
    //     data.set('recipients', userID);
    // }
    const userIds = this.createThreadForm.controls['userIDs'].value;
    for(var i=0;i< userIds.length;i++){
      console.log(userIds[i])
      data.append("recipients["+i+"]",userIds[i]);
    }

    data.append("message", this.createThreadForm.controls['comment'].value);
    data.append("attachmentType", this.fileToUploadType);
    if(this.fileToUpload) data.append('file', this.fileToUpload);
    // data.append("path", this.service.getCurrentPath().id.toString());
    // formData.append('user', JSON.stringify(this.createThreadForm.controls['userIDs'].value));


    this.service.submitCreateThread(data).subscribe(data => {
      if(data.statusCode==201){
        this.createThreadForm.reset();
        this.router.navigate(['dashboard', 'pathmails']);
      }
    });
  }

  submitCreatePathMail(){
    let data = new FormData();
    // for (let userID of this.createThreadForm.controls['userIDs'].value) {
    //     console.log(userID)
    //     data.set('recipients', userID);
    // }

    data.append("message", this.createPathMailForm.controls['msg'].value);
    data.append("attachmentType", 'text');
    data.append("path", this.pathMailID.toString());
    data.append("attachmentType", this.fileToUploadType);
    if(this.fileToUpload) data.append('file', this.fileToUpload);
    // formData.append('user', JSON.stringify(this.createThreadForm.controls['userIDs'].value));

    this.service.submitCreateThread(data).subscribe(data => {
      if(data.statusCode==201){
        this.createThreadForm.reset();
        this.router.navigate(['dashboard', 'pathmails']);
      }
    });
  }


  handleUpload(event: any, fileType: string): void {
    this.fileToUpload = event.target.files[0];
    this.fileToUploadType = fileType;
  }


}
