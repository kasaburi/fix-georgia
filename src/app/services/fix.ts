import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { retry, tap } from 'rxjs/operators';
import { LoginResponse } from '../auth/auth';
import { HttpHeaders } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class fix {

 
  constructor(private http: HttpClient) {}







getCities() {
  return this.http
    .get('https://python-api-g48t.onrender.com/cities/')
    .pipe(
      retry(3)
    );
}

getcategories() {
  return this.http
    .get('https://python-api-g48t.onrender.com/categories/')
    .pipe(
      retry(3)
    );
}


getFilteredReports(
  city_id?: number,
  category_id?: number,
  status?: string,
  search?: string
) {

  let params = new HttpParams();


  if (city_id !== undefined && city_id !== null) {
    params = params.set(
      'city_id',
      city_id.toString()
    );
  }


  if (category_id !== undefined && category_id !== null) {
    params = params.set(
      'category_id',
      category_id.toString()
    );
  }


  if (status) {
    params = params.set(
      'status',
      status
    );
  }


  if (search?.trim()) {
    params = params.set(
      'search',
      search.trim()
    );
  }

 
  params = params.set(
    'sort',
    'newest'
  );

  params = params.set(
    'page',
    '1'
  );

  params = params.set(
    'limit',
    '10'
  );

  console.log(
    'FILTER PARAMS:',
    params.toString()
  );

  return this.http
    .get(
      'https://python-api-g48t.onrender.com/reports/filter',
      { params }
    )
    .pipe(
      retry(3)
    );
}




baseUrl = 'https://python-api-g48t.onrender.com';


createReport(formData: FormData){

  const token = localStorage.getItem('token');

  console.log("TOKEN:", token);


  return this.http.post(
    'https://python-api-g48t.onrender.com/reports/',
    formData,
    {
      headers:{
        Authorization: `Bearer ${token}`
      }
    }
  );

}

solveReport(id:number){

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  Authorization: `Bearer ${token}`
});


return this.http.patch(
`https://python-api-g48t.onrender.com/reports/${id}/solve`,
{},
{
 headers
}
);

}




getReports() {
  return this.getFilteredReports(
    undefined,
    undefined,
    undefined,
    undefined
  );
}








  private api = 'https://python-api-g48t.onrender.com/auth';



register(user:any){

  return this.http.post<any>(
    `${this.api}/register`,
    user,
    {
      headers:{
        'Content-Type':'application/json'
      }
    }
  );

}


login(user:any){

 return this.http.post<LoginResponse>(
   'https://python-api-g48t.onrender.com/auth/login',
   user
 ).pipe(
   tap((res:any)=>{

      localStorage.setItem(
        'user',
        JSON.stringify(res.user)
      );

      localStorage.setItem(
        'token',
        res.access_token
      );

   })
 );

}


googleLogin(token: string) {
  return this.http.post<any>(
    `${this.api}/google`,
    {
      token: token
    }
  );
}






deleteReport(id:number){

const token = localStorage.getItem('token');

const headers = new HttpHeaders({
  Authorization:`Bearer ${token}`
});


return this.http.delete(
`https://python-api-g48t.onrender.com/reports/${id}`,
{
 headers
}
);

}









isAdmin(): boolean {

  const user = localStorage.getItem('user');

  if (!user) {
    return false;
  }

  const currentUser = JSON.parse(user);

  return currentUser.role === 'admin';
}





getStatisticsSummary(){
  return this.http.get<any>(
    'https://python-api-g48t.onrender.com/statistics/summary'
  ).pipe(
    retry(3)
  );
}

getStatisticsCategories(){
  return this.http.get<any[]>(
    'https://python-api-g48t.onrender.com/statistics/categories'
  ).pipe(
    retry(3)
  );
}

getStatisticsCities(){
  return this.http.get<any[]>(
    'https://python-api-g48t.onrender.com/statistics/cities'
  ).pipe(
    retry(3)
  );
}










}