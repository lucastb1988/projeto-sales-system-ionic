import { Injectable } from "../../../node_modules/@angular/core";
import { StorageService } from "../storage.service";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class CartService {

    constructor(public storage: StorageService) {        
    }

    //cria um carrinho vazio e armazena ele no localStorage
    createOrClearCart() : Cart {
        let cart: Cart = {items: []};
        this.storage.setCart(cart);
        return cart;
    }

    getCart() : Cart {
        let cart: Cart = this.storage.getCart();
        if (cart == null) {
            cart = this.createOrClearCart(); //se cart nao existia cria um cart vazio no localStorage
        }
        return cart;
    }

    //add um produto ao carrinho
    addProduto(produto: ProdutoDTO) : Cart {
        let cart = this.getCart();
        //recupera posição dos itens dentro de Cart e pega o id do produto que é igual ao produto.id passado como parametro
        let position = cart.items.findIndex(x => x.produto.id == produto.id);
        if (position == -1) {
            //se não encontrar a posição quer dizer que não existe esse produto no carrinho
            //neste caso inclui ao itens do cart 1 quantidade do produto passado como parametro
            cart.items.push({quantidade: 1, produto: produto});
        }
        this.storage.setCart(cart); //atualiza localStorage com o carrinho  criado acima como argumento

        return cart;
    }
}