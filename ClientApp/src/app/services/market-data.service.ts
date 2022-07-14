import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  //Portfolio

  getQuotes() {
    return this.http.get("https://api.binance.com/api/v3/ticker/price")
      .pipe(
        map((response: any) => response.map(quote => quote['symbol']
        ))
      )
  }

  getAllAssets(pid: number = 0) {
    return this.http.get<IAsset[]>(this.baseUrl + 'api/assets/portfolio/' + pid)
  }

  postAsset(symbol: string, units: number) {
    return this.http.post<IAsset>(this.baseUrl + 'api/assets', {
      units: units,
      symbol: symbol
    })
  }

  updateAsset(assetId: number, portfolioId: number, symbol: string, units: number){
    return this.http.put<IAsset>(this.baseUrl + 'api/assets/' + assetId, {
      assetId: assetId,
      portfolioId: portfolioId,
      symbol: symbol,
      units: units
    })
  }

  //TradeTracker

  getAllTrades(pid: number = 0) {
    return this.http.get<ITradeHistory[]>(this.baseUrl + "api/TradeHistories/portfolio/" + pid)
  }



}
export interface IAsset {
  assetId: number,
  portfolioId: number,
  symbol: string,
  units: number
}

export interface ITradeHistory {
  tradeHistoryId: number,
  portfolioId: number,
  symbol: string,
  units: number,
  type: string,
  price: number,
  createdDate: string
}
