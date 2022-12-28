import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorHttp } from './http-interceptor.service';
@NgModule({
    providers: [
        InterceptorHttp,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptorHttp,
            multi: true,
        },
    ],
})
export class InterceptorModule { }