import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './authentification/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-crud-app';
  user: any;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.authService.getUserDetails().subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  logout() {
    this.authService.doLogout();
  }
}
