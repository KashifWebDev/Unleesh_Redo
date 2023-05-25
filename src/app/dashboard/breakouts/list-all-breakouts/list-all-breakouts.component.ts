import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardService} from '../../dashboard.service';
import {allBreakouts} from '../../dashboardInterfaces/paht.type';

@Component({
  selector: 'app-list-all-breakouts',
  templateUrl: './list-all-breakouts.component.html',
  styleUrls: ['./list-all-breakouts.component.css']
})
export class ListAllBreakoutsComponent implements OnInit {

  inputValue: string;
  breakouts: allBreakouts[];

  constructor(private router: Router, private activatedRoute:ActivatedRoute,
              private service: DashboardService) {}

  ngOnInit(): void {
    this.listALlBreakOuts();
  }


  onChange(value: string): void {
    if(this.inputValue == ''){
      this.ngOnInit();
    }else{
      this.breakouts = this.breakouts.filter(res => {
        return res.title.toLowerCase().match(this.inputValue.toLowerCase());
      });
    }
  }

  listALlBreakOuts(){
    this.service.getAllBreakouts().subscribe(data => {
      this.breakouts = data.events;
    });
  }

  addNewBreakout(){
    this.router.navigate(['../add-new'], {relativeTo: this.activatedRoute});
  }

  breakoutImg(breakout: allBreakouts){
    return this.service.imgFix(breakout.icon ? breakout.icon : breakout.path.icon);
  }

}
