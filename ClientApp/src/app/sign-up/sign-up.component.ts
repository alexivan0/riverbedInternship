import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  invalidSignUp!: boolean;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
  }

  signUp(form: NgForm) {
    const credentials = {
      'username': form.value.username,
      'password': form.value.password,
      'fullname': form.value.fullname
    }

    this.http.post('https://localhost:44429/api/users', credentials)
      .subscribe(response => {
        this.invalidSignUp = false;
        this.router.navigate(["/portfolio"]);
      }, error => {
        this.invalidSignUp = true;
        console.log(error)
      })

    // this.http.post('https://localhost:44429/api/portfolios', {})
    //   .subscribe(response => {
    //   }, error => {
    //     console.log(error);
    //   })
  }

}
