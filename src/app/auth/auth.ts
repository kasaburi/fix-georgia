import { Component, EventEmitter, Output } from '@angular/core';
import { fix } from '../services/fix';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

export interface LoginResponse {
  access_token: string;
  token_type: string;

  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    TranslatePipe
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})

export class Auth {

  errorMessage = '';

  rememberMe = true;

  user = {
    email: '',
    password: ''
  };

  @Output() loginSuccess = new EventEmitter<string>();

  constructor(
    private fix: fix,
    private router: Router
  ) {


    const rememberedEmail =
      localStorage.getItem('rememberedEmail');

    if (rememberedEmail) {
      this.user.email = rememberedEmail;
    }
  }











login() {

  console.log('AUTH LOGIN CLICKED');

  this.errorMessage = '';

  this.fix.login(this.user).subscribe({

    next: (res: LoginResponse) => {

      console.log('LOGIN SUCCESS:', res);

      // Token-ის შენახვა
      localStorage.setItem(
        'token',
        res.access_token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(res.user)
      );

      if (this.rememberMe) {

        localStorage.setItem(
          'rememberedEmail',
          this.user.email
        );

      }

      window.dispatchEvent(
        new Event('userChanged')
      );

      this.loginSuccess.emit(res.user.role);

      this.router.navigate(['/naxva']);

    },

    error: (err) => {

      console.log('LOGIN ERROR:', err);

      this.errorMessage =
        err.error?.detail ||
        'Login failed';

    }

  });

}



}