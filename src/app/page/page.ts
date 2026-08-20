import { Component, OnInit,ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { fix } from '../services/fix';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-page',

  imports: [
    RouterModule,
    CommonModule,
    TranslatePipe
  ],

  templateUrl: './page.html',
  styleUrl: './page.css',
})



export class page implements OnInit {

  summary: any = null;
  categories: any[] = [];
  cities: any[] = [];
  summaryLoading = true;
  citiesLoading = true;
  categoriesLoading = true;


  constructor(
    private api: fix,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadStatistics();

  }


  loadStatistics(): void {

    this.api.getStatisticsSummary()
      .subscribe({ next: (res: any) => {
          console.log('SUMMARY RESPONSE:', res)
          this.summary = res;
          this.summaryLoading = false;
          this.cdr.detectChanges();},
          error: (err) => { console.error('SUMMARY ERROR:', err)
          this.summaryLoading = false;
          this.cdr.detectChanges(); }
        });


    this.api.getStatisticsCities()
      .subscribe({ next: (res: any) => {
        console.log( 'CITIES RESPONSE:',res );
          this.cities = Array.isArray(res) ? [...res] : [];
          console.log('CITIES ARRAY:',this.cities);
          this.citiesLoading = false;
          this.cdr.detectChanges();},
          error: (err) => {console.error('CITIES ERROR:',err );
          this.citiesLoading = false;
          this.cdr.detectChanges();}
    });


    this.api.getStatisticsCategories()
      .subscribe({

        next: (res: any) => {

          console.log(
            'CATEGORIES RESPONSE:',
            res
          );

          this.categories =
            Array.isArray(res)
              ? [...res]
              : [];

          console.log(
            'CATEGORIES ARRAY:',
            this.categories
          );

          this.categoriesLoading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'CATEGORIES ERROR:',
            err
          );

          this.categoriesLoading = false;

          this.cdr.detectChanges();

        }

      });

  }




  getCityPercentage(
    value: number
  ): number {

    if (!this.cities.length) {
      return 0;
    }

    const max = Math.max(
      ...this.cities.map(
        city => Number(city.reports) || 0
      )
    );

    if (max === 0) {
      return 0;
    }

    return (
      Number(value) / max
    ) * 100;

  }




  getCategoryPercentage(
    value: number
  ): number {

    if (!this.categories.length) {
      return 0;
    }

    const max = Math.max(
      ...this.categories.map(
        category =>
          Number(category.count) || 0
      )
    );

    if (max === 0) {
      return 0;
    }

    return (
      Number(value) / max
    ) * 100;

  }



  getStatusPercentage(
    value: number
  ): number {

    if (!this.summary) {
      return 0;
    }

    const total =
      Number(
        this.summary.total_reports
      ) || 0;

    if (total === 0) {
      return 0;
    }

    return (
      Number(value) / total
    ) * 100;

  }

}



