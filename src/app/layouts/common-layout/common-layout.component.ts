import {Component, TemplateRef, ViewChild} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {bindCallback, Observable} from 'rxjs';
import {delay, distinctUntilChanged, filter, map, startWith} from 'rxjs/operators';
import { IBreadcrumb } from "../../shared/interfaces/breadcrumb.type";
import { ThemeConstantService } from '../../shared/services/theme-constant.service';
import {addDays, formatDistance} from 'date-fns';
import {NzDrawerRef, NzDrawerService} from 'ng-zorro-antd/drawer';
import {DashboardService} from '../../dashboard/dashboard.service';
import {
  pathContentCommentContent,
  pathViewContent,
  pathViewContentDetails,
  rightBarFeeds
} from '../../dashboard/dashboardInterfaces/paht.type';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {File} from '@angular/compiler-cli/src/ngtsc/file_system/testing/src/mock_file_system';

@Component({
    selector: 'app-common-layout',
    templateUrl: './common-layout.component.html',
    styleUrls: ['./common-layout.component.css']
})

export class CommonLayoutComponent  {

    breadcrumbs$: Observable<IBreadcrumb[]>;
    contentHeaderDisplay: string;
    isFolded : boolean ;
    isSideNavDark : boolean;
    isExpand: boolean;
    selectedHeaderColor: string;
    rightBarOpened: Boolean = true;
    rightBarIcon: string = 'right';
    quickViewVisible : boolean = false;
    public showMenuBtn: boolean = true;
    rightBarFeed: rightBarFeeds[] = []
    modalOpen: boolean = false;
    loadingActivities = false;


  addReplyForm: FormGroup;
  fileToUploadReply:File;
  fileToUploadTypeReply: string;
  commentIdForReply: number;


  pageData: pathViewContent["levels"][0]["actions"];
  comments: pathContentCommentContent[];
  pathContent: pathViewContentDetails;
  private step: number;
  private id: number;
  private level: number;

  private counter1: number = 0;


  @ViewChild('drawerTemplate', { static: false }) drawerTemplate: TemplateRef<{
    $implicit: { value: string };
    drawerRef: NzDrawerRef<string>;
  }>;
  value = 'ng';

  openTemplate(): void {
    const drawerRef = this.drawerService.create({
      nzTitle: 'Current Path Activity',
      nzContent: this.drawerTemplate,
      nzContentParams: {
        value: this.value,
      },
    });

    drawerRef.afterOpen.subscribe(() => {
      console.log('Drawer(Template) open');
    });

    drawerRef.afterClose.subscribe(() => {
      console.log('Drawer(Template) close');
    });
  }

