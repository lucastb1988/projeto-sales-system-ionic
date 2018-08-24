import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";

@Injectable()
export class ClienteService {

    constructor(public http: HttpClient, public storage: StorageService) {        
    }

    findByEmail(email: string) : Observable<ClienteDTO> {
        //pegar o token que está armazenado no localStorage
        let token = this.storage.getLocalUser().token;
        //cabeçalho que vem da requisição com o token
        let authHeader = new HttpHeaders({'Authorization': 'Bearer ' + token});

        return this.http.get<ClienteDTO>(
            `${API_CONFIG.baseUrl}/clientes/email?value=${email}`,
            {'headers': authHeader});
    }

    getImageFromBucket(id: string) : Observable<any> {
        //montando url de acordo com a imagem incluida no bucket no S3
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
        //faz a requisição get e informando que o retorno será um blob(imagem)
        return this.http.get(url, {responseType: 'blob'});
    }
}