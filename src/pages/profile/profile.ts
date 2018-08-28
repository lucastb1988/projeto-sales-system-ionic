import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

//Controlador
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService) {
  }

  //igual ao onInit
  ionViewDidLoad() {
    //ao iniciar a página recupera o localUser do storage
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          //está afirmando que esta response irá casar com os dados do cliente (foi retirada tipagem do serviço)
          this.cliente = response as ClienteDTO; //atribuir ao cliente na resposta da requisição se sucesso
          this.getImageIfExists(); //recupera imagem do bucket se existir
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

  //recupera imagem do bucket se existir no mesmo passando id do cliente cadastrado e recuperando
  //através do prefixo + .jpg
  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        //atribui a resposta retornada ao imageUrl
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
      },
    error => {});
  }

}
