import { IonicPageModule } from 'ionic-angular/module';
import { NgModule } from '@angular/core';
import { HomePage } from './home';

@NgModule({
    declarations: [HomePage],
    imports: [IonicPageModule.forChild(HomePage)]
})
//Criando um módulo para cada pagina para usufruir no Lazy Loading, pagína só será carregada se solicitada
export class HomeModule {
}