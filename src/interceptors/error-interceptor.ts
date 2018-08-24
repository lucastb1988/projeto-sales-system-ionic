import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs/Rx"; 
import { StorageService } from "../services/storage.service";
import { AlertController } from "ionic-angular";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        public storage: StorageService, 
        public alertController: AlertController) {        
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
                case 401:
                this.handle401();
                break;

                case 403:
                this.handle403();
                break;

                default:
                this.handleDefaultError(errorObj);
            }

            return Observable.throw(errorObj); //propaga o erro para o componente que fez essa requisição
        }) as any;
    }

    //aparece um erro de alert caso status do erro seja 401 (autenticação)
    handle401() {
        //cria um botão de alert na tela criando um objeto de alert
        let alert = this.alertController.create({
            title: 'Erro 401: falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false, //para sair do alert precisa apertar no botão do alert para sair do alert
            buttons: [
                {
                    text: 'Ok' //botão de texto sem ação
                }
            ]
        });
        alert.present();
    }

    //caso encontrar status 403 (acesso negado) irá setar o localStorage como nulo
    handle403() {
        this.storage.setLocalUser(null);
    }

    handleDefaultError(errorObj) {
        //cria um botão de alert na tela criando um objeto de alert
        let alert = this.alertController.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false, //para sair do alert precisa apertar no botão do alert para sair do alert
            buttons: [
                {
                    text: 'Ok' //botão de texto sem ação
                }
            ]
        });
        alert.present();
    }
}

//exigencias do Angular para criar um interceptor
export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
}