  time = formatDistance(new Date(), addDays(new Date(), 2));

    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private themeService: ThemeConstantService,
                private drawerService: NzDrawerService,
                public dashboardService: DashboardService,
                private fb: FormBuilder) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => {
                let child = this.activatedRoute.firstChild;
                while (child) {
                    if (child.firstChild) {
                        child = child.firstChild;
                    } else if (child.snapshot.data && child.snapshot.data['headerDisplay']) {
                        return child.snapshot.data['headerDisplay'];
                    } else {
                        return null;
                    }
                }
                return null;
            })
        ).subscribe( (data: any) => {
            this.contentHeaderDisplay = data;
        });
    }

    ngOnInit() {
      this.addReplyForm = this.fb.group({
        comment: [null, [Validators.required]],
        img: [null],
        video: [null],
        audio: [null],
        document: [null]
      });
      this.dashboardService.currentPathSubject.subscribe(data => this.loadFeeds());
        this.loadFeeds();

        this.breadcrumbs$ = this.router.events.pipe(
            startWith(new NavigationEnd(0, '/', '/')),
            filter(event => event instanceof NavigationEnd),distinctUntilChanged(),
            map(data => this.buildBreadCrumb(this.activatedRoute.root))
        );
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
        this.themeService.selectedHeaderColor.subscribe(color => this.selectedHeaderColor = color);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
    }

    getPathDetailsFromStepID(stepID: number){
      var obj = { requiredProp1: 0};
      const BreakError = {};
      localStorage.removeItem("tempLevel");

        this.id = this.dashboardService.getCurrentPath().id;
        this.dashboardService.pathViewSteps(this.id).subscribe(data => {
          data.phases.forEach((phases) => {
            phases.levels.forEach(levels => {
              // console.log('Lvl ID: '+levels.id);
              levels.actions.forEach(actions => {
                // console.log('Step ID: '+actions.id);
                if(actions.id == stepID){
                  obj.requiredProp1 = 34;
                  // console.log('MATCHED ??: '+ +levels.id);
                  this.level = +levels.id;
                  this.test(this.id,this.level,stepID);
                }
                // throw BreakError;
              })
            })
          })
        });



      this.router.navigate(['dashboard', 'paths', 'view', 'path', this.id, this.level, 'step', stepID]);

        // this.id = this.dashboardService.getCurrentPath().id;
        // this.dashboardService.pathViewSteps(this.id).subscribe(data => {
        //   data.phases.forEach((phases) => {
        //     phases.levels.forEach((levels) => {
        //       // console.log('Lvl ID: '+levels.id);
        //       levels.actions.forEach((actions) => {
        //         // console.log('Step ID: '+actions.id);
        //         if(actions.id == stepID){
        //           obj.requiredProp1 = 34;
        //           console.log('MATCHED: '+ +levels.id);
        //           localStorage.setItem("tempLevel", JSON.stringify(+levels.id));
        //         }
        //         // throw BreakError;
        //       })
        //     })
        //   })
        // });


      // console.log('FINALLL: ', obj.requiredProp1);
      // console.log('LvlFromStore: ', JSON.parse(localStorage.getItem('tempLevel')));
      // console.log('path:'+this.id+' level:'+obj.requiredProp1+' step:'+stepID);

      // this.router.navigate(['dashboard', 'paths', 'view', 'path', this.id,
      //   +JSON.parse(localStorage.getItem('tempLevel')), 'step', stepID]);
    }

    test(a: number, b: number, c: number){
      this.router.navigate(['dashboard', 'paths', 'view', 'path', a, b, 'step', c])
    }

  submitReply(){
    this.dashboardService.submitReply(
      this.commentIdForReply,
      this.addReplyForm.controls['comment'].value,
      this.fileToUploadTypeReply,
      this.fileToUploadReply
    ).subscribe(data => {
      if(data.statusCode==201){
        this.addReplyForm.reset();
        this.loadFeeds();
      }
    });
  }

  captureCommentID(commentID: number){
    this.commentIdForReply = commentID;
  }

  handleUploadReply(event: any, fileType: string, commentID: number): void {
    this.fileToUploadReply = event.target.files[0];
    this.fileToUploadTypeReply = fileType;
  }

    loadFeeds(){
      this.loadingActivities = true
      this.rightBarFeed = null;
      this.dashboardService.rightBar().subscribe(data =>{
        this.rightBarFeed = data.feeds;
        this.loadingActivities = false;
      })
    }

    private buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadcrumb[] = []): IBreadcrumb[] {
        let label = '', path = '/', display = null;

        if (route.routeConfig) {
            if (route.routeConfig.data) {
                label = route.routeConfig.data['title'];
                path += route.routeConfig.path;
            }
        } else {
            label = 'Dashboard';
            path += 'dashboard';
        }

        const nextUrl = path && path !== '/dashboard' ? `${url}${path}` : url;
        const breadcrumb = <IBreadcrumb>{
            label: label, url: nextUrl
        };

        const newBreadcrumbs = label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
        if (route.firstChild) {
            return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
        }
        return newBreadcrumbs;
    }

    toggleRightBar(){
      this.rightBarOpened = !this.rightBarOpened;
      this.rightBarIcon = this.rightBarOpened == true ? 'right' : 'left';
    }

    counter(i: number) {
      return new Array(i);
    }

    toggleFold() {
      this.isFolded = !this.isFolded;
      this.themeService.toggleFold(this.isFolded);
    }

    toggleExpand() {
      this.isFolded = false;
      this.isExpand = !this.isExpand;
      this.themeService.toggleExpand(this.isExpand);
      this.themeService.toggleFold(this.isFolded);
      this.showMenuBtn = false;
    }

    reFormatDate(unixTimeStamp: string){
      return new Date(unixTimeStamp).toLocaleString('en-US');
    }

    modelToggle(){
      this.modalOpen = !this.modalOpen;
    }

  getStepInfo(post) {
    // console.log(post);
    // get the stepID (it's stored in different places depending on the activity)
    let stepID;
    if (post.activity && post.activity.action) {
      stepID = post.activity.action.id;
    } else if (
      post.activity &&
      post.activity.actionSubmit &&
      post.activity.actionSubmit.action
    ) {
      stepID = post.activity.actionSubmit.action.id;
    } else {
      // can't get info if we can't find the ID
      return null;
    }
    // this.getPathDetailsFromStepID(stepID);
  }

  currentPath(){
      return this.dashboardService.getCurrentPath();
  }

  replyLinkText(feed: rightBarFeeds){
      if(feed.activity)
      return feed.activity.posts && feed.activity.posts.length ?
        feed.activity.posts.length+' comment(s)' :
        'Reply to';
  }

}
