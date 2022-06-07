import { Component, ElementRef, ViewChild } from '@angular/core';
import { ToDoTask } from './models/ToDoTask';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ToDo List';

  ToDoTasks: ToDoTask[] = [
    {
      name: "Throw the Garbage",
    },
    {
      name: "Buy Groceries",
      description: "Milk, Bread, Water, Eggs"
    },
    {
      name: "Do Homework",
      description: "Angular ToDo-List"
    }
  ];


}
