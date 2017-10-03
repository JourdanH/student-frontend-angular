import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';

import { DataService } from '../data.service';
import { fadeInAnimation } from 'animations/fade-in.animation';


@Component({
  selector: 'app-grade-form',
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade-form.component.css'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class GradeFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;

  gradeData: object;
  gradeForm: NgForm;
  @ViewChild('gradeForm') currentForm: NgForm;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("grade", +params['id']))
      .subscribe(grade => this.gradeData = grade);
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

  }

  saveGrade(grade: NgForm){
    if(typeof grade.value.grade_id === "number"){
      this.dataService.editRecord("grade", grade.value, grade.value.grade_id)
          .subscribe(
            grade => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("grade", grade.value)
          .subscribe(
            grade => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.gradeData = {};
    }

  }

ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.gradeForm = this.currentForm;
    this.gradeForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data?: any) {
    let form = this.gradeForm.form;

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
    'grade':""
  };

  validationMessages = {
    'grade': {
      'required': 'Grade is required.',
      'minlength': "at least 2 characters required",
      'maxlength': "no more than 30 characters"
    
    }
  };

}

