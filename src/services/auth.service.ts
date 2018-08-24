import { Injectable } from "@angular/core";
import { CredenciaisDTO } from "../models/credenciais.dto";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../config/api.config";

@Injectable()
export class AuthService {

    constructor(public http: HttpClient) {        
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
}