import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto';
import { ClienteService } from '../../services/domain/cliente.service';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  //FormGroup ajuda a controlar o formulario, fazer validações
  formGroup: FormGroup;
  estados: EstadoDTO[];
  cidades: CidadeDTO[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public estadoService: EstadoService,
    public clienteService: ClienteService,
    public alertController: AlertController) {

      //formBuilder responsavel por instansciar fromGroup (injetar)
      this.formGroup = this.formBuilder.group({
        //recupera nome vindo do formulario (ex: <ion-input formControlName="nome") e faz uma validação assim como no backend, '' inicializa como valor padrão
        nome: ['Joaquim', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]], //está preenchendo o campo somente para testes
        email: ['joaquim@gmail.com', [Validators.required, Validators.email]],
        tipo : ['1', [Validators.required]],
        cpfOuCnpj : ['06134596280', [Validators.required, Validators.minLength(11), Validators.maxLength(14)]],
        senha : ['123', [Validators.required]],
        logradouro : ['Rua Via', [Validators.required]],
        numero : ['25', [Validators.required]],
        complemento : ['Apto 3', []],
        bairro : ['Copacabana', []],
        cep : ['10828333', [Validators.required]],
        telefone1 : ['977261827', [Validators.required]],
        telefone2 : ['', []],
        telefone3 : ['', []],
        estadoId : [null, [Validators.required]],
        cidadeId : [null, [Validators.required]]    
      });
  }

  ionViewDidLoad() {
    this.estadoService.findAll() 
      .subscribe(response => {
        this.estados = response;
        this.formGroup.controls.estadoId.setValue(this.estados[0].id); //deixar setado o estado com a primeira posição que encontrar
        this.updateCidades(); //buscar as cidades de acordo com o estado selecionado
      },
    error => {});
  }

  updateCidades() {
    let estado_id = this.formGroup.value.estadoId; //pega o estado selecionado na lista de estados do formulario preenchido
    this.cidadeService.findAll(estado_id) //carregar as cidades do estado selecionado
      .subscribe(response => {
        this.cidades = response;
        this.formGroup.controls.cidadeId.setValue(null); //não traz nenhuma cidade preenchida quando selecionar estado
      },
    error => {});
  }

  signupUser() {
    this.clienteService.insert(this.formGroup.value) //este comando recupera o Json inteiro do formulario
      .subscribe(response => {
        this.showInsertOk();
      },
      error => {});
  }

  showInsertOk() {
    let alert = this.alertController.create({
      title: 'Sucesso!',
      message: 'Cadastro efetuado com sucesso',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ok',
          //handler: () = função anônima
          handler: () => { //quando clicar no botão Ok, faz uma função
            this.navCtrl.pop(); 
            //pop = desempilhar a página //como o formulario foi empilhado através da pagina de login se der certo o insert desempilha essa página
          }
        }
      ]
    });
    alert.present(); //alert será apresentado na tela
  }
}
