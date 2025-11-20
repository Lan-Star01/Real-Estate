import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AgentsService } from '../../core/services/agents.service';

@Component({
  selector: 'app-add-agent-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-agent-modal.component.html',
  styleUrl: './add-agent-modal.component.css'
})
export class AddAgentModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() agentAdded = new EventEmitter<any>();

  agentForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private agentsService = inject(AgentsService);

  constructor() {
    this.agentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, this.redberryEmailValidator]],
      phone: ['', [Validators.required, this.phoneValidator]],
      avatar: [null, Validators.required]
    });
  }

  redberryEmailValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const isValid = value.endsWith('@redberry.ge');
    return isValid ? null : { redberryEmail: true };
  }

  phoneValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const phoneRegex = /^5\d{8}$/;
    return phoneRegex.test(value) ? null : { invalidPhone: true };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.agentForm.patchValue({ avatar: file });
      this.agentForm.get('avatar')?.updateValueAndValidity();

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
    this.agentForm.patchValue({ avatar: null });
    this.agentForm.get('avatar')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.agentForm.invalid) {
      Object.keys(this.agentForm.controls).forEach(key => {
        this.agentForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('name', this.agentForm.get('name')?.value);
    formData.append('surname', this.agentForm.get('surname')?.value);
    formData.append('email', this.agentForm.get('email')?.value);
    formData.append('phone', this.agentForm.get('phone')?.value);

    if (this.selectedFile) {
      formData.append('avatar', this.selectedFile);
    }

    this.agentsService.createAgent(formData).subscribe({
      next: (response) => {
        console.log('Agent created successfully:', response);
        this.agentAdded.emit(response);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating agent:', error);
        this.errorMessage = 'Failed to create agent. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  closeModal() {
    this.close.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.agentForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.agentForm.get(fieldName);
    return !!(field && field.valid && field.touched);
  }
}
