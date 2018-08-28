import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];
  pedido: PedidoDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService,
    public cartService: CartService) {
  }

  //recuperar enderecos atraves do servico findByEmail atraves do enderecos do backend pego pelo response
  ionViewDidLoad() {
    //ao iniciar a página recupera o localUser do storage
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          //atribuir aos endereços o array 'enderecos' do backend que foi recuperado pelo response
          this.items = response['enderecos']; 
        
          //recupera o carrinho do localStorage com os itens do pedido
          let cart = this.cartService.getCart();

          this.pedido = {
            //pegando id do response (referencia ex: id cliente = 1)
            cliente: {id: response['id']},
            enderecoDeEntrega: null,
            pagamento: null,
            //recuperando os itens do carrinho e joga em um map para pegar a quantidade e a referencia do produto (id produto = 1)
            itens: cart.items.map(x => {return {quantidade: x.quantidade, produto: {id: x.produto.id}}})
          }
        },
      error => {
        //se status for 403 (acesso negado) faz um redirect para HomePage
        if (error.status == 403) {
          this.navCtrl.setRoot('HomePage');
        }
      });
    }
    else {
      //também redirecionar para HomePage caso ocorrer algum problema com seu LocalUser(localStorage)
      this.navCtrl.setRoot('HomePage');
    }
  }

  //faz o binding do endereco selecionado e atribui este enderecoDeEntrega ao pedido
  nextPage(item: EnderecoDTO) {
    //pega a referencia (id) do EnderecoDto 
    this.pedido.enderecoDeEntrega = {id: item.id};
    console.log(this.pedido);
  }

}
