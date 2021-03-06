import 'rxjs/add/operator/switchMap';
import { Component, OnInit, ViewChild }      from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { NgForm } from '@angular/forms';
import { DataService } from '../data.service';
import { fadeInAnimation } from 'animations/fade-in.animation';
import { slideInOutAnimation } from 'animations/slide-in-out.animation';

@Component({
  selector: 'app-assignment-form',
  templateUrl: './assignment-form.component.html',
  styleUrls: ['./assignment-form.component.css'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]':"",},
  })
export class AssignmentFormComponent implements OnInit {

  successMessage: string;
  errorMessage: string;
  students;
  grades;
  assignment: object;
  class_xs;

  assignmentForm: NgForm;
  @ViewChild('assignmentForm') currentForm: NgForm;

  getRecordForEdit(){
    this.route.params
      .switchMap((params: Params) => this.dataService.getRecord("assignment", +params['id']))
      .subscribe(assignment => this.assignment = assignment);
  }

    getStudents() {
    this.dataService.getRecords("student")
      .subscribe(
        students => this.students = students,
        error =>  this.errorMessage = <any>error);
  }

    getGrades() {
    this.dataService.getRecords("grade")
      .subscribe(
        grades => this.grades = grades,
        error =>  this.errorMessage = <any>error);
  }

   getClasses() {
    this.dataService.getRecords("class")
      .subscribe(
        class_xs => this.class_xs = class_xs,
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
    this.getGrades();
    this.getStudents();
    this.getClasses();

  }

  saveAssignment(assignment: NgForm){
    if(typeof assignment.value.assignment_id === "number"){
      this.dataService.editRecord("assignment", assignment.value, assignment.value.assignment_id)
          .subscribe(
            assignment => this.successMessage = "Record updated succesfully",
            error =>  this.errorMessage = <any>error);
    }else{
      this.dataService.addRecord("assignment", assignment.value)
          .subscribe(
            assignment => this.successMessage = "Record added succesfully",
            error =>  this.errorMessage = <any>error);
            this.assignment = {};
    }

  }

ngAfterViewChecked() {
    this.formChanged();
  }

  formChanged() {
    this.assignmentForm = this.currentForm;
    this.assignmentForm.valueChanges
      .subscribe(
        data => this.onValueChanged(data)
      );
  }

  onValueChanged(data?: any) {
    let form = this.assignmentForm.form;

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
    'assignment_id': '',
    'student_id': '',
    'assignemnt_nbr': '',
    'grade_id': '',
    'class_id': ''
  };

  validationMessages = {
    'assignment_id': {
      'required': 'Assignment ID is required.'
    
    },
    'student_id': {
      'required': 'Student ID is required.'
      
    },
    'Assignement_nbr': {
      'pattern': 'Must be a number'
      
    },
    'grade_id': {
      'required': 'Grade ID is required.'
    },
    'class_id': {
      'required': 'Class ID is required.'    }
  };

}