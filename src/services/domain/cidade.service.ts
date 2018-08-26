import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { CidadeDTO } from "../../models/cidade.dto";
import { Observable } from "rxjs/Rx";//importação completa do Observable

@Injectable()
export class CidadeService {

    //injetando no construtor o HttpClient para realizar chamada de rest
    constructor(public http: HttpClient) {
    }

    //retorna CidadeDTO, o angular encapsula um mecanismo de requisição assincrona(ajax)
    //por meio do objeto Observable que possibilita eu fazer a requisição e aguardar a resposta
    //desta forma com Observable que retorna um array de objetos do tipo CidadeDTO
    findAll(estado_id: string) : Observable<CidadeDTO[]> {
        //retorna url de cidades do backend
        return this.http.get<CidadeDTO[]>(`${API_CONFIG.baseUrl}/estados/${estado_id}/cidades`); //get tipado com CidadeDTO[]
    }
}