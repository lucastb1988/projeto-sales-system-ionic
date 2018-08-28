import { Injectable } from "../../../node_modules/@angular/core";
import { HttpClient } from "../../../node_modules/@angular/common/http";
import { API_CONFIG } from "../../config/api.config";
import { Observable } from "../../../node_modules/rxjs/Rx";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class ProdutoService {

    constructor(public http: HttpClient) {        
    }

    findById(produto_id: string) {
        return this.http.get<ProdutoDTO>(`${API_CONFIG.baseUrl}/produtos/${produto_id}`);
    }

    findByCategoria(categoria_id: string, page: number = 0, linesPerPage: number = 24) {
        return this.http.get(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}&page=${page}&linesPerPage=${linesPerPage}`);
    }

    //recuperando imagens small do S3
    getSmallImageFromBucket(id: string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`;
        return this.http.get(url, {responseType: 'blob'});
    }

    //recuperando imagens do S3
    getImageFromBucket(id: string) : Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/prod${id}.jpg`;
        return this.http.get(url, {responseType: 'blob'});
    }
}