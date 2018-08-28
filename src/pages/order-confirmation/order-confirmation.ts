import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService) {

    //recuperando pedido como parametro da tela anterior (passando de uma tela para outra)
    this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    //atribui aos itens do carrinho o cart e seus itens pego no localStorage
    this.cartItems = this.cartService.getCart().items;

    //recuperando cliente logado que realizou o pedido pegando id do mesmo 
    //e chamando servico findById para checar se realmente é o cliente logado
    this.clienteService.findById(this.pedido.cliente.id)
      .subscribe(response => {
        //pega cliente não tipado e assegura que é o mesmo Cliente do backend
        this.cliente = response as ClienteDTO;
        //recupera o id do enderecoDeEntrega / recupera o array 'enderecos' da response
        this.endereco = this.findEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
    error => {
      //se encontrar algum erro como por ex. token expirado retorna para Home, etc...
      this.navCtrl.setRoot('HomePage');
    })
  }

  //encontra endereco selecionado pelo cliente através da lista de enderecos cadastrada desse cliente
  private findEndereco(id: string, list: EnderecoDTO[]) : EnderecoDTO {
    //encontra a posição do id passado (id de endereco selecionado) através da lista de enderecos cadastrada
    let position = list.findIndex(x => x.id == id);
    return list[position];
  }

  //recupera o total do carrinho
  total() {
    return this.cartService.total();
  }

}
