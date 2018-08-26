import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  items: ProdutoDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    //recupera parametro de navegação pegando valor passado no
    //showProdutos(categoria_id: string) {
    //this.navCtrl.push('ProdutosPage', {categoria_id: categoria_id}); 
    //(CategoriasPage para ProdutosPage)
    let categoria_id = this.navParams.get('categoria_id');
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
        //este endpoint findByCategoria retorna paginação no backend, por isso é necessário pegar o array content no retorno da resposta
        this.items = response['content'];
      },
    error => {});
  }
}
