import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

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
          this.cliente = response; //atribuir ao cliente na resposta da requisição se sucesso
          this.getImageIfExists(); //recupera imagem do bucket se existir
        },
      error => {});
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
