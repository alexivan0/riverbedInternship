import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToDoTask } from '../models/ToDoTask';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  @Input() arrayTasks: any;
  @Output() arrayTasksChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  toggleTask(task: ToDoTask)
  {
    task.completed = !task.completed;
  }

  deleteTask(task: ToDoTask)
  {
    this.arrayTasks = this.arrayTasks.filter((item: { name: string; }) =>item.name != task.name);
    this.arrayTasksChange.emit(this.arrayTasks);
  }
}
