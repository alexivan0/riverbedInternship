import { Component, OnInit } from '@angular/core';
// import { Chart } from 'node_modules/chart.js';
import { registerables, Chart } from 'chart.js';
import { AppDataService, IAsset, ITradeHistory } from '../services/app-data.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { firstValueFrom, last, map, Observable, Subscription, switchMap, take } from 'rxjs';




@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {

  portfolioId: number = this.service.portfolioId;
  assetList!: IAsset[];
  tradesArray!: ITradeHistory[];
  groupedTrades!: any;
  unixtime!: number;
  assetListCount: number[] = [];
  assetListSymbols: string[] = [];
  subscription!: Subscription
  objectTradeKeys: string[] = []




  constructor(private service: AppDataService) { }

  ngOnInit(): void {
    this.getTrades();
    Chart.register(ChartDataLabels, ...registerables);
    this.subscription = this.service.sharedArray$.subscribe(result => {
      // if (result != null) {
      if (this.assetList == null) {
        result.sort((a, b) => a.symbol.localeCompare(b.symbol))
        this.assetList = result
        this.createCharts();
      }
      else {
        this.subscription.unsubscribe();
      }
      // }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }


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
          responsive: true,
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
          responsive: true,
          plugins: {
            datalabels: {
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.config.data.datasets[0].data;
                let dataLabels = ctx.chart.config.data.labels
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



  getTrades() {
    this.service.getAllTradesDto(this.portfolioId).subscribe((result: any) => {
      this.tradesArray = result;
      this.createDynamicCharts();
    })
  }

  createDynamicCharts() {
    // take the tradesArray and convert it into an object of key[symbol] = value[array of trade objects]
    let result = this.tradesArray.reduce(function (r, a) {
      r[a.symbol] = r[a.symbol] || [];
      r[a.symbol].push(a);
      return r;
    }, Object.create(null));
    this.groupedTrades = result;
    console.log(this.groupedTrades, 'grouped trades')


    // sort groupTrades by date ascending
    Object.entries(this.groupedTrades).forEach((element: any) => {
      element[1].sort(function (a, b) {
        return new Date(a.createdDate).valueOf() - new Date(b.createdDate).valueOf();
      });
    })


    // get the keys for every symbol in the object
    this.objectTradeKeys = Object.keys(this.groupedTrades)
    // console.log(this.objectTradeKeys, 'object trade keys')

    // iterate over every entry in the groupTrades object
    Object.entries(this.groupedTrades).forEach((element: any) => {
      console.log(element, "enties element")

      // store the name of the current symbol in assetSymbol
      let assetSymbol = element[0]

      // convert the first trade date to unix time and store it in startTime
      let startTime = this.service.getUnixTime(element[1][0].createdDate)

      let pricesArray: number[] = []
      let assetPricesArray: number[] = []
      let datesArray: string[] = []

      // create an object of key[unixtime] = value[totalUnits]
      let symbolsTotalUnitsDto: { [key: number]: number } = {}



      //populate the symbolsTotalUnitsDto object
      element[1].forEach(element => {
        symbolsTotalUnitsDto[this.service.getUnixTime(element.createdDate)] = element.totalUnits;
      })
      console.log(symbolsTotalUnitsDto, 'symbols units dto')

      // create a get request for every symbol on 1day timeframe and starting from startTime date
      this.service.getAssetKlines(assetSymbol, "1d", startTime).subscribe((result: any) => {
        let lastTotal = 0
        //for every symbol, iterate over every day data
        result.forEach(day => {
          //convert the current day date to unix time and store it into the datesArray
          datesArray.push(this.fromUnixToDate(day[0]))
          //check if the current day date matches the first date in the datesArray (comparing both in unix time)
          if (day[0] == +Object.keys(symbolsTotalUnitsDto)[0]) {
            //store the last total(of asset units) in lastTotal
            lastTotal = Object.entries(symbolsTotalUnitsDto)[0][1]
            //delete the first entry from the object since we already matched it
            delete symbolsTotalUnitsDto[Object.keys(symbolsTotalUnitsDto)[0]];
          }
          // push to pricesArray the current day price * lastTotal to get the total units held price for that day
          // for the next day iteration, if the asset totalUnits didn't change(by buying or selling them), totalUnits for the next day remains the same
          pricesArray.push((day[1] % 1000000) * lastTotal)
          // push to assetPricesArray the current day price
          assetPricesArray.push(day[1] % 1000000)
        });
        // create a chart with the below parameters
        this.createTradeCharts(assetSymbol, pricesArray, assetPricesArray, datesArray)
      })
    });
  }


  fromUnixToDate(unixDate) {
    //add 24hours to unix date
    let date = new Date(unixDate);

    var day = date.getUTCDate();
    var month = date.getUTCMonth() + 1; //months from 1-12

    var formatedDate = (`${day}/${month}`)

    return formatedDate
  }


  createTradeCharts(asset, pricesArray, assetPricesArray, datesArray) {
    const pieChartValue = new Chart(`${asset}`, {
      type: 'line',
      data: {
        labels: datesArray,
        datasets: [{
          label: 'Total $ Invested',
          data: pricesArray,
        },
        {
          label: 'Asset $ Price',
          data: assetPricesArray,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            display: false
          }
        },
        scales: {
          y: {
            type: 'logarithmic',
          }
        }
      },
    });
  }

}







// tehnologii folosite:
// Angular Material, Angular Forms, Bootstrap, nG Bootstrap, rxJs, chartJs, Auth0 jwt.