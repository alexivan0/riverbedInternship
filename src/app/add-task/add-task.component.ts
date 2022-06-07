import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ToDoTask } from '../models/ToDoTask';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit {

  @Input() arrayTasks: any;
  @Output() arrayTasksChange = new EventEmitter();
  @ViewChild('taskName') taskName?: any;
  @ViewChild('taskDescription') taskDescription?: any;

  constructor() { }

  ngOnInit(): void {
  }

  submitTask(name: string, description: string)
  {
    this.arrayTasks = [...this.arrayTasks, { name, description }];
    this.taskName.nativeElement.value = '';
    this.taskDescription.nativeElement.value = '';
    console.log(this.arrayTasks);
    this.arrayTasksChange.emit(this.arrayTasks);
  }


}
