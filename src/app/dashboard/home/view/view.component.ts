import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../../dashboard.service';
import {currentPathChild, pathDetail, pathViewContent} from '../../dashboardInterfaces/paht.type';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  private id: number
  pathDetail: currentPathChild;
  pathContent: pathViewContent[];

  customStyle = {
    'font-size': '18px',
    border: '0px'
  };

  constructor(private route: ActivatedRoute, private API: DashboardService) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
    console.log("Page ID: "+this.id);
    this.API.pathViewDetails(this.id).subscribe(data => {
      this.pathDetail = data.path;
    });
    this.API.pathViewSteps(this.id).subscribe(data => {
      this.pathContent = data.phases;
    });
  }

  percentage(n1: number, n2: number){
    return Number(n2/n1)*100;
  }

}
