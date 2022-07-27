import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  // token;
  // headers;
  portfolioId!: number;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private jwtHelper: JwtHelperService) {
    // this.token = localStorage.getItem("jwt")!;
    // this.headers = new HttpHeaders().set("Authorization", 'Bearer ' + this.token);
    this.getCurrentUserId()
  }
   
  

  //Authentication

  isUserAuthenticated() {
    const token: string = localStorage.getItem("jwt")!;

    if(token && !this.jwtHelper.isTokenExpired(token))
      return true;
    else
      return false;
  }

  logOut() {
    localStorage.removeItem("jwt");
  }


  //Search box

  getQuotes() {
    return this.http.get("https://api.binance.com/api/v3/ticker/price")
      .pipe(
        map((response: any) => response.map(quote => quote['symbol']
        ))
      )
  }

  //Assets

  getAllAssets(pid: number) {
    return this.http.get<IAsset[]>(this.baseUrl + 'api/assets/portfolios/' + pid)
  }

  postAsset(portfolioId: number, symbol: string, units: number) {
    return this.http.post<IAsset>(this.baseUrl + 'api/assets/portfolios/' + portfolioId, {
      portfolioId: portfolioId,
      units: units,
      symbol: symbol
    })
  }

  updateAsset(portfolioId: number, assetId: number, symbol: string, units: number) {
    return this.http.put<IAsset>(this.baseUrl + 'api/assets/' + assetId + "/portfolios/" + portfolioId , {
      portfolioId: portfolioId,
      assetId: assetId,
      symbol: symbol,
      units: units
    })
  }

  deleteAsset(portfolioId: number, assetId: number) {
    return this.http.delete<IAsset>(this.baseUrl + 'api/assets/' + assetId + "/portfolios/" + portfolioId)
  }

  //Portfolio

  // GetPortfolio() {
  //  return this.http.get<IPortfolio>(this.baseUrl + )
  // }


  //TradeTracker

  getAllTrades(pid: number) {
    return this.http.get<ITradeHistory[]>(this.baseUrl + "api/tradehistories/portfolios/" + pid)
  }

  postTrade(pid: number, symbol: string, units: number, price: number, type: string, date: string) {
    return this.http.post<ITradeHistory>(this.baseUrl + "api/tradehistories/portfolios/" + pid, {
      portfolioId: pid,
      symbol: symbol,
      units: units,
      price: price,
      type: type,
      createdDate: date
    })
  }

  updateTrade(tradeHistoryId: number, pid: number, symbol: string, units: number, price: number, type: string, date: string) {
    return this.http.put<ITradeHistory>(this.baseUrl + "api/tradehistories/" + tradeHistoryId + "/portfolios/" + pid, {
      portfolioId: pid,
      tradeHistoryId: tradeHistoryId,
      symbol: symbol,
      units: units,
      price: price,
      type: type,
      createdDate: date
    })
  }

  deleteTrade(tradeHistoryId: number, pid: number) {
    return this.http.delete<ITradeHistory>(this.baseUrl + "api/tradehistories/" + tradeHistoryId + "/portfolios/" + pid)
  }

  //Current User

  getCurrentUserId(){
    this.http.get<IPortfolio>(this.baseUrl + "api/portfolios/currentuser").subscribe(result => {
      this.portfolioId = result.portfolioId;
      console.log("portfolioId from getCurrentUserId():");
      console.log(this.portfolioId);
    }, error => console.log(error))
  }

}

//Interfaces

export interface IAsset {
  portfolioId: number,
  assetId: number,
  symbol: string,
  units: number
}

export interface ITradeHistory {
  tradeHistoryId: number,
  portfolioId: number,
  symbol: string,
  units: number,
  price: number,
  type: string,
  createdDate: string
}

export interface IPortfolio {
  portfolioId: number,
  userId: number,
  tradeBalance: number
}
