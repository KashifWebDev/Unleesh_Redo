import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DashboardService} from '../../dashboard.service';
import {currentPathChild, currentPathInterface, paths} from '../../dashboardInterfaces/paht.type';
import {CommonLayoutComponent} from '../../../layouts/common-layout/common-layout.component';
import {SideNavComponent} from '../../../shared/template/side-nav/side-nav.component';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {

  currentPath: currentPathChild;
  userPaths: paths[] = [];
  completedPath: paths[] = [];
  noPaths : boolean = false;
  switchPathModal: boolean = false;
  pathToSwitch: paths;
  accessCode: string = '';
  enterAccessCode: boolean = false;
  accessCodeErrModal: boolean = false;
  allPathsLoader = true;

  constructor(private router: Router, private activatedRoute:ActivatedRoute,
              private dashService: DashboardService, private commonLayout: CommonLayoutComponent) {
    this.switchPath();
  }

  ngOnInit(): void {
  }

  showAccessCodeModal(): void {
    this.dashService.checkAccessCode(this.accessCode)
      .subscribe(data => {
        if(data.statusCode == 400){
          this.commonLayout.modelToggle();
          this.accessCodeErrModal = true;
        }
      },
        error => {
          this.enterAccessCode = false;
          this.accessCode='';
          this.commonLayout.modelToggle();
          this.accessCodeErrModal = true;
        });
  }

  AccessCodeModalOk(): void {
    this.accessCodeErrModal = false;
    this.commonLayout.modelToggle();
  }

  AccessCodeModalCancel(): void {
    this.accessCodeErrModal = false;
    this.commonLayout.modelToggle();
  }

  showModal(path: paths): void {
    this.switchPathModal = true;
    this.pathToSwitch = path;
    this.commonLayout.modelToggle();
  }

  handleOk(): void {
    this.switchPathModal = true;
    // console.log('Button ok clicked!');
    this.dashService.switchPath(this.pathToSwitch.id)
      .subscribe(data => {
        let path: currentPathInterface = {id: this.pathToSwitch.id, name: this.pathToSwitch.name};
        this.dashService.setCurrentPath(path);
        this.dashService.currentPathSubject.next(path)
      });
    this.handleCancel();
    this.switchPath();
  }

  handleCancel(): void {
    // console.log('Button cancel clicked!');
    this.switchPathModal = false;
    this.commonLayout.modelToggle();
  }

  percentage(n1: number, n2: number){
    return Number(n2/n1)*100;
  }

  switchPath(){
    this.userPaths = [];
    this.dashService.getAllPaths().subscribe(data =>{
      this.dashService.currentPath().subscribe(data1 =>{
        this.currentPath = data1.path;
        if(data.paths && data.paths.length){
          data.paths.map((path) => {
            if(path.status === "2"){
              this.completedPath.push(path);
            }
            if(path.id !== this.currentPath.id){
              this.userPaths.push(path);
            }
          })
        }else{
          this.noPaths = true;
        }
        this.allPathsLoader = false;
      });
    });
  }

}
