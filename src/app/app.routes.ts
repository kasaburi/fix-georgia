import { Routes } from '@angular/router';
import { Home } from './home/home';
import { page, } from './page/page';
import { Problem } from './problem/problem';
import { Naxva } from './naxva/naxva';

export const routes: Routes = [

  { path: '', 
    component:Home },


  { path: 'page', 
    component:page },

  { path: 'problem', 
    component:Problem },


  { path: 'naxva', 
    component:Naxva },



];