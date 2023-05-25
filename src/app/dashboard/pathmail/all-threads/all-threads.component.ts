import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {allPathMailsContent, pathMailMessage} from '../../dashboardInterfaces/paht.type';
import {DashboardService} from '../../dashboard.service';
import {CommonLayoutComponent} from '../../../layouts/common-layout/common-layout.component';

@Component({
  selector: 'app-all-threads',
  templateUrl: './all-threads.component.html',
  styleUrls: ['./all-threads.component.css']
})
export class AllThreadsComponent implements OnInit {

  loadingThreads: boolean = true;
  threads: allPathMailsContent[] = [];
  noThreads: boolean = true;
  pathMates: any;
  isVisible: boolean = false;
  listOfParticipants: allPathMailsContent['participants'] = [];
  inputValue: string;

  constructor(private router: Router,
              private activatedRoute:ActivatedRoute,
              private service: DashboardService,
              private commonLayout: CommonLayoutComponent) { }

  ngOnInit(): void {
    this.service.getAllThreads().subscribe(data =>{
      this.threads = data.threads;
      this.loadingThreads = false;
    });
  }

  onChange(value: string): void {
    if(this.inputValue == ''){
      this.ngOnInit();
    }else{
      this.threads = this.threads.filter(res => {
        return res.messages[res.messages.length-1].author.firstName.toLowerCase().match(this.inputValue.toLowerCase()) ||
          res.messages[res.messages.length-1].author.lastName.toLowerCase().match(this.inputValue.toLowerCase());
      });
    }
  }

  addNewThread(){
    this.router.navigate(['../new-thread'], {relativeTo: this.activatedRoute});
  }

  getAuthorName(array: pathMailMessage[]){
    return array[array.length-1].author.firstName+' '+array[array.length-1].author.lastName;
  }

  getLastMsg(array: pathMailMessage[]){
    return array[array.length-1];
  }

  reformatDate(date:string){
    return this.service.reFormatDate(date);
  }

  countPeoples(thread: allPathMailsContent){
    return thread.participants && thread.participants.length ? thread.participants.length : 0;
  }

  showModal(participants: allPathMailsContent['participants']): void {
    this.listOfParticipants = participants;
    this.commonLayout.modelToggle();
    this.isVisible = true;
  }

  handleOk(): void {
    this.commonLayout.modelToggle();
    this.isVisible = false;
  }

  handleCancel(): void {
    this.commonLayout.modelToggle();
    this.isVisible = false;
  }


}
