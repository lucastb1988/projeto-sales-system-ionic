import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";
import { LocalUser } from "../models/local_user";
import { StorageService } from "./storage.service";
import { JwtHelper } from "angular2-jwt";
import { CartService } from "./domain/cart.service";

@Injectable()
export class AuthService {

    //objeto criado para ajudar a extrair o e-mail encontrado dentro do token
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public cartService: CartService) {        
    }

    authenticate(creds: CredenciaisDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/login`, 
            creds, //sempre que é post precisa enviar o objeto/atributo a ser salvo
            {
                //está especificando que esta requisição retornará um objeto do tipo response, 
                //dessa forma terei acesso ao header
                //precisa pega o header da resposta vinda do backend
                observe: 'response', 
                //o endpoint retorna uma resposta de corpo vazio, por isso precisa informar que a 
                //resposta virá como text senao o Angular tentará parsear para Json e dará erro
                responseType: 'text'
            });
    }

    //método para renovar token automaticamente
    //o token é incluido automaticamente na requisição pelo interceptor
    refreshToken() {
        return this.http.post(
            `${API_CONFIG.baseUrl}/auth/refresh_token`, 
            {},
            {
                //está especificando que esta requisição retornará um objeto do tipo response, 
                //dessa forma terei acesso ao header
                //precisa pega o header da resposta vinda do backend
                observe: 'response', 
                //o endpoint retorna uma resposta de corpo vazio, por isso precisa informar que a 
                //resposta virá como text senao o Angular tentará parsear para Json e dará erro
                responseType: 'text'
            });
    }


    //este método irá definir o que irá acontecer caso aconteça um login com sucesso
    //irá receber o Bearer Token como parâmetro que veio do cabeçalho da resposta da requisição
    successfulLogin(authorizationValue: string) {
        //irá remover a palavra BEARER + space do token
        let tok = authorizationValue.substring(7);
        let user : LocalUser = {
            //atribui ao token do obj LocalUser o tok criado acima
            token: tok,
            //isso irá decodificar o token e depois recuperar o email
            //e atribuir tudo dentro do LocalUser(token)
            email: this.jwtHelper.decodeToken(tok).sub         };
        //irá armazenar este user dentro do localStorage da sessão
        this.storage.setLocalUser(user);
        //quando fizer o login limpa o carrinho do usuario
        this.cartService.createOrClearCart();
    }

    logout() {
        //irá remover o usuario do localStorage quando deslogar da sessão
        this.storage.setLocalUser(null);
    }
}