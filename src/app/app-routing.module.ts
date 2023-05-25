import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { FullLayoutComponent } from "./layouts/full-layout/full-layout.component";
import { CommonLayoutComponent } from "./layouts/common-layout/common-layout.component";

import { FullLayout_ROUTES } from "./shared/routes/full-layout.routes";
import { CommonLayout_ROUTES } from "./shared/routes/common-layout.routes";
import {AuthGuard} from './shared/services/auth.guard';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'authentication/login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: CommonLayoutComponent,
        children: CommonLayout_ROUTES,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        component: FullLayoutComponent,
        children: FullLayout_ROUTES
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, {
            preloadingStrategy: PreloadAllModules,
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled',
            useHash: true
        })
    ],
    exports: [
        RouterModule
    ],
  providers: [AuthGuard]
})

export class AppRoutingModule {
}
