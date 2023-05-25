import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DashboardService} from '../../dashboard/dashboard.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
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
      email: [ null, [ Validators.required ] ]
    });
  }


  submitForm(): void {
    this.loader = true;
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[ i ].markAsDirty();
      this.loginForm.controls[ i ].updateValueAndValidity();
    }
    this.service.reset(this.loginForm.controls['email'].value).subscribe(
      data => {
        if(data.statusCode == 200){
        } alert(data.message);
          this.router.navigate(['/dashboard']);
      },
      (error => {
        this.loader = false;
        this.loginFailed = true;
        this.loginForm.markAsDirty();
      })
    );
  }
}
