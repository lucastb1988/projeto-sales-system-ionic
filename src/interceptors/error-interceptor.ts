import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx"; 
import { StorageService } from "../services/storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService) {        
    }

    //metódo irá interceptar uma requisição que é feita na aplicação e vai aplicar alguma logica conforme abaixo
    //esse método simplesmente passa por ele e não faz nada além do que a requisição original fazia
    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        return next.handle(req) //continua requisição
        .catch((error, caught) => { //e se pegar algum erro

            let errorObj = error;
            //se dentro dos erros capturados encontrar o campo erro, somente mostrar o mesmo para o usuario
            if (errorObj.error) {
                errorObj = errorObj.error;
            }
            //se dentro dos erros capturados não tiver o campo status quer dizer que os erros vieram em formato texto
            //neste caso setar os erros capturados como Json
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectado pelo Interceptador");
            console.log(errorObj); 
            //Interceptor que irá imprimir na tela o erro, não o conponente(controlador)

            //testar varias possibilidades do status de erro que será capturado
            switch(errorObj.status) {
                case 403:
                this.handle403();
                break;
            }

            return Observable.throw(errorObj); //propaga o erro para o componente que fez essa requisição
        }) as any;
    }

    //caso encontrar status 403 (autorização) irá setar o localStorage como nulo
    handle403() {
        this.storage.setLocalUser(null);
    }
}

//exigencias do Angular para criar um interceptor
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}