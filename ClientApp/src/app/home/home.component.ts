import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppDataService } from '../services/app-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  newsObject: Object = {}
  subscription: Subscription = new Subscription
  newsArray: any[] = []

  constructor(private http: HttpClient, private service: AppDataService) {

  }

  ngOnInit(): void {
    this.subscription = this.service.newsObject$.subscribe(result => {
      this.newsObject = result;
    console.log(this.newsObject)
    this.loadNews()
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }


  loadNews() {
    console.log(Object.entries(this.newsObject)[2][1])
    Object.entries(this.newsObject)[2][1].forEach(element => {
      if (element.description && element.description.length > 485) {
        console.log(element.description.length)
        element.description = element.description.substring(0, 450) + "..."
      }
      this.newsArray.push(element)
    });
    console.log(this.newsArray)
  }







}
