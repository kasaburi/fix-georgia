import { Component, EventEmitter, Output } from '@angular/core';
import { fix } from '../services/fix';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-registre',
  standalone: true,
  imports: [
    FormsModule,TranslatePipe
  ],
  templateUrl: './registre.html',
  styleUrl: './registre.css',
})
export class Registre {




  @Output() registerSuccess = new EventEmitter<string>();

  user = {
    name: '',
    email: '',
    password: ''
  };

  message = '';
  errorMessage = '';

  constructor(
    private api: fix,
      private translate: TranslateService
  ) {}

  register() {

  this.message = '';
  this.errorMessage = '';


  if(!this.user.name || !this.user.email || !this.user.password){

    this.errorMessage = this.translate.instant(
      'REGISTER_MESSAGES.required'
    );

    return;
  }



  this.api.register(this.user).subscribe({

    next: (res:any) => {


      localStorage.setItem('token', res.access_token);

      localStorage.setItem(
        'user',
        JSON.stringify(res.user)
      );


      this.message = this.translate.instant(
        'REGISTER_MESSAGES.success'
      );



      setTimeout(() => {


        if(res.user.role === 'admin'){

          this.registerSuccess.emit('admin');

        } else {

          this.registerSuccess.emit('user');

        }


      },2000);


    },



    error:(err:any)=>{


      console.log(err);



      const detail = err.error?.detail;



      if(
        typeof detail === 'string' &&
        detail.toLowerCase().includes('email')
      ){

        this.errorMessage = this.translate.instant(
          'REGISTER_MESSAGES.email_exists'
        );


      }

      else if(
        typeof detail === 'string' &&
        detail.toLowerCase().includes('password')
      ){

        this.errorMessage = this.translate.instant(
          'REGISTER_MESSAGES.password_short'
        );


      }

      else {


        this.errorMessage = this.translate.instant(
          'REGISTER_MESSAGES.failed'
        );


      }


    }


  });


}






}