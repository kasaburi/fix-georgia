import {
  Component,
  EventEmitter,
  Output,
  OnInit
} from '@angular/core';

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


    google.accounts.id.initialize({

      client_id:
        '647692072086-fpr1ocoh29bckr2tehuhl1724dui9qur.apps.googleusercontent.com',

      callback: (response: any) => {

        console.log(
          '✅ Google Response:',
          response
        );

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


        // Google token → FastAPI
        this.fix
          .googleLogin(googleToken)
          .subscribe({

            next: (res: any) => {

              console.log(
                '✅ Backend Response:',
                res
              );


              // აუცილებლად უნდა არსებობდეს
              // ჩვენი backend-ის access_token
              if (!res?.access_token) {

                console.error(
                  '❌ Backend-მა access_token არ დააბრუნა'
                );

                this.errorMessage =
                  'ავტორიზაცია ვერ დასრულდა.';

                return;
              }


              // JWT token
              localStorage.setItem(
                'token',
                res.access_token
              );


              // User
              if (res?.user) {

                localStorage.setItem(
                  'user',
                  JSON.stringify(res.user)
                );

                console.log(
                  '✅ User saved:',
                  res.user
                );


                this.googleSuccess.emit(
                  res.user.role || 'user'
                );

              }


              console.log(
                '✅ Google authentication successful'
              );


              // Naxva გვერდზე გადასვლა
              this.router.navigate(['/naxva'])
                .then((success) => {

                  console.log(
                    '➡️ Navigation:',
                    success
                  );

                })
                .catch((error) => {

                  console.error(
                    '❌ Navigation error:',
                    error
                  );

                });

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
                'Backend error:',
                err?.error
              );


              if (err?.error?.detail) {

                this.errorMessage =
                  err.error.detail;

              } else {

                this.errorMessage =
                  'Google-ით შესვლა ვერ შესრულდა.';

              }

            }

          });

      }

    });


    // Google button
    const button =
      document.getElementById('googleButton');


    if (!button) {

      console.error(
        '❌ googleButton ვერ მოიძებნა'
      );

      return;
    }


    google.accounts.id.renderButton(
      button,
      {
        theme: 'outline',
        size: 'large',
        width: 300
      }
    );


    console.log(
      '✅ Google button rendered'
    );

  }

}