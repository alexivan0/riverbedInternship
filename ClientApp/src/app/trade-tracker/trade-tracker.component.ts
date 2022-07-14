import { Component, OnInit } from '@angular/core';
import { ITradeHistory, MarketDataService } from 'src/app/services/market-data.service';

@Component({
  selector: 'app-trade-tracker',
  templateUrl: './trade-tracker.component.html',
  styleUrls: ['./trade-tracker.component.css']
})
export class TradeTrackerComponent implements OnInit {
  
  tradeHistory!: ITradeHistory[];

  constructor(private service: MarketDataService) { }

  ngOnInit(): void {
    this.getAllTrades();
  }

  getAllTrades() {
    this.service.getAllTrades().subscribe(result => {
      this.tradeHistory = result;
    }, error => console.log(error));
  }

}
