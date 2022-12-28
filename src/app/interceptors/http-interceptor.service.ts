import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()

export class InterceptorHttp implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(sessionStorage.getItem('id')){

            const modifiedRequest = request.clone({

                headers: request.headers.set('Authorization', sessionStorage.getItem('token')).set('idUsuario', sessionStorage.getItem('id')).set('nivel', sessionStorage.getItem('nivel'))

            });
            return next.handle(modifiedRequest);
        } else {
            return next.handle(request)
        }
    }
}