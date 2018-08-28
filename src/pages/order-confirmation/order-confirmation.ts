import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';

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
  codpedido: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public cartService: CartService,
    public clienteService: ClienteService,
    public pedidoService: PedidoService) {

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

  back() {
    this.navCtrl.setRoot('CartPage');
  }

  home() {
    this.navCtrl.setRoot('CategoriasPage');
  }

  checkout() {
    this.pedidoService.insert(this.pedido)
      .subscribe(response => {
        //limpa o carrinho após salvar um pedido
        this.cartService.createOrClearCart();
        //pegando id do header location do novo pedido criado no retorno da resposta do backend
        this.codpedido = this.extractId(response.headers.get('location'));
      },
    error => {
      if (error.status == 403) {
        this.navCtrl.setRoot('HomePage');
      }
    });
  }

  private extractId(location: string) : string {
    //pega a posição após a barra do location (que veio do headers do backend)
    let position = location.lastIndexOf('/');
    //retorna e recupera o id (que está na frente da barra) + posição final (location.length)
    return location.substring(position + 1, location.length);
  }

}
