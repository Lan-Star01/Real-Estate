import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { GeoService } from '../../core/services/geo.service';
import { AgentsService } from '../../core/services/agents.service';
import { ListingsService } from '../../core/services/listings.service';
import { AddAgentModalComponent } from '../../shared/add-agent-modal/add-agent-modal.component';

@Component({
  selector: 'app-add-listing',
  imports: [CommonModule, ReactiveFormsModule, AddAgentModalComponent],
  templateUrl: './add-listing.component.html',
  styleUrl: './add-listing.component.css'
})
export class AddListingComponent implements OnInit {
  listingForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  errorMessage = '';

  regions: any[] = [];
  cities: any[] = [];
  agents: any[] = [];

  regionDropdownOpen = false;
  cityDropdownOpen = false;
  agentDropdownOpen = false;

  showAddAgentModal = false;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private geoService = inject(GeoService);
  private agentsService = inject(AgentsService);
  private listingsService = inject(ListingsService);

  constructor() {
    this.listingForm = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(2)]],
      image: [null, Validators.required],
      region_id: [null, Validators.required],
      city_id: [null, Validators.required],
      zip_code: ['', [Validators.required, this.numericValidator]],
      price: ['', [Validators.required, this.numericValidator]],
      area: ['', [Validators.required, this.numericValidator]],
      bedrooms: ['', [Validators.required, this.numericValidator, this.integerValidator]],
      description: ['', [Validators.required, this.minWordsValidator(5)]],
      is_rental: [0, Validators.required],
      agent_id: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadRegions();
    this.loadAgents();
    this.setupRegionChangeListener();
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

  loadAgents() {
    this.agentsService.getAgents().subscribe({
      next: (data) => {
        this.agents = data;
      },
      error: (error) => {
        console.error('Error loading agents:', error);
      }
    });
  }

  setupRegionChangeListener() {
    this.listingForm.get('region_id')?.valueChanges.subscribe(regionId => {
      if (regionId) {
        this.loadCities(regionId);
        this.listingForm.patchValue({ city_id: null });
      } else {
        this.cities = [];
        this.listingForm.patchValue({ city_id: null });
      }
    });
  }

  loadCities(regionId: number) {
    this.geoService.getCities().subscribe({
      next: (data) => {
        this.cities = data.filter((city: any) => city.region_id === regionId);
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  numericValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const isNumeric = /^\d+$/.test(value);
    return isNumeric ? null : { numeric: true };
  }

  integerValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    const isInteger = /^\d+$/.test(value) && Number.isInteger(Number(value));
    return isInteger ? null : { integer: true };
  }

  minWordsValidator(minWords: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const wordCount = value.trim().split(/\s+/).filter((word: string) => word.length > 0).length;
      return wordCount >= minWords ? null : { minWords: { required: minWords, actual: wordCount } };
    };
  }

  fileSizeValidator(maxSizeInMB: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file) return null;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      return file.size <= maxSizeInBytes ? null : { fileSize: { max: maxSizeInMB, actual: (file.size / 1024 / 1024).toFixed(2) } };
    };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 1048576) {
        this.errorMessage = 'ფაილის ზომა არ უნდა აღემატებოდეს 1MB-ს';
        return;
      }

      this.selectedFile = file;
      this.listingForm.patchValue({ image: file });
      this.listingForm.get('image')?.updateValueAndValidity();
      this.errorMessage = '';

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.listingForm.patchValue({ image: null });
    this.listingForm.get('image')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.listingForm.invalid) {
      Object.keys(this.listingForm.controls).forEach(key => {
        this.listingForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('address', this.listingForm.get('address')?.value);
    formData.append('region_id', this.listingForm.get('region_id')?.value);
    formData.append('city_id', this.listingForm.get('city_id')?.value);
    formData.append('zip_code', this.listingForm.get('zip_code')?.value);
    formData.append('price', this.listingForm.get('price')?.value);
    formData.append('area', this.listingForm.get('area')?.value);
    formData.append('bedrooms', this.listingForm.get('bedrooms')?.value);
    formData.append('description', this.listingForm.get('description')?.value);
    formData.append('is_rental', this.listingForm.get('is_rental')?.value);
    formData.append('agent_id', this.listingForm.get('agent_id')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.listingsService.create(formData).subscribe({
      next: (response: any) => {
        console.log('Listing created successfully:', response);
        this.router.navigate(['/']);
      },
      error: (error: any) => {
        console.error('Error creating listing:', error);
        this.errorMessage = 'ლისტინგის შექმნა ვერ მოხერხდა. გთხოვთ სცადოთ თავიდან.';
        this.isSubmitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.listingForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.listingForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }

  toggleRegionDropdown() {
    this.regionDropdownOpen = !this.regionDropdownOpen;
    if (this.regionDropdownOpen) {
      this.cityDropdownOpen = false;
      this.agentDropdownOpen = false;
    }
  }

  toggleCityDropdown() {
    if (!this.listingForm.get('region_id')?.value) {
      return;
    }
    this.cityDropdownOpen = !this.cityDropdownOpen;
    if (this.cityDropdownOpen) {
      this.regionDropdownOpen = false;
      this.agentDropdownOpen = false;
    }
  }

  toggleAgentDropdown() {
    this.agentDropdownOpen = !this.agentDropdownOpen;
    if (this.agentDropdownOpen) {
      this.regionDropdownOpen = false;
      this.cityDropdownOpen = false;
    }
  }

  closeAllDropdowns() {
    this.regionDropdownOpen = false;
    this.cityDropdownOpen = false;
    this.agentDropdownOpen = false;
  }

  selectRegion(regionId: number) {
    this.listingForm.patchValue({ region_id: regionId });
    this.listingForm.get('region_id')?.markAsTouched();
    this.regionDropdownOpen = false;
  }

  selectCity(cityId: number) {
    this.listingForm.patchValue({ city_id: cityId });
    this.listingForm.get('city_id')?.markAsTouched();
    this.cityDropdownOpen = false;
  }

  selectAgent(agentId: number) {
    this.listingForm.patchValue({ agent_id: agentId });
    this.listingForm.get('agent_id')?.markAsTouched();
    this.agentDropdownOpen = false;
  }

  getSelectedRegionName(): string {
    const regionId = this.listingForm.get('region_id')?.value;
    const region = this.regions.find(r => r.id === regionId);
    return region ? region.name : 'აირჩიეთ რეგიონი';
  }

  getSelectedCityName(): string {
    const cityId = this.listingForm.get('city_id')?.value;
    const city = this.cities.find(c => c.id === cityId);
    return city ? city.name : 'აირჩიეთ ქალაქი';
  }

  getSelectedAgentName(): string {
    const agentId = this.listingForm.get('agent_id')?.value;
    const agent = this.agents.find(a => a.id === agentId);
    return agent ? `${agent.name} ${agent.surname}` : 'აირჩიეთ აგენტი';
  }

  openAddAgentModal() {
    this.showAddAgentModal = true;
    this.agentDropdownOpen = false;
  }

  closeAddAgentModal() {
    this.showAddAgentModal = false;
  }

  onAgentAdded(agent: any) {
    console.log('Agent added successfully:', agent);
    this.loadAgents();
    this.showAddAgentModal = false;
    if (agent && agent.id) {
      this.listingForm.patchValue({ agent_id: agent.id });
      this.listingForm.get('agent_id')?.markAsTouched();
    }
  }
}
