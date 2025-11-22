import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeoService } from '../../core/services/geo.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddAgentModalComponent } from '../add-agent-modal/add-agent-modal.component';

export interface FilterCriteria {
  regions: number[];
  priceMin: number | null;
  priceMax: number | null;
  areaMin: number | null;
  areaMax: number | null;
  bedrooms: number | null;
}

@Component({
  selector: 'app-filter-panel',
  imports: [CommonModule, RouterModule, FormsModule, AddAgentModalComponent],
  templateUrl: './filter-panel.component.html',
  styleUrl: './filter-panel.component.css'
})
export class FilterPanelComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<FilterCriteria>();

  regions: any[] = [];

  regionDropdownOpen = false;
  priceDropdownOpen = false;
  areaDropdownOpen = false;
  bedroomsDropdownOpen = false;

  showAddAgentModal = false;

  selectedRegions: number[] = [];
  priceMin: number | null = null;
  priceMax: number | null = null;
  areaMin: number | null = null;
  areaMax: number | null = null;
  bedrooms: number | null = null;

  appliedRegions: number[] = [];
  appliedPriceMin: number | null = null;
  appliedPriceMax: number | null = null;
  appliedAreaMin: number | null = null;
  appliedAreaMax: number | null = null;
  appliedBedrooms: number | null = null;

  priceError = '';
  areaError = '';

  priceOptions = [50000, 100000, 150000, 200000, 300000];
  areaOptions = [50000, 100000, 150000, 200000, 300000];

  constructor(private geoService: GeoService) {}

  ngOnInit() {
    this.loadRegions();
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

  toggleRegionDropdown() {
    this.regionDropdownOpen = !this.regionDropdownOpen;
    if (this.regionDropdownOpen) {
      this.priceDropdownOpen = false;
      this.areaDropdownOpen = false;
      this.bedroomsDropdownOpen = false;
    }
  }

  togglePriceDropdown() {
    this.priceDropdownOpen = !this.priceDropdownOpen;
    if (this.priceDropdownOpen) {
      this.regionDropdownOpen = false;
      this.areaDropdownOpen = false;
      this.bedroomsDropdownOpen = false;
    }
  }

  toggleAreaDropdown() {
    this.areaDropdownOpen = !this.areaDropdownOpen;
    if (this.areaDropdownOpen) {
      this.regionDropdownOpen = false;
      this.priceDropdownOpen = false;
      this.bedroomsDropdownOpen = false;
    }
  }

  toggleBedroomsDropdown() {
    this.bedroomsDropdownOpen = !this.bedroomsDropdownOpen;
    if (this.bedroomsDropdownOpen) {
      this.regionDropdownOpen = false;
      this.priceDropdownOpen = false;
      this.areaDropdownOpen = false;
    }
  }

  closeAllDropdowns() {
    this.regionDropdownOpen = false;
    this.priceDropdownOpen = false;
    this.areaDropdownOpen = false;
    this.bedroomsDropdownOpen = false;
  }

  toggleRegion(regionId: number) {
    const index = this.selectedRegions.indexOf(regionId);
    if (index > -1) {
      this.selectedRegions.splice(index, 1);
    } else {
      this.selectedRegions.push(regionId);
    }
  }

  isRegionSelected(regionId: number): boolean {
    return this.selectedRegions.includes(regionId);
  }

  selectPriceOption(value: number, type: 'min' | 'max') {
    if (type === 'min') {
      this.priceMin = value;
    } else {
      this.priceMax = value;
    }
    this.validatePrice();
  }

  validatePrice() {
    this.priceError = '';
    if (this.priceMin !== null && this.priceMax !== null && this.priceMin > this.priceMax) {
      this.priceError = 'გთხოვთ შეიყვანოთ ვალიდური რიცხვები';
    }
  }

  selectAreaOption(value: number, type: 'min' | 'max') {
    if (type === 'min') {
      this.areaMin = value;
    } else {
      this.areaMax = value;
    }
    this.validateArea();
  }

  validateArea() {
    this.areaError = '';
    if (this.areaMin !== null && this.areaMax !== null && this.areaMin > this.areaMax) {
      this.areaError = 'გთხოვთ შეიყვანოთ ვალიდური რიცხვები';
    }
  }

  applyFilters() {
    this.validatePrice();
    this.validateArea();

    if (this.priceError || this.areaError) {
      return;
    }

    this.appliedRegions = [...this.selectedRegions];
    this.appliedPriceMin = this.priceMin;
    this.appliedPriceMax = this.priceMax;
    this.appliedAreaMin = this.areaMin;
    this.appliedAreaMax = this.areaMax;
    this.appliedBedrooms = this.bedrooms;

    const filters: FilterCriteria = {
      regions: this.appliedRegions,
      priceMin: this.appliedPriceMin,
      priceMax: this.appliedPriceMax,
      areaMin: this.appliedAreaMin,
      areaMax: this.appliedAreaMax,
      bedrooms: this.appliedBedrooms
    };

    this.filtersChanged.emit(filters);
    this.closeAllDropdowns();
  }

  clearRegionFilter() {
    this.selectedRegions = [];
    this.applyFilters();
  }

  clearPriceFilter() {
    this.priceMin = null;
    this.priceMax = null;
    this.priceError = '';
    this.applyFilters();
  }

  clearAreaFilter() {
    this.areaMin = null;
    this.areaMax = null;
    this.areaError = '';
    this.applyFilters();
  }

  clearBedroomsFilter() {
    this.bedrooms = null;
    this.applyFilters();
  }

  clearAllFilters() {
    this.selectedRegions = [];
    this.priceMin = null;
    this.priceMax = null;
    this.areaMin = null;
    this.areaMax = null;
    this.bedrooms = null;
    this.priceError = '';
    this.areaError = '';
    this.applyFilters();
  }

  getAppliedRegionNames(): string {
    const names = this.regions
      .filter(r => this.appliedRegions.includes(r.id))
      .map(r => r.name);
    return names.join(', ');
  }

  hasActiveFilters(): boolean {
    return this.appliedRegions.length > 0 ||
           this.appliedPriceMin !== null ||
           this.appliedPriceMax !== null ||
           this.appliedAreaMin !== null ||
           this.appliedAreaMax !== null ||
           this.appliedBedrooms !== null;
  }

  openAddAgentModal() {
    this.showAddAgentModal = true;
  }

  closeAddAgentModal() {
    this.showAddAgentModal = false;
  }

  onAgentAdded(agent: any) {
    console.log('Agent added successfully:', agent);
    this.showAddAgentModal = false;
  }
}
