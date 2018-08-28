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

  items: ProdutoDTO[] = []; //irá começar vazia para poder concatenar com as proximas paginas
  page: number = 0;//inicializa a página com a primeira

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
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
      .subscribe(response => {
        let start = this.items.length; //pega a primeira pagina e o tamanho dela (ex: 0 a 9)
        //este endpoint findByCategoria retorna paginação no backend, por isso é necessário pegar o array content no retorno da resposta
        this.items = this.items.concat(response['content']); //concatenando as páginas
        let end = this.items.length - 1; //pega a página subsequente -1 (ex: 10 a 19, 20 a 29)
        loader.dismiss(); //dispensa o método de loading após o carregamento da tela
        console.log(this.page);
        console.log(this.items);
        this.loadImageUrls(start, end); //chama os produtos que possuem imagem cadastrada no S3
      },
    error => {
      loader.dismiss(); //se der algum erro também dispensa o método de loading
    });
  }

  //itera sobre todos os produtos e pega id de cada um deles, 
  //depois faz a chamada ao S3 atribuindo ao imageUrl a imagem recuperada do S3 passando id
  //coloca um start e end para carregar somente a página necessária e suas imagens, 
  //não todas, todas as vezes que passa nesse metodo
  loadImageUrls(start: number, end: number) {
    for (var i = start; i <= end; i++) {
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
    this.page = 0; //quando dá refresh inicializa pagina novamente como a primeira
    this.items = [];
    this.loadData(); //faz a requisição novamente, recarrega os dados do backend (aqui atualiza os campos)
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {    
    this.page++; //incrementa a página com a próxima pagina
    //faz a requisição novamente, trazendo a próxima e assim consecutivamente pegando pagina a pagina
    this.loadData(); 
    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);
  }
}
