import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';

//irá administrar a pagina para abrir com Lazy Loading caso solicitada
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  //construtor já vem injetado com os atributos, classes informadas
  //no Angular quando quiser injetar uma classe basta informar o parametro no construtor
  constructor(public navCtrl: NavController) {

  }

  login() {
    //push irá empilhar uma pagina em cima da outra
    //empilhar a página de CategoriasPage, irá chamar esta página sem precisar importar neste componente
    //quando realizar o login irá automaticamente para tela de Categorias

    //somente ao logar entra na página de categorias, não empilha uma página na outra
    this.navCtrl.setRoot('CategoriasPage');
  }

}
