import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../config/api.config";
import { StorageService } from "../storage.service";

@Injectable()
export class ClienteService {

    constructor(
        public http: HttpClient, 
        public storage: StorageService) {
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    //serviço não tipado (ou seja vai retornar o objeto exatamente igual do backend, todos os dados de Cliente e seus endereços)
    findByEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    getImageFromBucket(id: string) : Observable<any> {
        //montando url de acordo com a imagem incluida no bucket no S3
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`;
        //faz a requisição get e informando que o retorno será um blob(imagem)
        return this.http.get(url, {responseType: 'blob'});
    }

    insert(obj: ClienteDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            obj,
            {
                observe: 'response',
                responseType: 'text' //corpo vem vazio, para evitar de erro de Json
            }
        );
    }
}