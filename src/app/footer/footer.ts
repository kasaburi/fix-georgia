import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../header/header';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';




@Component({
  selector: 'app-footer',
  imports: [RouterModule,TranslatePipe],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {

  public icone = 'assets/icone.png';


}
