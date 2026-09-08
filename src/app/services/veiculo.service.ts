import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  
  // Endereço servidor falso 
  private apiUrl = 'http://localhost:3001/veiculo'; 

  // Injetando o HttpClient
  constructor(private http: HttpClient) { }

  // Função GET para buscar os dados
  buscarPorVin(vin: string): Observable<any> {
    const url = `${this.apiUrl}?vin=${vin}`;
    return this.http.get<any>(url);
  }
}