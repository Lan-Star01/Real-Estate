import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () =>
      import('./pages/listings/listings.component').then(
        (m) => m.ListingsComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'add-listing',
    loadComponent: () =>
      import('./pages/add-listing/add-listing.component').then(
        (m) => m.AddListingComponent
      ),
  },
  {
    path: 'listing/:id',
    loadComponent: () =>
      import('./pages/listing-details/listing-details.component').then(
        (m) => m.ListingDetailsComponent
      ),
  },
];
