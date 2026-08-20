import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { fix } from '../services/fix';
import { TranslatePipe, } from '@ngx-translate/core';




@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule,TranslatePipe],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home   implements OnInit {
public img = 'assets/mob.png';
public problem = 'assets/problem.jpg';
public tbilisi = 'assets/tbilisi.jpg';




public cities: any[] = [];
public items: any[] = [];
public categories: any[] = [];


constructor(
  private router: Router,
  private api: fix,
  private cdr: ChangeDetectorRef,

) {


}





  ngOnInit(): void {
    this.getCities();
    this.getcategories();



    
  }








getCities() {
  this.api.getCities().subscribe({
    next: (data: any) => {
      console.log("CITIES RESPONSE:", data);

      this.cities = data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error("CITIES ERROR:", err)
  });
}


getcategories() {
  this.api.getcategories().subscribe({
    next: (data: any) => {
      console.log("CATEGORIES RESPONSE:", data);

      this.categories = data;
      this.cdr.detectChanges();
    },
    error: (err) => console.error("CATEGORIES ERROR:", err)
  });
}



iconMap: { [key: string]: string } = {

  'დაზიანებული გზები': 'fa-solid fa-road',

  'გაუმართავი განათება': 'fa-solid fa-lightbulb',

  'ნაგვის დაგროვება': 'fa-solid fa-trash',

  'დაზიანებული სკვერები': 'fa-solid fa-tree',

  'წყლის გაჟონვა': 'fa-solid fa-faucet-drip',

  'საგზაო ნიშნები': 'fa-solid fa-traffic-light'

};


getIcon(name: string): string {

  return this.iconMap[name] || 'fa-solid fa-circle-question';

}





goToPage() {
  this.router.navigate(['/problem']);
}

}

