import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';
import { CidadeService } from '../../services/domain/cidade.service';
import { EstadoService } from '../../services/domain/estado.service';
import { EstadoDTO } from '../../models/estado.dto';
import { CidadeDTO } from '../../models/cidade.dto';

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
    public estadoService: EstadoService) {

      //formBuilder responsavel por instansciar fromGroup (injetar)
      this.formGroup = this.formBuilder.group({
        //recupera nome vindo do formulario (ex: <ion-input formControlName="nome") e faz uma validação assim como no backend, '' inicializa como valor padrão
        nome: ['Lucas', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]], //está preenchendo o campo somente para testes
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
    console.log("enviou o form");
  }
}
