import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { LoadingController } from '@ionic/angular';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient, public loader: LoadingController) {
  }

  obtemInformacao(route: string): Observable<any> {
    return this.http.get<any[]>(`${environment.baseUrl}${route}`, httpOptions)
      .pipe(
        tap(() => { return true }),
        catchError(this.handleError)
      );
  }

  obtemInformacaoEspecifica(route: string, id: number): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${route}`, id, httpOptions)
      .pipe(
        tap(() => { return true }),
        catchError(this.handleError)
      );
  }

  adicionaInformacao(route: string, data: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${route}`, data, httpOptions).pipe(
      tap(() => { return true }),
      catchError(this.handleError)
    );
  }

  atualizaInformacao(route: string, data: any): Observable<any> {
    return this.http.patch<any>(`${environment.baseUrl}${route}`, data, httpOptions).pipe(
      tap(() => { return true }),
      catchError(this.handleError)
    );
  }

  deletaInformacao(route: string, id: number): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${route}`, id).pipe(
      tap(() => { return true }),
      catchError(this.handleError)
    );
  }

  upload(route: string, file: any): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}${route}`, file).pipe(
      tap(() => { return true}),
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Um erro ocorreu:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Codigo retornado do backend ${error.status}, ` +
        `body era: ${JSON.stringify(error)}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      error.message);
  };

}