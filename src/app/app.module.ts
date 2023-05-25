import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { AppRoutingModule } from './app-routing.module';
import { TemplateModule } from './shared/template/template.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';

import { NgChartjsModule } from 'ng-chartjs';
import { ThemeConstantService } from './shared/services/theme-constant.service';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzCommentModule} from 'ng-zorro-antd/comment';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';
import {HttpClientModule} from '@angular/common/http';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {ReactiveFormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';

registerLocaleData(en);

@NgModule({
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        FullLayoutComponent,
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NzBreadCrumbModule,
    TemplateModule,
    SharedModule,
    NgChartjsModule,
    NzGridModule,
    NzCommentModule,
    NzAvatarModule,
    NzCardModule,
    NzDrawerModule,
    HttpClientModule,
    NzSpinModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule
  ],
    providers: [
        {
            provide: NZ_I18N,
            useValue: en_US,
        },
        ThemeConstantService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
