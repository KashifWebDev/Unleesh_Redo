import { Component } from '@angular/core'
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';
import {Router} from '@angular/router';
import {DashboardService} from '../../dashboard/dashboard.service';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';


@Component({
    templateUrl: './login-3.component.html'
})

export class Login3Component {
    loginForm: FormGroup;
    loginFailed = false;
    loader = false;

  constructor(private fb: FormBuilder,
              private router: Router,
              private service: DashboardService,
              private http: HttpClient) {
  }

  ngOnInit(): void {
    this.service.deleteSession();
    this.loginForm = this.fb.group({
      email: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ]
    });
  }

    submitForm(): void {
    this.loader = true;
        for (const i in this.loginForm.controls) {
            this.loginForm.controls[ i ].markAsDirty();
            this.loginForm.controls[ i ].updateValueAndValidity();
        }
      this.service.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).subscribe(
          data => {
            if(data.statusCode==200){
              this.service.setSession(data.user);
              this.service.authToken = data.user.token;
              this.service.userData = data.user;
              this.service.getAllPaths().subscribe(data => {
                if(data.paths && data.paths.length){
                  var pathID = data.paths[0].id;
                  this.service.setCurrentPath({
                    id: pathID,
                    name: data.paths[0].name
                  });
                  this.service.switchPath(pathID)
                    .subscribe(currentPathData =>{
                      this.router.navigate(['/dashboard']);
                    });
                }else{
                  this.router.navigate(['/dashboard']);
                }
              });
            }else{
              this.loader = false;
              this.loginFailed = true;
            }
          },
        (error => {
          this.loader = false;
          this.loginFailed = true;
          this.loginForm.markAsDirty();
        })
        );
    }

}
