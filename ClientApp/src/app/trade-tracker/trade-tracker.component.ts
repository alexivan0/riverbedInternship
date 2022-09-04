import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITradeHistory, AppDataService } from 'src/app/services/app-data.service';

@Component({
  selector: 'app-trade-tracker',
  templateUrl: './trade-tracker.component.html',
  styleUrls: ['./trade-tracker.component.css']
})
export class TradeTrackerComponent implements OnInit {

  symbolList!: string[];
  filteredSymbols!: string[];
  portfolioId: number = this.service.portfolioId
  tradeHistory!: ITradeHistory[];
  lastPnl!: number;
  updatePortfolio: boolean = true;
  myDate = new Date().toLocaleDateString();
  toggleShowUpdateTrade: boolean = false;
  updatedTrade: ITradeHistory = {
    tradeHistoryId: -1,
    portfolioId: -1,
    symbol: "",
    units: -1,
    price: -1,
    total: -1,
    type: "",
    createdDate: "",
    accumulated: -1,
    totalUnits: -1,
    averageBuy: -1,
    pnl: -1,
  }

  formGroup!: FormGroup;


  constructor(private service: AppDataService, private fb: FormBuilder, private datePipe: DatePipe) {
    this.myDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd')!;
  }

  ngOnInit(): void {
    this.initForm();
    this.getSymbols();
    this.getAllTrades(this.portfolioId);
  }

  initForm() {
    this.formGroup = this.fb.group({
      'symbol': ['']
    })
    this.formGroup.get('symbol')?.valueChanges.subscribe(response => {
      this.filterdata(response);
    })
  }

  filterdata(enteredData: any) {
    this.filteredSymbols = this.symbolList.filter(symbol => {
      return symbol.toLocaleLowerCase().indexOf(enteredData.toLocaleLowerCase()) > -1
    })
  }

  toggleUpdatePortfolio() {
    this.updatePortfolio = !this.updatePortfolio;
    console.log(this.updatePortfolio)
  }

  toggleUpdateTrade(tradeHistoryId: number, portfolioId: number, symbol: string, units: number, price: number, type: string, date: string) {
    this.toggleShowUpdateTrade = true;
    this.updatedTrade.tradeHistoryId = tradeHistoryId;
    this.updatedTrade.portfolioId = portfolioId;
    this.updatedTrade.symbol = symbol;
    this.updatedTrade.units = units;
    this.updatedTrade.price = price;
    this.updatedTrade.type = type;
    this.updatedTrade.createdDate = date;
  }

  getSymbols() {
    this.service.getQuotes().subscribe(response => {
      this.symbolList = response;
      this.symbolList = this.symbolList.filter(array => array.includes('USDT'))
      this.symbolList.forEach((element, index) => {
        this.symbolList[index] = element.substring(0, element.length - 4);
      });
      this.filteredSymbols = this.symbolList;
    })
  }

  getAllTrades(pid) {
    this.service.getAllTrades(pid).subscribe(result => {
      this.tradeHistory = result;
      this.tradeHistory.sort((a, b) => a.symbol.localeCompare(b.symbol));
      this.getPnl();
      console.log(this.tradeHistory);
    }, error => console.log(error));
  }

  postTrade(pid: number, symbol: string, units: number, price: number, type: string, date: string) {
    this.service.postTrade(pid, symbol, units, price, type, date).subscribe(result => {
      this.getAllTrades(this.portfolioId)
    }, error => console.log(error));
  }

  updateTrade(tradeHistoryId: number, pid: number, symbol: string, units: number, price: number, type: string, date: string) {
    this.service.updateTrade(tradeHistoryId, pid, symbol, units, price, type, date).subscribe(result => {
      this.getAllTrades(this.portfolioId)
    }, error => console.log(error))
    this.toggleShowUpdateTrade = false;
  }

  postToPortfolio(portfolioId: number, symbol: string, units: number, type: string) {
    if (type == "Sell")
      units = units * -1;
    this.service.postAsset(portfolioId, symbol, units).subscribe(result => {
      console.log(result);
    })
  }


  deleteTrade(tradeHistoryId: number, pid: number) {
    this.service.deleteTrade(tradeHistoryId, pid).subscribe(result => {
      this.getAllTrades(this.portfolioId);
    }, error => console.log(error))
    this.toggleShowUpdateTrade = false;
  }

  getPnl() {
    let counter = 0;
    let avgBuyPrice = 0;
    let totalUnits = 0;
    let totalAccumulated = 0;
    let totalTradePrice = 0;
    for (let i = 0; i < this.tradeHistory.length; i++) {
      if (i == 0 || i == this.tradeHistory.length - 1 || this.tradeHistory[i].symbol != this.tradeHistory[i - 1].symbol) {
        counter = 1;
        avgBuyPrice = this.tradeHistory[i].price;
        this.tradeHistory[i].averageBuy = avgBuyPrice;
        totalUnits = this.tradeHistory[i].units;
        this.tradeHistory[i].totalUnits = totalUnits;
        totalTradePrice = this.tradeHistory[i].price * this.tradeHistory[i].units;
        this.tradeHistory[i].total = totalTradePrice;
        totalAccumulated = totalTradePrice;
        this.tradeHistory[i].accumulated = totalAccumulated;
      }
      else {
        counter = counter + 1;
        totalTradePrice = this.tradeHistory[i].price * this.tradeHistory[i].units;
        this.tradeHistory[i].total = totalTradePrice;
        if (this.tradeHistory[i].type == "Buy") {
          avgBuyPrice = (avgBuyPrice + this.tradeHistory[i].price) / counter;
          this.tradeHistory[i].averageBuy = avgBuyPrice;
          totalUnits = totalUnits + this.tradeHistory[i].units;
          this.tradeHistory[i].totalUnits = totalUnits;
          totalAccumulated = totalAccumulated + totalTradePrice;
          this.tradeHistory[i].accumulated = totalAccumulated;
        }
        else if (this.tradeHistory[i].type == "Sell") {
          this.tradeHistory[i].pnl = (this.tradeHistory[i].price - avgBuyPrice) * this.tradeHistory[i].units;
          this.tradeHistory[i].averageBuy = avgBuyPrice;
          totalUnits = totalUnits - this.tradeHistory[i].units;
          this.tradeHistory[i].totalUnits = totalUnits;
          totalAccumulated = totalAccumulated - totalTradePrice;
          this.tradeHistory[i].accumulated = totalAccumulated;
        }
      }
    }
  }

}
