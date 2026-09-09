import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  
  // Endereço NOVO da API
  private apiUrl = 'http://localhost:3001/vehicleData'; 

  constructor(private http: HttpClient) { }

  // Mudando de GET para POST
  buscarPorVin(vin: string): Observable<any> {
    // O professor pediu POST e espera receber um objeto JSON com o formato { vin: "codigo..." }
    return this.http.post<any>(this.apiUrl, { vin: vin });
  }
}