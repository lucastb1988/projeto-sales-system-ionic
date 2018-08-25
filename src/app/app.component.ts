import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage'; //alterou para string a rootPage para ser chamada através de Lazy Loading

  pages: Array<{title: string, component: string}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public auth: AuthService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Profile', component: 'ProfilePage' }, //páginas do menu
      { title: 'Categorias', component: 'CategoriasPage' }, //páginas do menu
      { title: 'Logout', component: ''}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  //criando página de logout e caso titulo da pagina for Logout desconecta do aplicativo e limpa o localStorage
  openPage(page: {title: string, component: string}) {

    switch(page.title) {
      case 'Logout':
      this.auth.logout(); //chama o método logout criado em AuthService
      this.nav.setRoot('HomePage'); //faz o logout e volta para página Home
      break;

      default:
      this.nav.setRoot(page.component);
    }   
  }
}
