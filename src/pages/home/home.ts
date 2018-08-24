import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';

//irá administrar a pagina para abrir com Lazy Loading caso solicitada
//Controlador
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds: CredenciaisDTO = {
    email: "",
    senha: ""
  }

  //construtor já vem injetado com os atributos, classes informadas
  //no Angular quando quiser injetar uma classe basta informar o parametro no construtor
  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService) {
  }

  //eventos de life cycle do ionic, na pagina principal irá desabilitar a chamada do menu
  ionViewWillEnter() {
    this.menu.swipeEnable(false);
  }

  //irá habilitar o menu quando estiver em uma ágina diferente da página inicial
  ionViewDidLeave() {
    this.menu.swipeEnable(true);
  }

  login() {
    //ex: push irá empilhar uma pagina em cima da outra
    //empilhar a página de CategoriasPage, irá chamar esta página sem precisar importar neste componente
    //quando realizar o login irá automaticamente para tela de Categorias

    //somente ao logar entra na página de categorias, não empilha uma página na outra

    this.auth.authenticate(this.creds)
      .subscribe(response => {
        //se autenticar e logar com sucesso no localStorage deverá estar armazenado o token na sessão
        this.auth.successfulLogin(response.headers.get('Authorization'));
        this.navCtrl.setRoot('CategoriasPage');
      },
    error => {});    
  }
}
