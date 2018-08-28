import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { FormGroup, FormBuilder, Validators } from '../../../node_modules/@angular/forms';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  pedido: PedidoDTO;

  //caso for pagamento com cartão pode ser escolhido em quantas parcelas
  parcelas: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  //formulario para controlar os dados da tela que o usuario irá acessar
  formGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {

      //irá recuperar o pedido preenchido feito na página anterior (PickAddressPage)
      this.pedido = this.navParams.get('pedido');

      this.formGroup = this.formBuilder.group({
        numeroParcelas: [1, Validators.required],
        "@type": ["pagamentoComCartao", Validators.required]
      });
  }

  nextPage() {
    //atribui ao pagamento o value do formGroup preenchido
    this.pedido.pagamento = this.formGroup.value;
    console.log(this.pedido);
  }

}
