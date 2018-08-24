import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx"; 
import { StorageService } from "../services/storage.service";
import { API_CONFIG } from "../config/api.config";

//Interceptor para incluir token nas requisições
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService) {        
    }

    //metódo irá interceptar uma requisição que é feita na aplicação e vai aplicar alguma logica conforme abaixo
    //esse método simplesmente passa por ele e não faz nada além do que a requisição original fazia
    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        
        let localUser = this.storage.getLocalUser();
       
        //precisa verificar se a requisição está vindo realmente do seu backend(URL padrão) ou não,
        //caso não seja não poderá recuperar o token do localStorage pois não se trata de uma requisição vinda do seu backend
        let N = API_CONFIG.baseUrl.length;
        let requestToAPI = req.url.substring(0, N) == API_CONFIG.baseUrl;

        //localStorage pode estar nulo com o usuario
        //protege contra requisições que não sejam da sua api, 
        //somente dessa forma poderá recuperar o token do cabeçalho da requisição e seguir com a req normal
        if (localUser && requestToAPI) {
            //clonar a requisição original incluindo no header o token capturado no localStorage
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)});
            return next.handle(authReq); //continua requisição com cabecalho preenchido com token
        }
        else {
            return next.handle(req); //continua requisição
        }
    }
}

//exigencias do Angular para criar um interceptor
export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
}