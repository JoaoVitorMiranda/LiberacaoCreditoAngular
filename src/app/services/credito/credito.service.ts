import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Credito } from 'src/app/models/credito.model';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  constructor(private http: HttpClient) { }

  getAllCredito() {
    return this.http.get<Credito[]>(`${environment.apiUrl}/api/v1/credito`)
  }

  addCredito(credito: any){
    return this.http.post<Credito>(`${environment.apiUrl}/api/v1/credito/Post`, credito);
  }

  getAllByCreditoId(id: number) {
    return this.http.get(`${environment.apiUrl}/api/v1/credito/${id}`);
  }

  setCredito(credito: any){
    return this.http.post(`${environment.apiUrl}/api/v1/credito`, credito);
  }
}
