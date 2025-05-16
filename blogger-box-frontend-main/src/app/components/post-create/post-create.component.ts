import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '../../data/category';
import { CategoryService } from '../../services/category.service';
import { PostService } from '../../services/post.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  categories: Category[] = [];
  submitting = false;

  // Toast mixin pour SweetAlert2
  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private postService: PostService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(150)
      ]],
      categoryId: ['', Validators.required],
      content: ['', [
        Validators.required,
        Validators.maxLength(2500)
      ]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    });
  }

  // Getters pour un accès facile dans le template
  get title() { return this.postForm.get('title'); }
  get categoryId() { return this.postForm.get('categoryId'); }
  get content() { return this.postForm.get('content'); }

  onSubmit(): void {
    if (this.postForm.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.postForm.controls).forEach(key => {
        const control = this.postForm.get(key);
        control?.markAsTouched();
      });

      // Afficher une notification d'erreur
      this.Toast.fire({
        icon: 'error',
        title: 'Please review your post'
      });

      return;
    }

    this.submitting = true;

    const { title, categoryId, content } = this.postForm.value;

    this.postService.createPost(title, content, categoryId).subscribe({
      next: () => {
        // Afficher une notification de succès
        this.Toast.fire({
          icon: 'success',
          title: 'Post Submitted Successfully'
        });

        // Rediriger vers la page d'accueil
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error creating post', error);
        this.submitting = false;

        // Afficher une notification d'erreur
        this.Toast.fire({
          icon: 'error',
          title: 'Error creating post'
        });
      }
    });
  }
}