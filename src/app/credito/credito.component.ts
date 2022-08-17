import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TipoCredito } from '../enums/tipo-credio.enum';
import { Credito } from '../models/credito.model';
import { CreditoService } from '../services/credito/credito.service';

@Component({
  selector: 'app-credito',
  templateUrl: './credito.component.html',
  styleUrls: ['./credito.component.css']
})
export class CreditoComponent implements OnInit {

 // Make a variable reference to our Enum
  tipoCredito: typeof TipoCredito = TipoCredito;

  form: FormGroup;
  tipoCreditoValue: FormControl;
  valor: FormControl;
  qtdParcelas: FormControl;
  vencimento: FormControl;
  
  constructor(
    public formBuilder: FormBuilder,
    public creditoService: CreditoService
  ) { 

    this.form = this.formBuilder.group({
      tipoCreditoValue: [null, [Validators.required]],
      valor: [0, [Validators.required]],
      qtdParcelas: [0, [Validators.required]],
      vencimento: [0, [Validators.required]]
    });

    this.tipoCreditoValue = this.form.controls.tipoCreditoValue as FormControl;
    this.valor = this.form.controls.valor as FormControl;
    this.qtdParcelas = this.form.controls.qtdParcelas as FormControl;
    this.vencimento = this.form.controls.vencimento as FormControl;
  }

  ngOnInit(): void {
    this.getAll()
  }

  onSubmit(): void {

    let taxa = 0;
    let msgReprovado = 'Status do crédito: Recusado';

    switch (this.tipoCreditoValue.value) {
      case TipoCredito.Direto:
        taxa = 2;
        break;

        case TipoCredito.Consignado:
        taxa = 1;
        break;

        case TipoCredito.PessoaJuridica:
        taxa = 5;
        break;

        case TipoCredito.PessoaFisica:
        taxa = 3;
        break;

        case TipoCredito.Imobiliario:
        taxa = 9;
        break;
    }

    let porcentagem = (taxa / 100) * this.valor.value;
    let total = this.valor.value + porcentagem;
    let msgValor = ' Valor total com juros: R$ ' + total + " Valor dos juros: " + porcentagem;


    if (!this.vencimento.valid) {
      alert('Data de vencimento inválida!');
      alert(msgReprovado + msgValor);
      return
    }

    if (this.qtdParcelas.value < 5 || this.qtdParcelas.value > 75) {
      alert('A quantidade mínima de parce las é de 5x e a máxima é de 72x');
      alert(msgReprovado + msgValor);
      return
    }  

    if (this.tipoCreditoValue.value == TipoCredito.PessoaJuridica && this.valor.value < 15000) {
      alert('Para o crédito de pessoa jurídica , o valor mínimo a ser liberado é de R$ 15.000,00');
      alert(msgReprovado + msgValor);
      return
    }  

    var diferencaData = this.calculateDiff(this.vencimento.value);
    if (diferencaData > 40 || diferencaData < 15) {
      alert('A data do primeiro vencimento sempre será no mí ni mo 15 dias e no máximo 40 dias a partir da data atual');
      alert(msgReprovado + msgValor);
      return
    }  

    let msgAprovado = 'Status do crédito: Aprovado';
    alert(msgAprovado + msgValor);
  
    console.warn('dados do formulario', this.form.value);
    this.form.reset();
  }

  calculateDiff(data: Date){
    let date = new Date(data);
    let currentDate = new Date();

    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
    return days * -1;
}

  public getAll(): void {
    this.creditoService.getAllCredito().subscribe(
      (success: any) => {
        //this.listcredito = success.Data
      },
      error => {
        //this.listcredito = []
        if(error && error.status == 403) {
          console.log(error.body)
        } else { // erro 500 ou outros ...
          console.log(error.body)
        }

        const notifications = error.error.Notifications;
        for(let i = 0; i < notifications?.length; i++){
          console.log(notifications[i].Value)
        }

      }
    )
  }

}
