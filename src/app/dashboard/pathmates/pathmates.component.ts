import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardService} from '../dashboard.service';
import {pathMatesUsersList} from '../dashboardInterfaces/paht.type';

@Component({
  selector: 'app-pathmates',
  templateUrl: './pathmates.component.html',
  styleUrls: ['./pathmates.component.css']
})
export class PathmatesComponent implements OnInit {
  inputValue: string;
  pathMates: pathMatesUsersList[] = [];
  filtered: pathMatesUsersList[] = [];
  loading: boolean = true;

  constructor(private router: Router,
              private activatedRoute:ActivatedRoute,
              private dashboardService: DashboardService) {
  }

  onChange(value: string): void {
    console.log(this.pathMates);
    if(this.inputValue == ''){
      this.ngOnInit();
    }else{
      this.pathMates = this.pathMates.filter(res => {
        console.log(res);
        if(res.firstName!=null) return res.firstName.toLowerCase().match(this.inputValue.toLowerCase()) || res.lastName.toLowerCase().match(this.inputValue.toLowerCase());
      });
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.dashboardService.getPathMates().subscribe(data=> {
        if(data.users.length){
          this.pathMates = data.users;
        }
        this.pathMates.filter(value => value.firstName !== null);
        this.loading = false;
      },
      error => {
        this.loading = false;
      });
  }

  gotoProfile(){
    this.router.navigate(['../profile'], {relativeTo: this.activatedRoute});
  }

  reFormatDate(unixTimeStamp: string){
    return new Date(unixTimeStamp).toLocaleString('en-US');
  }

}
