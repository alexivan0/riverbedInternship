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
  updatePortfolio: boolean = true;
  myDate = new Date().toLocaleDateString();
  toggleShowUpdateTrade: boolean = false;
  updatedTrade: ITradeHistory = {
    tradeHistoryId: -1,
    portfolioId: -1,
    symbol: "",
    units: -1,
    price: -1,
    type: "",
    createdDate: ""
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
      console.log(this.tradeHistory);
    }, error => console.log(error));
  }

  postTrade(pid: number, symbol: string, units: number, price: number, type: string, date: string) {
    this.service.postTrade(pid, symbol, units, price, type, date).subscribe(result => {
      this.getAllTrades(this.portfolioId)
    }, error => console.log(error));
  }

  updateTrade(tradeHistoryId: number, pid: number, symbol: string, units: number, price: number, type: string, date: string) {
    this.service.updateTrade(tradeHistoryId , pid, symbol, units, price, type, date).subscribe(result => {
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

}
