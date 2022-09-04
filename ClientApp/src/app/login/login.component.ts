import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppDataService } from '../services/app-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin!: boolean;

  constructor(private router: Router, private http: HttpClient, private service: AppDataService) { }

  ngOnInit(): void {
  }

  login(form: NgForm) {
    const credentials = {
      'username': form.value.username,
      'password': form.value.password
    }

    this.http.post('https://localhost:44429/api/auth/login', credentials)
      .subscribe(response => {
        const token = (<any>response).token;
        localStorage.setItem("jwt", token);
        this.invalidLogin = false;
        // this.router.navigate(["/portfolio"]);
        this.router.navigate(["/portfolio"])
          .then(() => {
            this.service.reloadCurrentPage();
          });
      }, err => {
        this.invalidLogin = true;
      })


  }
}
