import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardService} from '../dashboard.service';
import {rightBarUserDetails} from '../dashboardInterfaces/paht.type';
import {File} from '@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editMode: Boolean = false;
  editButtonText = "Edit Profile";
  validateForm: FormGroup;
  userData: rightBarUserDetails;
  fileToUpload:File;

  constructor(private fb: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              public service: DashboardService) {
    this.userData = this.service.userData;
  }

  submitForm(): void {
    this.service.editProfile(this.validateForm, this.fileToUpload).subscribe(data => {
      if(data.statusCode==200){
        this.service.userData.firstName = data.user.firstName;
        this.service.userData.lastName = data.user.lastName;
        this.service.userData.photo = data.user.photo;
        this.service.userData = data.user;
        this.service.setSession(this.service.userData);
        this.router.navigate(['../profile'], {relativeTo: this.activatedRoute});
        this.editProfileButton();
      }
    });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      firstName: [this.service.userData.firstName == 'null' ? '' : this.service.userData.firstName, [Validators.required]],
      lastName: [this.service.userData.lastName == 'null' ? '' : this.service.userData.lastName, [Validators.required]],
      company: [this.service.userData.company == 'null' ? '' : this.service.userData.company, []],
      profession: [this.service.userData.profession == 'null' ? '' : this.service.userData.profession, []],
      education: [this.service.userData.education == 'null' ? '' : this.service.userData.education, []],
      email: [this.service.userData.email == 'null' ? '' : this.service.userData.email, [Validators.required, Validators.email]],
      zipCode: [this.service.userData.zip == 'null' ? '' : this.service.userData.zip, []]
    });
  }

  editProfileButton() {
    this.editMode = !this.editMode;
    this.editButtonText = this.editMode ? 'Cancel Edit' : 'Edit Profile';
  }

  handleUpload(event: any): void {
    this.fileToUpload = event.target.files[0];
    console.log(this.fileToUpload);
  }
}


