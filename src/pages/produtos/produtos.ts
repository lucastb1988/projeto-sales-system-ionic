import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

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
        this.loadImageUrls(); //chama os produtos que possuem imagem cadastrada no S3
      },
    error => {});
  }

  //itera sobre todos os produtos e pega id de cada um deles, 
  //depois faz a chamada ao S3 atribuindo ao imageUrl a imagem recuperada do S3 passando id do
  loadImageUrls() {
    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
      error => {});
    }
  }

  //passando parametro de navegação
  showDetail(produto_id: string) {
    this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id});
  }
}
