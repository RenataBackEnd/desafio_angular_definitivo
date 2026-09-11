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
  
  // Lista que vai guardar os dados vindos da API (GET)
  listaVeiculosDaApi: any[] = [];

  // Variáveis do painel superior
  veiculoSelecionado: string = 'mustang';
  imagemCarro: string = 'img/mustang.png';
  totalVendas: number = 0;
  conectados: number = 0;
  atualizarSoftware: number = 750;

  // Variáveis da tabela (POST)
  vinBusca: string = ''; 
  odometro: string = '---';
  nivelCombustivel: string = '---';
  status: string = '---';
  lat: string = '---';
  long: string = '---'; 

  private buscaSubject = new Subject<string>();

  constructor(private veiculoService: VeiculoService) {}

  ngOnInit() {
    // 1. Inicia buscando os modelos (GET)
    this.carregarDadosIniciais();

    // 2. Prepara a busca do VIN (POST)
    this.buscaSubject.pipe(
      filter(texto => texto.trim().length > 0), 
      debounceTime(500), 
      distinctUntilChanged() 
    ).subscribe(termo => {
      this.realizarBuscaNaApi(termo);
    });
  }

  // NOVA FUNÇÃO: Busca os modelos na API
  carregarDadosIniciais() {
    this.veiculoService.buscarModelos().subscribe({
      next: (dados) => {
        this.listaVeiculosDaApi = dados;
        // Inicia a tela mostrando o Mustang
        this.atualizarEstatisticas('mustang'); 
      },
      error: (erro) => {
        console.error('Erro na API GET:', erro);
      }
    });
  }

  // Chamado quando o usuário escolhe um carro no Select do HTML
  trocarCarro(event: any) {
    const carroEscolhido = event.target.value.toLowerCase();
    this.atualizarEstatisticas(carroEscolhido);
  }

  // Atualiza os números puxando da lista da API
  atualizarEstatisticas(nomeDoCarro: string) {
    const carroEncontrado = this.listaVeiculosDaApi.find(
      (carro) => carro.vehicle.toLowerCase() === nomeDoCarro
    );

    if (carroEncontrado) {
      this.totalVendas = carroEncontrado.totalSales;
      this.conectados = carroEncontrado.connectedVehicles;
      
      // Ajuste para o nome da imagem do Bronco
      if (nomeDoCarro === 'bronco sport' || nomeDoCarro === 'bronco') {
         this.imagemCarro = 'img/broncoSport.png';
      } else {
         this.imagemCarro = `img/${nomeDoCarro}.png`;
      }
    }
  }

  // --- FUNÇÕES DA TABELA VIN (Mantidas) ---
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