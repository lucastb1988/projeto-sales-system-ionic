import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CategoriaService } from '../../services/domain/categoria.service';
import { CategoriaDTO } from '../../models/categoria.dto';
import { API_CONFIG } from '../../config/api.config';

 //Controlador
@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  //atributo criado para recuperar a URL padrão que criamos no Aws S3 ao salvar as imagens
  bucketUrl: string = API_CONFIG.bucketBaseUrl;
  items: CategoriaDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public categoriaService: CategoriaService) {
  }

  //ionViewDidLoad() - quando página terminar de ser carregada irá carregar o que vier dentro deste método
  //como o serviço findAll é uma chamada assincrona precisa se inscrever para fazer algo 
  //quando a resposta chegar e executar uma função
  ionViewDidLoad() {
    this.categoriaService.findAll()
      .subscribe(response => {
        //esta resposta items que será utilizada no html
        this.items = response; //realiza esta função quando a resposta da requisição der sucesso
      },
    //precisa mostrar os erros mesmo vazio aqui pois o Interceptor está propagando o erro e está capturando aqui no Observable
    error => {}); //os erros não serão tratados aqui e sim no Interceptor criado
  }

  showProdutos(categoria_id: string) {
    this.navCtrl.push('ProdutosPage', {categoria_id: categoria_id}); //passou um parametro e deu push para empilhar a pagina
  }
}
