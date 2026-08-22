import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef,} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { fix } from '../services/fix'; 
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AfterViewInit } from '@angular/core';
import * as L from 'leaflet';





@Component({
  selector: 'app-problem',
  imports: [
    RouterModule, CommonModule,  FormsModule,  TranslatePipe],
  templateUrl: './problem.html',
  styleUrl: './problem.css',
})
export class Problem implements OnInit, AfterViewInit {


 map: L.Map | null = null;
marker: L.Marker | null = null;
  cities: any[] = [];
  categories: any[] = [];
  reports: any[] = [];
  currentLang = 'ka';
  selectedCity: number | null = null;
  selectedCategory: number | null = null;
  imagePreview: string | null = null;
  problem = {
    title: '',
    description: '',
    city_id: null as number | null,
    category_id: null as number | null,
    latitude: null as number | null,
    longitude: null as number | null,
    file: null as File | null
  };


selectedFile: File | null = null;

ngAfterViewInit(): void {
  setTimeout(() => {
    this.initMap();
  }, 100);
}


  constructor(
    private api: fix,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,


  ){}

isAdmin = false;


ngOnInit(): void {
  this.getCities();
  this.getcategories();
  this.getReports();

  this.currentLang = this.translate.currentLang() || 'ka';

  this.translate.onLangChange.subscribe(event => {
    this.currentLang = event.lang;

  });
}



getReports() {
  this.api.getReports().subscribe({
    next: (data: any) => {
      console.log("FULL API RESPONSE:", data);

      this.reports = Array.isArray(data)
        ? data
        : data.data || [];

      console.log("REPORTS:", this.reports);
    },

    error: (err) => {
      console.log(err);
    }
  });
}



getCities() {
  this.api.getCities().subscribe({
    next: (data: any) => {
      this.cities = data;
    },
    error: (err) => {
      console.log(err);
    }
  });
}



getcategories() {
  this.api.getcategories().subscribe({
    next: (data: any) => {
      this.categories = data;
    },
    error: (err) => {
      console.log(err);
    }
  });
}




getLocation(): void {

  navigator.geolocation.getCurrentPosition(

    (position) => {

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      this.problem.latitude = lat;
      this.problem.longitude = lng;

      if (this.map) {

        this.map.setView(
          [lat, lng],
          16
        );

        if (this.marker) {
          this.map.removeLayer(this.marker);
        }

        const customIcon = L.divIcon({

          className: 'problem-location-wrapper',

          html: `
            <div class="problem-location">
              <div class="location-pulse"></div>

              <div class="location-pin">
                <span>📍</span>
              </div>
            </div>
          `,

          iconSize: [50, 50],
          iconAnchor: [25, 25]

        });

        this.marker = L.marker(
          [lat, lng],
          {
            icon: customIcon
          }
        ).addTo(this.map);

      }

      this.cdr.detectChanges();

    },

    (error) => {
      console.error('❌ Geolocation error:', error);
    }

  );
}






initMap(): void {

  if (this.map) {
    return;
  }

  const mapElement = document.getElementById('map');

  if (!mapElement) {
    console.error('❌ Map element not found');
    return;
  }

  console.log('✅ Map element found');

  this.map = L.map(mapElement, {
    center: [41.7151, 44.8271],
    zoom: 12,
    zoomControl: true
  });

  L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }
  ).addTo(this.map);


  // რუკაზე დაჭერა
  this.map.on('click', (event: L.LeafletMouseEvent) => {

    const lat = event.latlng.lat;
    const lng = event.latlng.lng;

    this.problem.latitude = lat;
    this.problem.longitude = lng;

    console.log('Latitude:', lat);
    console.log('Longitude:', lng);


    // ძველი marker
    if (this.marker) {
      this.map!.removeLayer(this.marker);
    }


    // საკუთარი marker
    const customIcon = L.divIcon({

      className: 'problem-location-wrapper',

      html: `
        <div class="problem-location">
          <div class="location-pulse"></div>

          <div class="location-pin">
            <span>📍</span>
          </div>
        </div>
      `,

      iconSize: [50, 50],
      iconAnchor: [25, 25]

    });


    // ახალი marker
   this.marker = L.marker(
  [lat, lng],
  {
    icon: customIcon
  }
).addTo(this.map!);

    // Popup
    this.marker
      .bindPopup(`
        <div class="problem-popup">
          <strong>📍 ადგილი მონიშნულია</strong>
          <br>
          <span>აქ არის პრობლემა</span>
        </div>
      `)
      .openPopup();


    this.cdr.detectChanges();

  });


  // Leaflet-ის ზომის განახლება
  setTimeout(() => {

    if (this.map) {
      this.map.invalidateSize();
    }

  }, 300);


  console.log('✅ Leaflet map initialized successfully');
}



