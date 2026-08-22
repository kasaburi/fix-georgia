import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { fix } from '../services/fix';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-naxva',
  imports: [RouterModule, CommonModule, FormsModule,TranslatePipe],
  templateUrl: './naxva.html',
  styleUrl: './naxva.css',
})
export class Naxva implements OnInit {



  constructor(
    private api: fix,
     private translate: TranslateService,
    private cdr: ChangeDetectorRef



    
  ) {}


  isAdmin = false;

  currentUser: any = null;

  searchSubject = new Subject<string>();

  reports: any[] = [];
  categories: any[] = [];
  cities: any[] = [];

  selectedCity: number | null = null;
  selectedCategory: number | null = null;
  selectedStatus: string | null = null;

  searchText = '';
 currentLang: string = 'ka';


ngOnInit(): void {

  // თავიდანვე შევამოწმოთ
  this.checkUserRole();

  window.addEventListener(
    'userChanged',
    this.handleUserChanged
  );
  this.currentLang =
    this.translate.currentLang() || 'ka';

  this.translate.onLangChange.subscribe(event => {

    this.currentLang = event.lang;

    this.getReports();

  });

  this.getReports();
  this.getCities();
  this.getCategories();

  this.searchSubject
    .pipe(
      debounceTime(300),
      distinctUntilChanged()
    )
    .subscribe(() => {

      this.filterReports();

    });

}




handleUserChanged = () => {

  console.log('USER CHANGED EVENT');

  this.checkUserRole();

};



getCityName(cityId: number | string): string {
  const city = this.cities.find(c => Number(c.id) === Number(cityId));
  return city?.name_ka || '';
}
checkUserRole(): void {

  const user = localStorage.getItem('user');

  console.log('USER FROM STORAGE:', user);

  if (!user) {

    this.currentUser = null;
    this.isAdmin = false;

    this.cdr.detectChanges();

    return;
  }

  try {

    this.currentUser = JSON.parse(user);

    const role = this.currentUser?.role
      ?.toString()
      .trim()
      .toLowerCase();

    console.log('ROLE:', role);

    this.isAdmin = role === 'admin';

    console.log('IS ADMIN:', this.isAdmin);

  } catch (error) {

    console.error(error);

    this.currentUser = null;
    this.isAdmin = false;
  }

  this.cdr.detectChanges();
}











  deleteReport(id: number) {


    this.api.deleteReport(id).subscribe({

      next: (res) => {

        console.log(res);

this.reports = this.reports.filter(
  report => report.id !== id
);

this.cdr.detectChanges();

      },


      error: (err) => {

        console.log(err);

      }


    });


  }





  onSearch() {

    this.searchSubject.next(
      this.searchText.trim()
    );

  }



getReports() {

  this.api.getReports()
    .subscribe({

      next:(data:any)=>{

        console.log("FULL API RESPONSE:", data);

        this.reports = Array.isArray(data)
          ? data
          : data.data || [];

        console.log("REPORTS:", this.reports);

        this.cdr.detectChanges();

      },

      error:(err)=>{

        console.log(err);

      }

    });

}


  getCities() {


    this.api.getCities()
      .subscribe({

        next:(data:any)=> {

          this.cities = data;

          console.log("Cities:", this.cities);

        },


        error:(err)=> {

          console.log(err);

        }

      });


  }






  getCategories() {


    this.api.getcategories()
      .subscribe({

        next:(data:any)=> {

          this.categories = data;

          console.log("Categories:", this.categories);

        },


        error:(err)=> {

          console.log(err);

        }

      });


  }

getCategoryName(categoryId: number | string) {

  if (!this.categories || this.categories.length === 0) {
    return '';
  }

  const category = this.categories.find(
    c => Number(c.id) === Number(categoryId)
  );

  return category ? category.name_ka : '';

}


noReportsMessage: string | null = null;

isFilterApplied = false;



// filterReports() {

//   this.isFilterApplied = true;
//   this.noReportsMessage = null;

//   const search = this.searchText?.trim() || undefined;
//   const cityId = this.selectedCity ?? undefined;
//   const categoryId = this.selectedCategory ?? undefined;
//   const status = this.selectedStatus ?? undefined;

//   console.log('FILTER:', {
//     search,
//     cityId,
//     categoryId,
//     status
//   });

//   this.api.getFilteredReports(
//     cityId,
//     categoryId,
//     status,
//     search
//   ).subscribe({

//     next: (res: any) => {

//       console.log('FILTER RESULT:', res);

//       this.reports = Array.isArray(res)
//         ? res
//         : res?.data ?? [];

//       if (this.reports.length === 0) {
//         this.noReportsMessage = 'REPORTS.NO_RESULTS';
//       }

//     },

//     error: (err) => {

//       console.error('FILTER ERROR:', err);

//       this.reports = [];
//       this.noReportsMessage = 'REPORTS.LOAD_ERROR';

//     }

//   });
// }




filterReports() {

  this.noReportsMessage = null;

  const search = this.searchText?.trim() || undefined;
  const cityId = this.selectedCity ?? undefined;
  const categoryId = this.selectedCategory ?? undefined;
  const status = this.selectedStatus ?? undefined;

  console.log('========== FILTER CLICK ==========');
  console.log('search:', search);
  console.log('cityId:', cityId);
  console.log('categoryId:', categoryId);
  console.log('status:', status);

  this.api.getFilteredReports(
    cityId,
    categoryId,
    status,
    search
  ).subscribe({

    next: (res: any) => {

      console.log('FILTER RESULT:', res);

      this.reports = Array.isArray(res)
        ? res
        : res?.data ?? [];

      if (this.reports.length === 0) {
        this.noReportsMessage = 'REPORTS.NO_RESULTS';
      }

      this.cdr.detectChanges();
    },

    error: (err) => {

      console.error('FILTER ERROR:', err);

      this.reports = [];
      this.noReportsMessage = 'REPORTS.LOAD_ERROR';

      this.cdr.detectChanges();
    }

  });
}

clearFilters() {

  this.searchText = '';

  this.selectedCity = null;

  this.selectedCategory = null;

  this.selectedStatus = null;

  this.noReportsMessage = null;

  this.getReports();

}








// getCityName(cityId: number) {

//   const city = this.cities.find(
//     c => Number(c.id) === Number(cityId)
//   );

//   return city ? city.name_ka : '';

// }



solveReport(id:number){

this.api.solveReport(id)
.subscribe(()=>{

this.reports = this.reports.filter(
report => report.id !== id
);

});



}




}