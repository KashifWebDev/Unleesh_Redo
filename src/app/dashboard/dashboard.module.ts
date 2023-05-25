import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from './home/dashboard.component';

/** Import any ng-zorro components as the module required except icon module */
import { NzButtonModule } from 'ng-zorro-antd/button';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NgChartjsModule} from 'ng-chartjs';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzProgressModule} from 'ng-zorro-antd/progress';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzTimelineModule} from 'ng-zorro-antd/timeline';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzCalendarModule} from 'ng-zorro-antd/calendar';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzRateModule} from 'ng-zorro-antd/rate';
import {CommonModule, DatePipe} from '@angular/common';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzTagModule} from 'ng-zorro-antd/tag';
import { HomeComponent } from './home/home.component';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzTypographyModule} from 'ng-zorro-antd/typography';
import {NzPageHeaderModule} from 'ng-zorro-antd/page-header';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import { PathmatesComponent } from './pathmates/pathmates.component';
import { ProfileComponent } from './profile/profile.component';
import {NzInputModule} from 'ng-zorro-antd/input';
import { BreakoutsComponent } from './breakouts/breakouts.component';
import { AddNewBreakoutComponent } from './breakouts/add-new-breakout/add-new-breakout.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {ReactiveFormsModule} from '@angular/forms';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzModalModule} from 'ng-zorro-antd/modal';
import { PathmailComponent } from './pathmail/pathmail.component';
import { ListAllBreakoutsComponent } from './breakouts/list-all-breakouts/list-all-breakouts.component';
import { SinglePathmailComponent } from './pathmail/single-pathmail/single-pathmail.component';
import {AppsService} from '../shared/services/apps.service';
import { NewPathMailComponent } from './pathmail/new-path-mail/new-path-mail.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AllAnnouncementsComponent } from './announcement/all-announcements/all-announcements.component';
import { AddNewAnnouncementsComponent } from './announcement/add-new-announcements/add-new-announcements.component';
import {NzCommentModule} from 'ng-zorro-antd/comment';
import { DefaultComponent } from './home/default/default.component';
import { ViewComponent } from './home/view/view.component';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import { ViewContentComponent } from './home/view-content/view-content.component';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AllThreadsComponent } from './pathmail/all-threads/all-threads.component';
import { ViewSingleComponent } from './breakouts/view-single/view-single.component';

/** Assign all ng-zorro modules to this array*/
const antdModule = [
  NzButtonModule,
  NzCardModule,
  NzAvatarModule,
  NzRateModule,
  NzBadgeModule,
  NzProgressModule,
  NzRadioModule,
  NzTableModule,
  NzDropDownModule,
  NzTimelineModule,
  NzTabsModule,
  NzTagModule,
  NzListModule,
  NzCalendarModule,
  NzToolTipModule,
  NzCheckboxModule
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        DashboardRoutingModule,
        NgChartjsModule,
        ...antdModule,
        NzGridModule,
        NzTypographyModule,
        NzPageHeaderModule,
        NzBreadCrumbModule,
        NzInputModule,
        NzFormModule,
        ReactiveFormsModule,
        NzUploadModule,
        NzDatePickerModule,
        NzModalModule,
        NzCommentModule,
        NzCollapseModule,
        NzSpinModule
    ],
    exports: [],
    declarations: [
        DashboardComponent,
        HomeComponent,
        PathmatesComponent,
        ProfileComponent,
        BreakoutsComponent,
        AddNewBreakoutComponent,
        PathmailComponent,
        ListAllBreakoutsComponent,
        SinglePathmailComponent,
        NewPathMailComponent,
        AnnouncementComponent,
        AllAnnouncementsComponent,
        AddNewAnnouncementsComponent,
        DefaultComponent,
        ViewComponent,
        ViewContentComponent,
        UserProfileComponent,
        AllThreadsComponent,
        ViewSingleComponent
    ],
  providers: [
    AppsService,
    DatePipe,
  ]
})
export class DashboardModule { }
