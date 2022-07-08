import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  constructor(private http: HttpClient) { }

  getQuotes() {
    return this.http.get("https://api.binance.com/api/v3/ticker/price")
    .pipe(
      map((response: any) => response.map((quote:any) => quote['symbol']
      ))
    )
}

}
