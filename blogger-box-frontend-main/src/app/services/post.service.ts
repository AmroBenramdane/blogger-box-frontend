import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from '../data/post';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) { }

  private postsUrl = `${environment.apiUrl}v1/posts`;

  // Récupérer tous les posts (avec recherche optionnelle)
  getPosts(searchValue?: string): Observable<Post[]> {
    if (searchValue) {
      const params = new HttpParams().set('value', searchValue);
      return this.http.get<Post[]>(this.postsUrl, { params });
    }
    return this.http.get<Post[]>(this.postsUrl);
  }

  // Récupérer un post par son ID
  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}/${id}`);
  }

  // Récupérer tous les posts d'une catégorie
  getPostsByCategory(categoryId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.postsUrl}/category/${categoryId}`);
  }

  // Créer un nouveau post
  createPost(title: string, content: string, categoryId?: string): Observable<Post> {
    const postData = {
      title,
      content,
      categoryId
    };
    return this.http.post<Post>(this.postsUrl, postData);
  }

  // Mettre à jour un post existant
  updatePost(id: string, title: string, content: string): Observable<Post> {
    const postData = {
      title,
      content
    };
    return this.http.put<Post>(`${this.postsUrl}/${id}`, postData);
  }

  // Supprimer un post
  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${id}`);
  }
}