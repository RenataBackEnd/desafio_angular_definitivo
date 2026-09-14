import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Menu } from '../../componentes/menu/menu';
import { VeiculoService } from '../../services/veiculo.service';

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
  
  // Variáveis do painel superior (ESTÁTICAS)
  veiculoSelecionado: string = 'mustang';
  imagemCarro: string = 'img/mustang.png';
  totalVendas: number = 74; 
  conectados: number = 56;
  atualizarSoftware: number = 750;

  // Variáveis da tabela (DINÂMICAS - Via API)
  vinBusca: string = ''; 
  odometro: string = '---';
  nivelCombustivel: string = '---';
  status: string = '---';
  lat: string = '---';
  long: string = '---'; 

  private buscaSubject = new Subject<string>();

  constructor(private veiculoService: VeiculoService) {}

  ngOnInit() {
    // Inicia a tela mostrando o Mustang (Estático)
    this.atualizarEstatisticas('mustang'); 

    // Executa a requisição GET para buscar os modelos
  this.veiculoService.buscarModelos().subscribe({
    next: (dados) => {
      console.log('Modelos recebidos pela API:', dados);
    },
    error: (erro) => {
      console.error('Erro ao buscar modelos:', erro);
    }
  });

    // Prepara a busca do VIN com RxJS (Dinâmico)
    this.buscaSubject.pipe(
      filter(texto => texto.trim().length > 0), 
      debounceTime(500), 
      distinctUntilChanged() 
    ).subscribe(termo => {
      this.realizarBuscaNaApi(termo);
    });
  }

    // Chamado quando o usuário escolhe um carro no Select do HTML
  trocarCarro(event: any) {
    const carroEscolhido = event.target.value.toLowerCase();
    this.atualizarEstatisticas(carroEscolhido);
  }

  // Lógica ESTÁTICA para os cartões de cima (SEM API)
  atualizarEstatisticas(nomeDoCarro: string) {
    if (nomeDoCarro === 'mustang') {
      this.imagemCarro = 'img/mustang.png';
      this.totalVendas = 74;
      this.conectados = 56;
    } else if (nomeDoCarro === 'ranger') {
      this.imagemCarro = 'img/ranger.png';
      this.totalVendas = 120;
      this.conectados = 90;
    } else if (nomeDoCarro === 'territory') {
      this.imagemCarro = 'img/territory.png';
      this.totalVendas = 85;
      this.conectados = 70;
    } else if (nomeDoCarro === 'bronco sport' || nomeDoCarro === 'bronco') {
      this.imagemCarro = 'img/broncoSport.png';
      this.totalVendas = 50;
      this.conectados = 45;
    } else {
      this.imagemCarro = `img/${nomeDoCarro}.png`;
      this.totalVendas = 0;
      this.conectados = 0;
    }
  }

  // --- FUNÇÕES DA TABELA VIN (DINÂMICAS - COM API) ---
  aoDigitar(termo: string) {
    this.buscaSubject.next(termo);
  }

  buscarDadosVin() {
    if (!this.vinBusca) {
      return; 
    }
    this.aoDigitar(this.vinBusca); 
  }

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
        console.error('Erro na API POST:', erro);
        alert('Erro de conexão com a API.');
        this.limparTabela();
      }
    });
  }

  limparTabela() {
    this.odometro = '---';
    this.nivelCombustivel = '---';
    this.status = '---';
    this.lat = '---';
    this.long = '---';
  }
}