import { Component } from '@angular/core'
import { FormBuilder, FormControl, FormGroup,  Validators } from '@angular/forms';
import {DashboardService} from '../../dashboard/dashboard.service';
import {Router} from '@angular/router';


@Component({
    templateUrl: './sign-up-3.component.html'
})

export class SignUp3Component {

    signUpForm: FormGroup;

    submitForm(): void {
        for (const i in this.signUpForm.controls) {
            this.signUpForm.controls[ i ].markAsDirty();
            this.signUpForm.controls[ i ].updateValueAndValidity();
        }

        let body = new FormData();

      body.append('firstName', this.signUpForm.controls['firstName'].value);
      body.append('lastName', this.signUpForm.controls['lastName'].value);
      body.append('zip', this.signUpForm.controls['zip'].value);
      body.append('profession', this.signUpForm.controls['profession'].value);
      body.append('company', this.signUpForm.controls['company'].value);
      body.append('email', this.signUpForm.controls['email'].value);
      body.append('password', this.signUpForm.controls['password'].value);
      body.append('accessCode', this.signUpForm.controls['accessCode'].value);

        this.service.signup(body).subscribe(data => {
          if(data.statusCode==201){
            this.service.setSession(data.user);
            this.service.authToken = data.user.token;
            this.service.userData = data.user;
            alert("Account Created Successfully!");
            this.router.navigate(['/dashboard']);
          }else{
            alert(data.message);
          }
        });
    }

    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.signUpForm.controls.password.value) {
            return { confirm: true, error: true };
        }
    }

    constructor(private fb: FormBuilder, private service: DashboardService, private router: Router) {
    }

    ngOnInit(): void {
        this.signUpForm = this.fb.group({
          firstName         : [ null, [ Validators.required ] ],
          lastName            : [ null, [ Validators.required ] ],
          zip         : [ null ],
          profession    : [ null ],
          company    : [ null ],
          email    : [ null, [ Validators.required] ],
          password    : [ null, [ Validators.required] ],
          accessCode    : [ null ],
            // agree            : [ false ]
        });
    }
}
