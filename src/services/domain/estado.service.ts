import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { EstadoDTO } from "../../models/estado.dto";
import { Observable } from "rxjs/Rx";//importação completa do Observable

@Injectable()
export class EstadoService {

    //injetando no construtor o HttpClient para realizar chamada de rest
    constructor(public http: HttpClient) {
    }

    //retorna EstadoDTO, o angular encapsula um mecanismo de requisição assincrona(ajax)
    //por meio do objeto Observable que possibilita eu fazer a requisição e aguardar a resposta
    //desta forma com Observable que retorna um array de objetos do tipo EstadoDTO
    findAll() : Observable<EstadoDTO[]> {
        //retorna url de estados do backend
        return this.http.get<EstadoDTO[]>(`${API_CONFIG.baseUrl}/estados`); //get tipado com EstadoDTO[]
    }
}