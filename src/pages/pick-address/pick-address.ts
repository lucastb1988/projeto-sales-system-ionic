import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-pick-address',
  templateUrl: 'pick-address.html',
})
export class PickAddressPage {

  items: EnderecoDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public storage: StorageService,
    public clienteService: ClienteService) {
  }

  ionViewDidLoad() {
    //ao iniciar a página recupera o localUser do storage
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          this.items = response['enderecos']; //atribuir aos endereços os 'enderecos' do backend que foi recuperado pelo response
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

}
