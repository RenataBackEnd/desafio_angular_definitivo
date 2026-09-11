import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  
  // As duas rotas diferentes da API do professor
  private urlListaModelos = 'http://localhost:3001/vehicles'; 
  private urlDadosVin = 'http://localhost:3001/vehicleData'; 

  constructor(private http: HttpClient) { }

  // 1. REQUISIÇÃO GET (Para alimentar os cartões superiores e o menu Select)
  buscarModelos(): Observable<any> {
    return this.http.get<any>(this.urlListaModelos);
  }

  // 2. REQUISIÇÃO POST (Para alimentar a tabela com o código VIN)
  buscarPorVin(vin: string): Observable<any> {
    return this.http.post<any>(this.urlDadosVin, { vin: vin });
  }
}