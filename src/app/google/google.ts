import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { fix } from '../services/fix';
import { Router } from '@angular/router';

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
     private fix: fix,
  private router: Router
  ) {}




  ngOnInit(): void {

    console.log(
      'Current Origin:',
      window.location.origin
    );


    // Google script ჩატვირთულია თუ არა
    if (
      typeof google === 'undefined' ||
      !google.accounts ||
      !google.accounts.id
    ) {

      this.errorMessage =
        'Google სერვისი ვერ ჩაიტვირთა.';

      console.error(
        '❌ Google Identity Services არ ჩაიტვირთა'
      );

      return;
    }


    console.log(
      '✅ Google Identity Services ჩაიტვირთა'
    );


    // Google Login-ის ინიციალიზაცია
    google.accounts.id.initialize({

      client_id:
        '647692072086-fpr1ocoh29bckr2tehuhl1724dui9qur.apps.googleusercontent.com',


      callback: (response: any) => {

        console.log(
          'Google Response:',
          response
        );


        // Google credential/token
        const googleToken =
          response?.credential;


        if (!googleToken) {

          this.errorMessage =
            'Google-ისგან ავტორიზაციის მონაცემი ვერ მივიღეთ.';

          console.error(
            '❌ Google credential არ არსებობს'
          );

          return;
        }


        console.log(
          '✅ Google Token მიღებულია'
        );


        // Token-ის გაგზავნა FastAPI backend-ში
        this.fix
          .googleLogin(googleToken)
          .subscribe({

            next: (res: any) => {

              console.log(
                '✅ Backend Response:',
                res
              );


              // JWT access token
              if (res?.access_token) {

                localStorage.setItem(
                  'token',
                  res.access_token
                );

                console.log(
                  '✅ Access token შენახულია'
                );

              }


              // მომხმარებლის მონაცემები
              if (res?.user) {

                localStorage.setItem(
                  'user',
                  JSON.stringify(res.user)
                );


                console.log(
                  '✅ User შენახულია:',
                  res.user
                );


                // Parent component-ს ვატყობინებთ
                this.googleSuccess.emit(
                  res.user.role || 'user'
                );


                // Google Login წარმატებულია
                // გადავდივართ Naxva გვერდზე
                this.router.navigate([
                  '/naxva'
                ]);

              }
              else {

                console.error(
                  '❌ Backend response-ში user არ არის'
                );

                this.errorMessage =
                  'მომხმარებლის მონაცემები ვერ მივიღეთ.';

              }

            },


            error: (err) => {

              console.error(
                '❌ Google Login Error:',
                err
              );


              console.error(
                'Status:',
                err?.status
              );


              console.error(
                'Backend Error:',
                err?.error
              );


              if (
                err?.error?.detail
              ) {

                this.errorMessage =
                  err.error.detail;

              }
              else {

                this.errorMessage =
                  'Google-ით შესვლა ვერ შესრულდა.';

              }

            }

          });

      }

    });


    // Google ღილაკის container
    const button =
      document.getElementById(
        'googleButton'
      );


    if (!button) {

      console.error(
        '❌ googleButton ვერ მოიძებნა'
      );

      return;
    }


    // Google Login ღილაკის დახატვა
    google.accounts.id.renderButton(

      button,

      {
        theme: 'outline',
        size: 'large',
        width: 300
      }

    );


    console.log(
      '✅ Google Login button rendered'
    );

  }

}