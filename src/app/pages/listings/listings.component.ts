import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeoService } from '../../core/services/geo.service';
import { ListingsService } from '../../core/services/listings.service';
import { FilterPanelComponent, FilterCriteria } from "../../shared/filter-panel/filter-panel.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listings',
  imports: [FilterPanelComponent, CommonModule],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit {

  listings: any[] = [];
  filteredListings: any[] = [];
  currentFilters: FilterCriteria | null = null;

  constructor(
    private router: Router,
    private geoService: GeoService,
    private listingsService: ListingsService
  ) {}

  ngOnInit() {
    this.loadListings();
  }

  loadListings() {
    console.log('Testing API call with both tokens...');
    this.listingsService.getAll().subscribe({
      next: (data) => {
        console.log('API call successful!', data);
        console.log('Number of listings:', data?.length || 0);
        this.listings = data;
        this.filteredListings = data;
        this.applyCurrentFilters();
      },
      error: (error) => {
        console.error('API call failed:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  onFiltersChanged(filters: FilterCriteria) {
    console.log('Filters changed:', filters);
    this.currentFilters = filters;
    this.applyCurrentFilters();
  }

  applyCurrentFilters() {
    if (!this.currentFilters) {
      this.filteredListings = this.listings;
      return;
    }

    this.filteredListings = this.listings.filter(listing => {
      if (this.currentFilters!.regions.length > 0) {
        if (!this.currentFilters!.regions.includes(listing.city?.region?.id)) {
          return false;
        }
      }

      if (this.currentFilters!.priceMin !== null) {
        if (listing.price < this.currentFilters!.priceMin) {
          return false;
        }
      }
      if (this.currentFilters!.priceMax !== null) {
        if (listing.price > this.currentFilters!.priceMax) {
          return false;
        }
      }

      if (this.currentFilters!.areaMin !== null) {
        if (listing.area < this.currentFilters!.areaMin) {
          return false;
        }
      }
      if (this.currentFilters!.areaMax !== null) {
        if (listing.area > this.currentFilters!.areaMax) {
          return false;
        }
      }

      if (this.currentFilters!.bedrooms !== null) {
        if (listing.bedrooms !== this.currentFilters!.bedrooms) {
          return false;
        }
      }

      return true;
    });

    console.log(`Filtered: ${this.filteredListings.length} out of ${this.listings.length} listings`);
  }

  navigateToDetails(listingId: number) {
    this.router.navigate(['/listing', listingId]);
  }
}
