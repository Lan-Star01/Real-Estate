import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';

@Component({
  selector: 'app-listing-details',
  imports: [CommonModule],
  templateUrl: './listing-details.component.html',
  styleUrl: './listing-details.component.css'
})
export class ListingDetailsComponent implements OnInit {
  listing: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listingsService: ListingsService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadListing(id);
    }
  }

  loadListing(id: string) {
    this.listingsService.getById(id).subscribe({
      next: (data) => {
        console.log('Listing loaded:', data);
        this.listing = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading listing:', error);
        this.error = 'განცხადების ჩატვირთვა ვერ მოხერხდა';
        this.loading = false;
      }
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
