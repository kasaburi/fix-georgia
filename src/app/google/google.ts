import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { fix } from '../services/fix';

declare const google: any;

@Component({
  selector: 'app-google',
  standalone: true,
  imports: [],
  templateUrl: './google.html',
  styleUrl: './google.css',
})
export class Google implements OnInit {


  @Output() googleSuccess = new EventEmitter<string>();

  errorMessage = '';


  constructor(
    private fix: fix
  ) {}


  ngOnInit(): void {


    console.log('Origin:', window.location.origin);


    if (typeof google === 'undefined' || !google.accounts) {

      this.errorMessage = 'Google სერვისი ვერ ჩაიტვირთა.';
      return;

    }



    google.accounts.id.initialize({

      client_id: '647692072086-fpr1ocoh29bckr2tehuhl1724dui9qur.apps.googleusercontent.com',


      callback: (response: any) => {


        console.log('Google Token:', response);


        const googleToken = response.credential;



        this.fix.googleLogin(googleToken).subscribe({



          next: (res: any) => {


            console.log('Backend Response:', res);



            if(res.access_token){

              localStorage.setItem(
                'token',
                res.access_token
              );

            }



            if(res.user){

              localStorage.setItem(
                'user',
                JSON.stringify(res.user)
              );


              this.googleSuccess.emit(
                res.user.role || 'user'
              );
            }


          },



          error: (err) => {


            console.log('Google Login Error:', err);



            if(err.error?.detail){

              this.errorMessage = err.error.detail;

            }
            else{

              this.errorMessage = 'Google-ით შესვლა ვერ შესრულდა.';

            }


          }


        });


      }


    });



    const button = document.getElementById('googleButton');


    if(button){


      google.accounts.id.renderButton(

        button,

        {
          theme: 'outline',
          size: 'large',
          width: 300
        }

      );


    }


  }


}