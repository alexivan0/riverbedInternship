import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, concatMap, forkJoin, map, Observable, of, Subject, switchMap } from 'rxjs';
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
  dailyChangeUrl!: string;
  totalBalance!: number;
  tradeHistory!: ITradeHistory[];
  groupedTrades!: any;
  // newsObject: Object = {}

  private sharedArray: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private sharedTotal: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private newsObject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  sharedArray$: Observable<any> = this.sharedArray.asObservable();
  sharedTotal$: Observable<any> = this.sharedTotal.asObservable();
  newsObject$: Observable<any> = this.newsObject.asObservable();


  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private jwtHelper: JwtHelperService, private router: Router) {
    // console.log("service initialized")
    this.decodeJwt();
    this.getLivePrices(this.portfolioId);
    this.getNews()
    // console.log("service", this.assetList)
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

  //Assets(Portfolio tab)

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
    return this.http.get(url)
  }

  // getPriceChangeUrl() {
  //   this.dailyChangeUrl = "https://api.binance.com/api/v3/ticker/24hr?symbol=["
  //   this.assetList.forEach(element => {
  //     this.dailyChangeUrl = this.dailyChangeUrl + '"' + element.symbol + 'USDT' + '"';
  //     if (this.assetList[this.assetList.length - 1] == element) {
  //       this.dailyChangeUrl = this.dailyChangeUrl + "]"
  //     }
  //     else {
  //       this.dailyChangeUrl = this.dailyChangeUrl + ","
  //     }
  //   })
  //   console.log(this.dailyChangeUrl, "dailyChangeUrl")
  // }

  getAssetPriceChange() {
    this.http.get(this.dailyChangeUrl).subscribe((result: any) => {
      result.sort((a, b) => a.symbol.localeCompare(b.symbol))
      for (let i = 0; i < this.assetList.length; i++) {
        this.assetList[i].dailyChange = result[i].priceChangePercent
      }
    })
  }



  //Assets(Portfolio tab) Live Prices Global Implementation

  getLivePrices(pid) {
    this.getAllAssets(pid).subscribe(result => {
      result.sort((a, b) => a.symbol.localeCompare(b.symbol))
      this.assetList = result;
      this.livePricesUrl = this.getAssetsUrl("https://api.binance.com/api/v3/ticker/price?symbols=[")
      this.dailyChangeUrl = this.getAssetsUrl("https://api.binance.com/api/v3/ticker/24hr?symbols=[")
      this.getAssetsLivePrices()
    }, error => console.log(error));

  }

  // getAssetListPricesUrl() {
  //   this.livePricesUrl = "https://api.binance.com/api/v3/ticker/price?symbols=[";
  //   this.assetList.forEach(element => {
  //     this.livePricesUrl = this.livePricesUrl + '"' + element.symbol + "USDT" + '"';
  //     if (this.assetList[this.assetList.length - 1] == element) {
  //       this.livePricesUrl = this.livePricesUrl + "]"
  //     }
  //     else {
  //       this.livePricesUrl = this.livePricesUrl + ","
  //     }
  //   });
  //   // console.log(this.livePricesUrl);
  // }

  getAssetsUrl(baseUrl: string) {
    this.assetList.forEach(element => {
      baseUrl = baseUrl + '"' + element.symbol + "USDT" + '"';
      if (this.assetList[this.assetList.length - 1] == element) {
        baseUrl = baseUrl + "]"
      }
      else {
        baseUrl = baseUrl + ","
      }
    });
    return baseUrl;
  }

  async getLiveUpdates() {
    while (true) {

      await new Promise(f => setTimeout(f, 5000));
    }
  }

  // async getAssetsLivePricesBroken() {
  //   while (true) {
  //     forkJoin([
  //       this.getAssetsPrice(this.livePricesUrl),
  //       this.getAssetsPrice(this.dailyChangeUrl)
  //     ]).subscribe((result: any) => {
  //       console.log(result)
  //       result[0].sort((a, b) => a.symbol.localeCompare(b.symbol))
  //       result[1].sort((a, b) => a.symbol.localeCompare(b.symbol))
  //       for (let i = 0; i < this.assetList.length; i++) {
  //         this.assetList[i].livePrice = result[0][i].price;
  //         this.assetList[i].liveTotal = this.assetList[i].units * this.assetList[i].livePrice;
  //         this.assetList[i].dailyChange = result[1][i].priceChangePercent
  //       }
  //       this.calculateTotal();
  //       this.setSharedArray(this.assetList);
  //       this.setSharedTotal(this.totalBalance);
  //     })
  //     await new Promise(f => setTimeout(f, 5000));
  //   }
  // }


  async getAssetsLivePrices() {
    while (true) {
      this.getAssetPriceChange()
      this.getAssetsPrice(this.livePricesUrl).subscribe((result: any) => {
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




  //TradeTracker

  getAllTrades(pid: number) {
    //get the user trades from the database
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

  getAllTradesDto(pid) {
    return this.getAllTrades(pid).pipe(map(
      result => {
        // if (this.tradeHistory == null) {
        // }
        this.tradeHistory = result;
        //sort the tradeHistory array alphabetically by symbol name
        this.tradeHistory.sort((a, b) => a.symbol.localeCompare(b.symbol));
        //sort the trades by date in a new object
        this.sortByDate(this.tradeHistory)
        // group the TradesArrays and make calculations, without transforming the array it into an object, so it can be displayed in html
        this.getPnl();
        return result;
      }
    ))
  }

  sortByDate(array) {
    this.groupTrades(array)
    let tradeHistoryByDate: ITradeHistory[] = []
    let tempArray: any
    for (const key in this.groupedTrades) {
      tempArray = []
      this.groupedTrades[key].forEach(element => {
        //create a standardized date time
        element.createdDate = new Date(element.createdDate)
        // push it to the temp array
        tempArray.push(element)
      })
      //sort the temp array by date
      tempArray.sort(
        (objA, objB) => objA.createdDate.getTime() - objB.createdDate.getTime(),
      );
      //add tempArray to the empty tradeHistoryBydate array
      tradeHistoryByDate = [...tradeHistoryByDate, ...tempArray]
    }
    this.tradeHistory = tradeHistoryByDate
  }

  groupTrades(array) {
    //Group the trades Array in an object of Key:Value pairs in which Key = asset name, Value = array of trades for that asset
    let result = array.reduce(function (r, a) {
      r[a.symbol] = r[a.symbol] || [];
      r[a.symbol].push(a);
      return r;
    }, Object.create(null));
    this.groupedTrades = result;
  }

  getPnl() {
    let unitsCount = 0
    let avgBuyPrice = 0;
    let totalUnits = 0;
    let totalInvested = 0;
    let totalTradePrice = 0;
    let totalPnl = 0;
    for (let i = 0; i < this.tradeHistory.length; i++) {
      totalTradePrice = this.tradeHistory[i].price * this.tradeHistory[i].units;
      this.tradeHistory[i].total = totalTradePrice;
      if (i == 0 || i == this.tradeHistory.length - 1 || this.tradeHistory[i].symbol != this.tradeHistory[i - 1].symbol) {
        unitsCount = unitsCount + this.tradeHistory[i].units
        totalInvested = totalTradePrice;
        this.tradeHistory[i].totalInvested = totalInvested;
        avgBuyPrice = this.tradeHistory[i].price
        this.tradeHistory[i].averageBuy = avgBuyPrice;
        totalUnits = this.tradeHistory[i].units;
        this.tradeHistory[i].totalUnits = totalUnits;
        totalTradePrice = this.tradeHistory[i].price * this.tradeHistory[i].units;
        this.tradeHistory[i].total = totalTradePrice;

      }
      else {
        // totalTradePrice = this.tradeHistory[i].price * this.tradeHistory[i].units;
        // this.tradeHistory[i].total = totalTradePrice;
        if (this.tradeHistory[i].type == "Buy") {
          unitsCount = unitsCount + this.tradeHistory[i].units
          totalInvested = totalInvested + totalTradePrice;
          this.tradeHistory[i].totalInvested = totalInvested;
          avgBuyPrice = totalInvested / unitsCount
          this.tradeHistory[i].averageBuy = avgBuyPrice;
          totalUnits = totalUnits + this.tradeHistory[i].units;
          this.tradeHistory[i].totalUnits = totalUnits;
        }
        else if (this.tradeHistory[i].type == "Sell") {
          unitsCount = unitsCount - this.tradeHistory[i].units
          totalInvested = totalInvested - totalTradePrice;
          this.tradeHistory[i].totalInvested = totalInvested;
          avgBuyPrice = totalInvested / unitsCount
          this.tradeHistory[i].averageBuy = avgBuyPrice;
          totalUnits = totalUnits - this.tradeHistory[i].units;
          this.tradeHistory[i].totalUnits = totalUnits;
          this.tradeHistory[i].pnl = (avgBuyPrice - this.tradeHistory[i].price) * this.tradeHistory[i].units;
          totalPnl = totalPnl + this.tradeHistory[i].pnl
          this.tradeHistory[i].totalPnl = totalPnl
        }
      }
    }
  }



  //Analytics

  getAssetKlines(symbol: string, interval: string, avgUnixTime: number) {
    // let pricesArray: number[] = []
    return this.http.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&startTime=${avgUnixTime}`)
  }

  //
  getNews() {
    this.http.get("https://newsdata.io/api/1/news?apikey=pub_112154bb5ff4e67b415061ac80b007878a525&q=crypto&language=en")
      .subscribe(result => {
        this.newsObject.next(result)
      })
  }

  // unix time calculator

  getUnixTime(tradeDate) {
    const formatYmd = date => date.toISOString().slice(0, 10);
    const formatDate = formatYmd(new Date(tradeDate));
    // const unixTime = Math.floor(new Date(formatDate).getTime() + 75600000)
    const unixTime = Math.floor(new Date(formatDate).getTime() + 86400000)
    // const formatDate = formatYmd(tradeDate);
    // const unixTime = Math.floor(new Date(formatDate).getTime())
    return unixTime;
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
  dailyChange: number;
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
  totalInvested: number,
  totalUnits: number,
  averageBuy: number;
  pnl: number
  totalPnl: number;
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
