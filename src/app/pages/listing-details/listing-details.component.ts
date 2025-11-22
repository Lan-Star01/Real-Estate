import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';

@Component({
  selector: 'app-listing-details',
  imports: [CommonModule],
  templateUrl: './listing-details.component.html',
  styleUrl: './listing-details.component.css'
})
export class ListingDetailsComponent implements OnInit, OnDestroy {
  listing: any = null;
  loading = true;
  error = '';

  similarListings: any[] = [];
  sliderIndex = 0;
  visibleCards = 4;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingsService: ListingsService
  ) {
    this.updateVisibleCards();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateVisibleCards();
  }

  updateVisibleCards() {
    const width = window.innerWidth;
    if (width <= 768) {
      this.visibleCards = 1;
    } else if (width <= 992) {
      this.visibleCards = 2;
    } else if (width <= 1200) {
      this.visibleCards = 3;
    } else {
      this.visibleCards = 4;
    }
    // Reset slider index if it's out of bounds after resize
    const maxIndex = Math.max(0, this.similarListings.length - this.visibleCards);
    if (this.sliderIndex > maxIndex) {
      this.sliderIndex = maxIndex;
    }
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadListing(id);
    }
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  loadListing(id: string) {
    this.listingsService.getById(id).subscribe({
      next: (data) => {
        console.log('Listing loaded:', data);
        this.listing = data;
        this.loading = false;
        this.loadSimilarListings(data.city?.region_id, +id);
      },
      error: (error) => {
        console.error('Error loading listing:', error);
        this.error = 'განცხადების ჩატვირთვა ვერ მოხერხდა';
        this.loading = false;
      }
    });
  }

  loadSimilarListings(regionId: number, currentId: number) {
    if (!regionId) return;

    this.listingsService.getAll().subscribe({
      next: (data) => {
        this.similarListings = data.filter(
          (item: any) => item.city?.region_id === regionId && item.id !== currentId
        );
        console.log('Similar listings:', this.similarListings);
      },
      error: (error) => {
        console.error('Error loading similar listings:', error);
      }
    });
  }

  get visibleListings() {
    return this.similarListings.slice(this.sliderIndex, this.sliderIndex + this.visibleCards);
  }

  get canSlideLeft() {
    return this.sliderIndex > 0;
  }

  get canSlideRight() {
    return this.sliderIndex + this.visibleCards < this.similarListings.length;
  }

  slideLeft() {
    if (this.canSlideLeft) {
      this.sliderIndex--;
    }
  }

  slideRight() {
    if (this.canSlideRight) {
      this.sliderIndex++;
    }
  }

  navigateToListing(id: number) {
    this.router.navigate(['/listing', id]).then(() => {
      window.scrollTo(0, 0);
      this.loading = true;
      this.sliderIndex = 0;
      this.loadListing(id.toString());
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  deleteListing() {
    if (confirm('დარწმუნებული ხართ, რომ გსურთ ლისტინგის წაშლა?')) {
      this.listingsService.delete(this.listing.id).subscribe({
        next: () => {
          console.log('Listing deleted successfully');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error deleting listing:', error);
          alert('ლისტინგის წაშლა ვერ მოხერხდა');
        }
      });
    }
  }
}
