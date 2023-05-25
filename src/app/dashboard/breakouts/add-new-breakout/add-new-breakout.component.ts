import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {pathMailUsers, paths} from '../../dashboardInterfaces/paht.type';
import {DashboardService} from '../../dashboard.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-add-new-breakout',
  templateUrl: './add-new-breakout.component.html',
  styleUrls: ['./add-new-breakout.component.css']
})
export class AddNewBreakoutComponent implements OnInit {

  validateForm: FormGroup;
  pathIsVisible = false;
  pathMateIsVisible = false;
  selectedPath = "No Path Selected";
  selectedPathMates = 0;
  paths: paths[] = []
  users: pathMailUsers[] = [];
  fileToUpload: File;
  submitted: boolean = false;


  constructor(private fb: FormBuilder, private router: Router, private service: DashboardService,
              public datepipe: DatePipe) {

  }

  ngOnInit(): void {
    this.service.getAllPaths().subscribe(data => {
      this.paths = data.paths;
    });
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      desc: [null, [Validators.required]],
      location: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]],
      path: [null, [Validators.required]],
      listOfAttendees: new FormArray([]),
    });
  }

  submitForm(): void {
    this.submitted = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    console.log(this.validateForm.value);
    this.service.addBreakout(this.organizeFormData(this.validateForm, this.fileToUpload)).subscribe(data => {
      // console.log(data);
      if(data.statusCode == 201){
        this.router.navigate(['dashboard', 'breakouts', 'all']);
      }
      this.submitted = false;
    });
  }

  fetchUsersFromPath(path: paths){
    this.selectedPath = path.name;
    this.users = null;
    this.service.fetchUsersOfPath(path.id).subscribe(data => {
      this.users = data.users;
    });
  }

  get isHorizontal(): boolean {
    return this.validateForm.controls.formLayout?.value === 'horizontal';
  }

  showPathModal(): void {
    this.pathIsVisible = true;
  }

  handlePathOk(): void {
    this.pathIsVisible = false;
  }

  handlePathCancel(): void {
    this.pathIsVisible = false;
  }

  showPathMatesModal(): void {
    this.pathMateIsVisible = true;
  }

  handlePathMatesOk(): void {
    this.pathMateIsVisible = false;
  }

  handlePathMatesCancel(): void {
    console.log('Button cancel clicked!');
    this.pathMateIsVisible = false;
  }

  backToBreakouts(){
    this.router.navigate(['dashboard', 'breakouts']);
  }

  handleUpload(event: any): void {
    this.fileToUpload = event.target.files[0];
    console.log(this.fileToUpload);
  }

  onCheckChange(event){
    const formArray: FormArray = this.validateForm.get('listOfAttendees') as FormArray;

    /* Selected */
    if(event.target.checked){
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    }
    /* unselected */
    else{
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
    this.selectedPathMates = this.validateForm.controls['listOfAttendees'].value.length;
    console.log(this.validateForm.controls['listOfAttendees'].value);
  }

  reArrangeDate(date: any){
    return this.datepipe.transform(this.validateForm.controls[date].value, 'yyyy-MM-dd  HH:mm:ss');
  }

  organizeFormData(formData: FormGroup, file: any){
    // var data= [];
    // this.users.forEach(user =>{
    //   data.push(user.id)
    // })
    // console.log(data);

    let body = new FormData();
    body.set('title', formData.controls['name'].value);
    body.set('description', formData.controls['desc'].value);
    body.set('path', formData.controls['path'].value);
    body.set('address', formData.controls['location'].value);
    body.set('start_date', this.reArrangeDate('startTime'));
    body.set('end_date', this.reArrangeDate('endTime'));
    body.set('invitees[]', this.validateForm.controls['listOfAttendees'].value.toString());
    if(file) body.set('file', file);
    return body;
  }


}
