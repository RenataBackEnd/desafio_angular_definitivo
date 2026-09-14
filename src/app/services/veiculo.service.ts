import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  
  // Rotas da API do professor
  private urlListaModelos = 'http://localhost:3001/vehicles'; 
  private urlDadosVin = 'http://localhost:3001/vehicleData'; 

  constructor(private http: HttpClient) { }

  // REQUISIÇÃO GET
  buscarModelos(): Observable<any> {
    return this.http.get<any>(this.urlListaModelos);
  }

  // REQUISIÇÃO POST (Para a tabela buscar os dados do VIN)
  buscarPorVin(vin: string): Observable<any> {
    return this.http.post<any>(this.urlDadosVin, { vin: vin });
  }
}