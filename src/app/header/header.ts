import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, Router } from '@angular/router';
import { Loginpop } from '../loginpop/loginpop';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,

  imports: [
    RouterModule,
    RouterLink,
    CommonModule,
    Loginpop,
    TranslatePipe
  ],

  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  public icone = 'assets/icone.png';

  showLogin = false;

  isLoggedIn = false;

  menuOpen = false;

  darkMode = false;


  constructor(
    private router: Router,
    private translate: TranslateService
  ) {

   
    this.translate.addLangs(['ka', 'en']);
    this.translate.setFallbackLang('ka');
    const lang =
      localStorage.getItem('lang') || 'ka';
    this.translate.use(lang);
  }


  ngOnInit(): void {

  
    this.checkLogin();
    window.addEventListener(
      'userChanged',
      this.handleUserChanged
    );

  }


  handleUserChanged = () => {
    console.log('USER CHANGED');
    this.checkLogin();
  };



  checkLogin(): void {
    const token =
      localStorage.getItem('token');
    this.isLoggedIn = !!token;
    console.log(
      'IS LOGGED IN:',
      this.isLoggedIn
    );

  }


  changeLanguage(lang: string): void {

    this.translate.use(lang);
    localStorage.setItem(
      'lang',
      lang
    );

  }

  goToPage(): void {

    this.router.navigate(['/problem']);
    this.menuOpen = false;

  }

  logout(): void {

    console.log('LOGOUT');

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.showLogin = false;
    this.menuOpen = false;
    window.dispatchEvent(
      new Event('userChanged')
    );

  }


  toggleTheme(): void {

    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');

    }

  }



openLogin() {

    console.log('LOGIN CLICKED');
    this.showLogin = true;
    console.log('showLogin:', this.showLogin);
    this.menuOpen = false;
}

closeLogin() {

    console.log('CLOSE LOGIN')
    this.showLogin = false;
}

loginDone() {

    console.log('LOGIN DONE');
    this.checkLogin();
    this.showLogin = false;
}

}