aiCategoryId: number | null = null;


message = '';
messageType = '';

getCategoryName(id: number | null){

  if (!id) {
    return '';
  }

  const category = this.categories.find(
    c => c.id === id
  );

  return category ? category.name : '';

}



submitProblem() {

  this.message = '';
  this.messageType = '';



  if (!this.problem.city_id) {

    this.message = "ქალაქის არჩევა სავალდებულოა";
    this.messageType = "error";
    return;

  }


  if (!this.problem.category_id) {

    this.message = "პრობლემის ტიპის არჩევა სავალდებულოა";
    this.messageType = "error";
    return;

  }


  if (!this.problem.title || this.problem.title.trim() === '') {

    this.message = "სათაური სავალდებულოა";
    this.messageType = "error";
    return;

  }


  if (!this.problem.description || this.problem.description.trim() === '') {

    this.message = "აღწერა სავალდებულოა";
    this.messageType = "error";
    return;

  }


  if (!this.selectedFile) {

    this.message = "პრობლემის ფოტოს ატვირთვა სავალდებულოა";
    this.messageType = "error";
    return;

  }


  if (!this.problem.latitude || !this.problem.longitude) {

    this.message = "რუკაზე ადგილის მონიშვნა სავალდებულოა";
    this.messageType = "error";
    return;

  }



  const formData = new FormData();


  console.log("TITLE:", this.problem.title);

 this.message = '';
  this.messageType = '';


  const token = localStorage.getItem('token');


  if (!token) {

    this.message = "პრობლემის დასამატებლად საჭიროა ავტორიზაცია";
    this.messageType = "error";

    return;

  }

  if (!this.problem.city_id) {

    this.message = "ქალაქის არჩევა სავალდებულოა";
    this.messageType = "error";
    return;

  }

  


formData.append(
  "title_ka",
  this.problem.title
);

formData.append(
  "description_ka",
  this.problem.description
);

formData.append(
  "city_id",
  String(this.problem.city_id)
);

formData.append(
  "category_id",
  String(this.problem.category_id)
);

formData.append(
  "latitude",
  String(this.problem.latitude)
);

formData.append(
  "longitude",
  String(this.problem.longitude)
);


if (this.selectedFile) {
  formData.append(
    "file",
    this.selectedFile
  );
}



  console.log("------ FormData ------");

  for (const pair of formData.entries()) {

    console.log(pair[0], pair[1]);

  }




  this.api.createReport(formData)
  .subscribe({

next: (res:any) => {

  console.log("სრული პასუხი:", res);

  console.log(
    "AI კატეგორია ID:",
    res.ai_category_id
  );


  this.message =
    "პრობლემა წარმატებით აიტვირთა ✅ AI კატეგორია ID: "
    + res.ai_category_id;


  this.messageType = "success";


  setTimeout(() => {
    this.router.navigate(['/naxva']);
  }, 1500);

},
    error: (err) => {


      console.log("Status:", err.status);
      console.log(
        "Error:",
        JSON.stringify(err.error, null, 2)
      );


      this.message =
      "ვერ აიტვირთა ❌ მიზეზი: " +
      (
        err.error?.detail ||
        "სერვერთან დაკავშირების შეცდომა"
      );


      this.messageType = "error";


    }

  });


}




onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];

    console.log('ფოტო აიტვირთა:', this.selectedFile.name);
  }
}







}