import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { CategoriaDTO } from "../../models/categoria.dto";
import { Observable } from "rxjs/Rx";//importação completa do Observable

@Injectable()
export class CategoriaService {

    //injetando no construtor o HttpClient para realizar chamada de rest
    constructor(public http: HttpClient) {
    }

    //retorna CategoriaDTO, o angular encapsula um mecanismo de requisição assincrona(ajax)
    //por meio do objeto Observable que possibilita eu fazer a requisição e aguardar a resposta
    //desta forma com Observable que retorna um array de objetos do tipo CategoriaDTO
    findAll() : Observable<CategoriaDTO[]> {
        //retorna url de categorias do backend
        return this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias`); //get tipado com CategoriaDTO[]
    }
}