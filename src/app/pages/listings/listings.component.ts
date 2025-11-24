import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  private router = inject(Router);
  private listingsService = inject(ListingsService);

  // Signals for reactive state
  listings = signal<any[]>([]);
  currentFilters = signal<FilterCriteria | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed signal for filtered listings
  filteredListings = computed(() => {
    const allListings = this.listings();
    const filters = this.currentFilters();

    if (!filters) {
      return allListings;
    }

    return allListings.filter(listing => {
      if (filters.regions.length > 0) {
        if (!filters.regions.includes(listing.city?.region?.id)) {
          return false;
        }
      }

      if (filters.priceMin !== null && listing.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax !== null && listing.price > filters.priceMax) {
        return false;
      }

      if (filters.areaMin !== null && listing.area < filters.areaMin) {
        return false;
      }
      if (filters.areaMax !== null && listing.area > filters.areaMax) {
        return false;
      }

      if (filters.bedrooms !== null && listing.bedrooms !== filters.bedrooms) {
        return false;
      }

      return true;
    });
  });

  ngOnInit() {
    this.loadListings();
  }

  loadListings() {
    this.isLoading.set(true);
    this.error.set(null);

    this.listingsService.getAll().subscribe({
      next: (data) => {
        this.listings.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API call failed:', err);
        this.error.set('Failed to load listings');
        this.isLoading.set(false);
      }
    });
  }

  onFiltersChanged(filters: FilterCriteria) {
    this.currentFilters.set(filters);
  }

  navigateToDetails(listingId: number) {
    this.router.navigate(['/listing', listingId]);
  }
}
