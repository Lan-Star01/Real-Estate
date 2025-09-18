import { Component, OnInit } from '@angular/core';
import { GeoService } from '../../core/services/geo.service';

@Component({
  selector: 'app-listings',
  imports: [],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css'
})
export class ListingsComponent implements OnInit {
  cities: any[] = [];
  regions: any[] = [];

  constructor(private geoService: GeoService) {}

  ngOnInit() {
    this.loadCities();
    this.loadRegions();
  }

  loadCities() {
    this.geoService.getCities().subscribe({
      next: (data) => {
        this.cities = data;
        console.log('Cities loaded:', data);},
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  loadRegions() {
    this.geoService.getRegions().subscribe({
      next: (data) => {
        this.regions = data;
        console.log('Regions loaded:', data);
      },
      error: (error) => {
        console.error('Error loading regions:', error);
      }
    });
  }
}
