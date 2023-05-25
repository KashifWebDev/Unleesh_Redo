import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './home/dashboard.component';
import {PathmatesComponent} from './pathmates/pathmates.component';
import {ProfileComponent} from './profile/profile.component';
import {BreakoutsComponent} from './breakouts/breakouts.component';
import {AddNewBreakoutComponent} from './breakouts/add-new-breakout/add-new-breakout.component';
import {PathmailComponent} from './pathmail/pathmail.component';
import {ListAllBreakoutsComponent} from './breakouts/list-all-breakouts/list-all-breakouts.component';
import {SinglePathmailComponent} from './pathmail/single-pathmail/single-pathmail.component';
import {NewPathMailComponent} from './pathmail/new-path-mail/new-path-mail.component';
import {AllAnnouncementsComponent} from './announcement/all-announcements/all-announcements.component';
import {AnnouncementComponent} from './announcement/announcement.component';
import {AddNewAnnouncementsComponent} from './announcement/add-new-announcements/add-new-announcements.component';
import {DefaultComponent} from './home/default/default.component';
import {ViewComponent} from './home/view/view.component';
import {ViewContentComponent} from './home/view-content/view-content.component';
import {UserProfileComponent} from './user-profile/user-profile.component';
import {AllThreadsComponent} from './pathmail/all-threads/all-threads.component';
import {ViewSingleComponent} from './breakouts/view-single/view-single.component';

const routes: Routes = [
  {path: '', redirectTo: 'paths'},
  {path: 'profile', component: ProfileComponent},
  {path: 'paths', component: DashboardComponent, children:[
      {path: '', redirectTo: 'default'},
      {path: 'default', component: DefaultComponent},
      {path: 'view', redirectTo: 'default'},
      {path: 'view/:id', component: ViewComponent},
      {path: 'view/path/:path/:id/step/:step', component: ViewContentComponent},
    ]},
  {path: 'pathmates', component: PathmatesComponent},
  {path: 'breakouts', component: BreakoutsComponent, children:[
      {path: '', redirectTo: 'all'},
      {path: 'all', component: ListAllBreakoutsComponent},
      {path: 'add-new', component: AddNewBreakoutComponent},
      {path: 'view/:id', component: ViewSingleComponent}
    ]},
  {path: 'pathmails',component: PathmailComponent, children:[
      {path: '', redirectTo: 'all'},
      {path: 'all', component: AllThreadsComponent},
      {path: 'new-thread', component: NewPathMailComponent},
      {path: 'new-thread/:userID', component: NewPathMailComponent},
      {path: 'thread/:id', component: SinglePathmailComponent}
    ]},
  {path: 'announcements',component: AnnouncementComponent, children:[
      {path: '', redirectTo: 'all'},
      {path: 'all', component: AllAnnouncementsComponent},
      {path: 'add-new', component: AddNewAnnouncementsComponent},
    ]},
  {path: 'users/:id/portfolio', component: UserProfileComponent},
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DashboardRoutingModule { }
