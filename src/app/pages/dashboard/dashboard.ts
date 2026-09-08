import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Menu } from '../../componentes/menu/menu';
import { VeiculoService } from '../../services/veiculo.service';

// Importando os operadores RxJS exigidos no desafio
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [Menu, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  veiculoSelecionado: string = 'Mustang';
  imagemCarro: string = 'img/mustang.png';
  totalVendas: number = 1500;
  conectados: number = 500;
  atualizarSoftware: number = 750;

  // Variáveis da tabela
  vinBusca: string = ''; 
  odometro: string = '---';
  nivelCombustivel: string = '---';
  status: string = '---';
  lat: string = '---';
  long: string = '---'; 

  // Variável do RxJS: O "ouvinte" da digitação
  private buscaSubject = new Subject<string>();

  constructor(private veiculoService: VeiculoService) {}

  // Configuração inicial dos filtros do RxJS exigidos pelo professor
  ngOnInit() {
    this.buscaSubject.pipe(
      filter(texto => texto.trim().length > 0), 
      debounceTime(500), 
      distinctUntilChanged() 
    ).subscribe(termo => {
      this.realizarBuscaNaApi(termo);
    });
  }

  // ESSA É A FUNÇÃO QUE FALTAVA PARA O ERRO SUMIR:
  aoDigitar(termo: string) {
    this.buscaSubject.next(termo);
  }

  // API - Lógica mantida caso aperte Enter
  buscarDadosVin() {
    if (!this.vinBusca) {
      return; 
    }
    this.aoDigitar(this.vinBusca); 
  }

  // API - Conexão com o json-server usando o 'map'
  realizarBuscaNaApi(vin: string) {
    this.veiculoService.buscarPorVin(vin).pipe(
      map(dados => Array.isArray(dados) ? dados[0] : dados)
    ).subscribe({
      next: (veiculo) => {
        if (veiculo) {          
          this.odometro = veiculo.odometro;
          this.nivelCombustivel = veiculo.nivelCombustivel;
          this.status = veiculo.status;
          this.lat = veiculo.lat;
          this.long = veiculo.long;
        } else {
          alert('Veículo não encontrado!');
          this.limparTabela();
        }
      },
      error: (erro) => {
        console.error('Erro na API:', erro);
        alert('Erro de conexão. O json-server na porta 3001 está rodando?');
        this.limparTabela();
      }
    });
  }

  // Se der erro limpa tabela
  limparTabela() {
    this.odometro = '---';
    this.nivelCombustivel = '---';
    this.status = '---';
    this.lat = '---';
    this.long = '---';
  }

  trocarCarro(event: any) {
    const carroEscolhido = event.target.value;

    if (carroEscolhido === 'mustang') {
      this.imagemCarro = 'img/mustang.png';
      this.totalVendas = 1500;
      this.conectados = 500;
    } else if (carroEscolhido === 'ranger') {
      this.imagemCarro = 'img/ranger.png';
      this.totalVendas = 3200;
      this.conectados = 1200;
    } else if (carroEscolhido === 'territory') {
      this.imagemCarro = 'img/territory.png';
      this.totalVendas = 900;
      this.conectados = 300;
    } else if (carroEscolhido === 'bronco') {
      this.imagemCarro = 'img/broncoSport.png'; 
      this.totalVendas = 600;
      this.conectados = 250;
    }
  }
}