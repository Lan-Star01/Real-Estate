import { Component, OnInit } from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { ListingsService } from '../../core/services/listings.service';
import { FilterPanelComponent } from "../../shared/filter-panel/filter-panel.component";

@Component({
  selector: 'app-listings',
  imports: [FilterPanelComponent],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit {
  cities: any[] = [];
  regions: any[] = [];
  listings: any[] = [];

  constructor(
    private geoService: GeoService,
    private listingsService: ListingsService
  ) {}

  ngOnInit() {
    this.loadCities();
    this.loadRegions();
    this.loadListings();
  }

  loadListings() {
    console.log('Testing API call with both tokens...');
    this.listingsService.getAll().subscribe({
      next: (data) => {
        console.log('API call successful!', data);
        console.log('Number of listings:', data?.length || 0);
        this.listings = data;
      },
      error: (error) => {
        console.error('API call failed:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }

  loadCities() {
    this.geoService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  loadRegions() {
    this.geoService.getRegions().subscribe({
      next: (data) => {
        this.regions = data;
      },
      error: (error) => {
        console.error('Error loading regions:', error);
      }
    });
  }
}
