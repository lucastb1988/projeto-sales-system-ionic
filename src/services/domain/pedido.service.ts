import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { PedidoDTO } from "../../models/pedido.dto";

@Injectable()
export class PedidoService {

    //injetando no construtor o HttpClient para realizar chamada de rest
    constructor(public http: HttpClient) {
    }

    insert(obj: PedidoDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/pedidos`,
            obj,
            {
                observe: 'response',
                //rest do back retorna corpo vazio, deixar como 'text' para aplicação
                //não entender Json e tentar fazer o parse causando um erro
                responseType: 'text'
            }
        )
    }
}