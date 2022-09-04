import { Component, OnInit } from '@angular/core';
// import { Chart } from 'node_modules/chart.js';
import { registerables, Chart } from 'chart.js';
import { AppDataService, IAsset, ITradeHistory } from '../services/app-data.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { firstValueFrom, map, Observable, Subscription, switchMap, take } from 'rxjs';




@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {

  portfolioId: number = this.service.portfolioId;
  assetList!: IAsset[];
  // assetListUnitsCount: number[] = [];
  // assetListUnitsSymbols: string[] = [];
  // assetListValueCount: number[] = [];
  // assetListValueSymbols: string[] = [];
  // colors: any = [];
  tradesArray!: ITradeHistory[];
  groupedTrades
  unixtime!: number;
  assetListCount: number[] = [];
  assetListSymbols: string[] = [];
  subscription!: Subscription





  constructor(private service: AppDataService) { }

  ngOnInit(): void {
    this.getTrades();
    Chart.register(ChartDataLabels, ...registerables);
    // this.subscription = this.service.sharedArray$.subscribe(result => {
    //   this.assetList = result
    //   console.log("analytics behavior subject")
    // })
    this.subscription = this.service.sharedArray$.subscribe(result => {
      if (this.assetList == null) {
        this.assetList = result
        this.createCharts();
      }
      else {
        this.subscription.unsubscribe();
        console.log('unsubscribed')
      }
    })
    // this.service.sharedArray$.subscribe(result => {
    //   this.createCharts();
    // }).unsubscribe()


    // this.subscription = this.getBehaviorSubject().subscribe(result => {
    //   this.createCharts();
    // })
    // this.subscription.unsubscribe();
    // this.service.sharedArray$.pipe(map(result => this.assetList = result)).subscribe(result => this.createCharts()).unsubscribe();
    // this.getBehaviorSubject().then(result => {
    //   this.createCharts();
    // })
    // this.getBehaviorSubject()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  // async getBehaviorSubject() {
  //   this.assetList = await firstValueFrom(this.service.sharedArray$)
  //   console.log(this.assetList, "behavior subject")
  // }


  createCharts() {
    this.createUnitsChart();
    this.createValueChart();
  }


  createUnitsChart() {
    if (this.assetList != null) {
      this.assetListCount = []
      this.assetListSymbols = []

      this.assetList.sort((a, b) => a.units.toString().localeCompare((b.units).toString()));
      if (this.assetList.length >= 7) {
        for (let i = this.assetList.length - 1; i > this.assetList.length - 7; i--) {
          this.assetListCount.push(this.assetList[i].units)
          this.assetListSymbols.push(this.assetList[i].symbol)
        }
        let count = 0
        for (let i = this.assetList.length - 7; i >= 0; i--) {
          count = count + this.assetList[i].units;
        }
        this.assetListCount.push(count)
        this.assetListSymbols.push("Other")
      }
      else {
        this.assetList.forEach(element => {
          this.assetListCount.push(element.units)
          this.assetListSymbols.push(element.symbol)
        });
      }

      const pieChartUnits = new Chart("pieChartUnits", {
        type: 'bar',
        data: {
          labels: this.assetListSymbols,
          datasets: [{
            label: 'Units',
            data: this.assetListCount,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }

  createValueChart() {
    if (this.assetList != null) {
      this.assetListCount = []
      this.assetListSymbols = []

      this.assetList.sort((a, b) => a.liveTotal.toString().localeCompare((b.liveTotal).toString()));
      if (this.assetList.length >= 7) {
        for (let i = this.assetList.length - 1; i > this.assetList.length - 7; i--) {
          this.assetListCount.push(this.assetList[i].liveTotal)
          this.assetListSymbols.push(this.assetList[i].symbol)
        }
        let count = 0
        for (let i = this.assetList.length - 7; i >= 0; i--) {
          count = count + this.assetList[i].liveTotal;
        }
        this.assetListCount.push(count)
        this.assetListSymbols.push("Other")
      }
      else {
        this.assetList.forEach(element => {
          this.assetListCount.push(element.liveTotal)
          this.assetListSymbols.push(element.symbol)
        });
      }

      const pieChartValue = new Chart("pieChartValue", {
        type: 'pie',
        data: {
          labels: this.assetListSymbols,
          datasets: [{
            label: 'Price',
            data: this.assetListCount,
            // backgroundColor: this.colors,
            hoverOffset: 4
          }]
        },
        options: {
          plugins: {
            datalabels: {
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.config.data.datasets[0].data;
                let dataLabels = ctx.chart.config.data.labels
                // console.log(dataLabels)
                // console.log(dataLabels![dataArr.indexOf(value)])
                dataArr.map((data: any) => {
                  sum += data;
                });
                let percentage = (value * 100 / sum).toFixed(2) + "%";
                let display = [dataLabels![dataArr.indexOf(value)], percentage]
                return display;
              },
              // color: '#fff',
            },
            legend: {
              display: false
            }
          }
        },
      });
    }
  }


  //TODO : put dates(average?) on portfolio assets?
  getUnixTime(tradeDate) {
    const formatYmd = date => date.toISOString().slice(0, 10);
    const formatDate = formatYmd(new Date(tradeDate));
    console.log(formatDate)
    const unixTime = Math.floor(new Date(formatDate).getTime())
    // const formatDate = formatYmd(tradeDate);
    // const unixTime = Math.floor(new Date(formatDate).getTime())
    console.log(unixTime);
    return unixTime;
  }

  getTrades() {
    this.service.getAllTrades(this.portfolioId).subscribe(result => {
      this.tradesArray = result;
      console.log(this.tradesArray)
      this.groupTradesBySymbol();
    })
  }

  groupTradesBySymbol() {
    let result = this.tradesArray.reduce(function (r, a) {
      r[a.symbol] = r[a.symbol] || [];
      r[a.symbol].push(a);
      return r;
    }, Object.create(null));

    this.groupedTrades = result;
    console.log(this.groupedTrades)
    console.log(this.groupedTrades.ADA[0].createdDate);
    var tradeTime = this.groupedTrades.ADA[0].createdDate;
    // var newTradeTime = oldTradeTime.substring(0, oldTradeTime.length - 9);
    console.log(tradeTime);

    this.unixtime = this.getUnixTime(tradeTime);
  }

  // Ideea
  // [ADA][Trade 01][ShowGraph]



  // getRandomColor() {
  //   for (let i = 0; i < this.assetList.length; i++) {
  //     this.colors.push('#' + Math.floor(Math.random() * 16777215).toString(16));
  //   }
  // }

}
