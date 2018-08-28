import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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
    public produtoService: ProdutoService,
    public loadingController: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    //recupera parametro de navegação pegando valor passado no
    //showProdutos(categoria_id: string) {
    //this.navCtrl.push('ProdutosPage', {categoria_id: categoria_id}); 
    //(CategoriasPage para ProdutosPage)
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(categoria_id)
      .subscribe(response => {
        //este endpoint findByCategoria retorna paginação no backend, por isso é necessário pegar o array content no retorno da resposta
        this.items = response['content'];
        loader.dismiss(); //dispensa o método de loading após o carregamento da tela
        this.loadImageUrls(); //chama os produtos que possuem imagem cadastrada no S3
      },
    error => {
      loader.dismiss(); //se der algum erro também dispensa o método de loading
    });
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

  //criando método para mostrar um loading durante o redirecionamento para tela de produtos
  presentLoading() {
    let loader = this.loadingController.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader; //controlar manualmente o botao de loading
  }

  //da um refresh na página (atualiza a pagina de produtos)
  doRefresher(refresher) {
    this.loadData(); //faz a requisição novamente, recarrega os dados do backend (aqui atualiza os campos)
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
