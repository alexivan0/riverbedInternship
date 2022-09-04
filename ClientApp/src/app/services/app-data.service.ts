import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppDataService {

  // currentRoute!: string;
  portfolioId!: number;
  assetsData: any;
  assetList!: IAsset[];
  livePricesUrl!: string;
  totalBalance!: number;

  private sharedArray: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private sharedTotal: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  sharedArray$: Observable<any> = this.sharedArray.asObservable();
  sharedTotal$: Observable<any> = this.sharedTotal.asObservable();


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private jwtHelper: JwtHelperService, private router: Router) {
    console.log("service initialized")
    this.decodeJwt();
    this.getLivePrices(this.portfolioId);
    console.log("service", this.assetList)
    // this.currentRoute = "";
    // this.router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationStart) {
    //     // Show loading indicator
    //     console.log('Route change detected');
    //   }

    //   if (event instanceof NavigationEnd) {
    //     this.currentRoute = event.url;
    //     console.log(event);
    //   }

    //   if (event instanceof NavigationError) {
    //     // Hide loading indicator

    //     // Present error to user
    //     console.log(event.error);
    //   }
    // });
  }

  // ngOnInit(): void {

  // }



  //Authentication

  isUserAuthenticated() {
    const token: string = localStorage.getItem("jwt")!;

    if (token && !this.jwtHelper.isTokenExpired(token))
      return true;
    else
      return false;
  }

  logOut() {
    localStorage.removeItem("jwt");
  }

  decodeJwt() {
    const token = this.jwtHelper.decodeToken(localStorage.getItem("jwt") || "");
    if (token != null) {
      this.portfolioId = token.PortfolioId
      console.log("decodejwt portfolioid", console.log(this.portfolioId))
    }
  }

  reloadCurrentPage() {
    window.location.reload();
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
    return this.http.put<IAsset>(this.baseUrl + 'api/assets/' + assetId + "/portfolios/" + portfolioId, {
      portfolioId: portfolioId,
      assetId: assetId,
      symbol: symbol,
      units: units
    })
  }

  deleteAsset(portfolioId: number, assetId: number) {
    return this.http.delete<IAsset>(this.baseUrl + 'api/assets/' + assetId + "/portfolios/" + portfolioId)
  }

  getAssetsPrice(url) {
    return this.http.get<IAssetLivePrices[]>(url)
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

  //Live Prices Global Implementation

  getLivePrices(pid) {
    this.getAllAssets(pid).subscribe(result => {
      result.sort((a, b) => a.symbol.localeCompare(b.symbol))
      this.assetList = result;
      this.getAssetListPricesUrl();
      this.getAssetsLivePrice();
      console.log("getliveprices", this.assetList);
    }, error => console.log(error));

    // this.http.get<IAsset[]>(this.baseUrl + 'api/assets/portfolios/' + pid).subscribe(result => {
    //   result.sort((a, b) => a.symbol.localeCompare(b.symbol))
    //   this.assetList = result;
    //   this.getAssetListPricesUrl();
    //   this.getAssetsLivePrice();
    //   console.log(this.assetList);
    // }, error => console.log(error));
  }

  getAssetListPricesUrl() {
    this.livePricesUrl = "https://api.binance.com/api/v3/ticker/price?symbols=[";
    this.assetList.forEach(element => {
      this.livePricesUrl = this.livePricesUrl + '"' + element.symbol + "USDT" + '"';
      if (this.assetList[this.assetList.length - 1] == element) {
        this.livePricesUrl = this.livePricesUrl + "]"
      }
      else {
        this.livePricesUrl = this.livePricesUrl + ","
      }
    });
    console.log(this.livePricesUrl);
  }

  async getAssetsLivePrice() {
    while (true) {
      this.getAssetsPrice(this.livePricesUrl).subscribe(result => {
        result.forEach((element, index) => {
          result[index].symbol = element.symbol.substring(0, element.symbol.length - 4);
        });
        result.sort((a, b) => a.symbol.localeCompare(b.symbol));
        this.assetList.sort((a, b) => a.symbol.localeCompare(b.symbol));
        for (let i = 0; i < this.assetList.length; i++) {
          this.assetList[i].livePrice = result[i].price;
          this.assetList[i].liveTotal = this.assetList[i].units * this.assetList[i].livePrice;
        }
        this.calculateTotal();
        this.setSharedArray(this.assetList);
        this.setSharedTotal(this.totalBalance);
      })
      await new Promise(f => setTimeout(f, 5000));
      console.log("assets live prices running");
    }
  }

  calculateTotal() {
    this.totalBalance = 0;
    this.assetList.forEach(element => {
      this.totalBalance = Number(this.totalBalance) + Number(element.liveTotal);
    });
  }

  setSharedArray(sharedArray) {
    this.sharedArray.next(sharedArray)
  }
  setSharedTotal(sharedTotal) {
    this.sharedTotal.next(sharedTotal)
  }



}

//Interfaces

export interface IAsset {
  portfolioId: number,
  assetId: number,
  symbol: string,
  units: number
  livePrice: number;
  liveTotal: number;
}

export interface ITradeHistory {
  tradeHistoryId: number,
  portfolioId: number,
  symbol: string,
  units: number,
  price: number,
  total: number,
  type: string,
  createdDate: string,
  accumulated: number,
  totalUnits: number,
  averageBuy: number;
  pnl: number
}

export interface IPortfolio {
  portfolioId: number,
  userId: number,
  tradeBalance: number
}

export interface IAssetLivePrices {
  symbol: string,
  price: number,
}
