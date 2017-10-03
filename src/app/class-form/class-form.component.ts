import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service'
import { fadeInAnimation } from 'animations/fade-in.animation';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.css'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class ClassFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  instructors;
  classFormData: object;

  class_xForm: NgForm;
  @ViewChild('class_xForm') currentForm: NgForm;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("class", +params['id']))
      .subscribe(class_x => this.classFormData = class_x);
  }

  getInstructors() {
    this.dataService.getRecords("instructor")
      .subscribe(
        instructors => this.instructors = instructors,
        error =>  this.errorMessage = <any>error);
  }

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        (+params['id']) ? this.getRecordForEdit() : null;
      });
    this.getInstructors();

  }

  saveClass_x(class_x: NgForm){
    if(typeof class_x.value.class_id === "number"){
      this.dataService.editRecord("class", class_x.value, class_x.value.class_id)
          .subscribe(
            class_x => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("class", class_x.value)
          .subscribe(
            class_x => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.classFormData = {};
    }

  }

ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.class_xForm = this.currentForm;
    this.class_xForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data?: any) {
    let form = this.class_xForm.form;

    for (let field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'subject': '',
    'course': ''
    
  };

  validationMessages = {
    'subject': {
      'required': "Subject field is required",
      'minlength': "Subject must at least two characters",
      'maxlength' : "Subject field cannot be over 30 characters"
      
    },
    'course': {
      'pattern': 'Must be a 3-digit number'
    }
    
  };

}