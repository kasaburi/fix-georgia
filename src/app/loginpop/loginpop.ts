import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Google } from '../google/google';
import { Auth } from '../auth/auth';
import { Registre } from '../registre/registre';
import { TranslatePipe,  } from '@ngx-translate/core';


@Component({
  selector: 'app-loginpop',
  standalone: true,
  imports: [
    CommonModule,Google,Auth,Registre,TranslatePipe
  ],
  templateUrl: './loginpop.html',
  styleUrl: './loginpop.css'
})
export class Loginpop {


  @Output() close = new EventEmitter<void>();
  @Output() loginDone = new EventEmitter<void>();


  mode = '';


  constructor(
    private router: Router,
  
  ) {
  }


  openMode(type: string) {

    this.mode = type;

  }

onSuccess(role: string) {

  console.log('შემოსული role:', role);
  this.loginDone.emit();

  // ვხურავთ login popup-ს
  this.closePopup();
  if (role === 'admin') {

    this.router.navigate(['/naxva']);

  } else {

    this.router.navigate(['/problem']);

  }
}


closePopup() {

  this.close.emit();

}


}