import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../dashboard.service';
import {userProfileContent} from '../dashboardInterfaces/paht.type';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  private id: number;
  userProfileData: userProfileContent;

  constructor(private route: ActivatedRoute,
              private api: DashboardService) {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.fetchUserData();
    })
  }

  ngOnInit(): void {
  }

  fetchUserData(){
    this.userProfileData = null;
    this.api.getUserProfile(this.id).subscribe(data=>{
      this.userProfileData = data.user;
    });
  }

}
