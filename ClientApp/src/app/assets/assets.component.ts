import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAsset, AppDataService } from 'src/app/services/app-data.service';


@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.css']
})
export class AssetsComponent implements OnInit {

  symbolList!: string[];
  filteredSymbols!: string[];
  assetList!: IAsset[];
  portfolioId: number = this.service.portfolioId;
  toggleShowUpdateAsset: boolean = false;
  updatedAsset: IAsset = {
    portfolioId: -1,
    assetId: -1,
    units: -1,
    symbol: '',
    livePrice: -1,
    liveTotal: -1
  }
  livePricesUrl!: string;
  totalBalance!: number;

  formGroup!: FormGroup;


  constructor(private service: AppDataService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getSymbols();
    this.getAllAssets(this.portfolioId);
    // this.getAssetsPrice();
  }



  ngAfterViewInit() {
    // this.getAssetListPrices()
    // this.getAssetsPrice();
    // setInterval(() => this.getAssetsPrice(), 5000)

  }

  ngOnChanges() {
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

  getAllAssets(pid) {
    this.service.getAllAssets(pid).subscribe(result => {
      result.sort((a, b) => a.symbol.localeCompare(b.symbol))
      this.assetList = result;
      this.getAssetListPricesUrl();
      console.log(this.assetList);
    }, error => console.log(error));
  }


  postAsset(portfolioId: number, symbol: string, units: number) {
    this.service.postAsset(portfolioId, symbol, units).subscribe(result => {
      this.getAllAssets(this.portfolioId)
    }, error => console.error(error));
  }

  toggleUpdateAsset(portfolioId: number, assetId: number, units: number, symbol: string) {
    this.toggleShowUpdateAsset = true;
    this.updatedAsset.portfolioId = portfolioId;
    this.updatedAsset.assetId = assetId;
    this.updatedAsset.units = units;
    this.updatedAsset.symbol = symbol;
  }

  updateAsset(portfolioId: number, assetId: number, symbol: string, units: number) {
    this.service.updateAsset(portfolioId, assetId, symbol, units).subscribe(result => {
      this.getAllAssets(this.portfolioId);
    }, error => console.log(error));
    this.toggleShowUpdateAsset = false;
  }

  deleteAsset(portfolioId: number, assetId: number) {
    this.service.deleteAsset(portfolioId, assetId).subscribe(result => {
      this.getAllAssets(this.portfolioId);
    }, error => console.log(error))
    this.toggleShowUpdateAsset = false;
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


  async getAssetsPrice() {
    while (true) {
      this.service.getAssetsPrice(this.livePricesUrl).subscribe(result => {
        result.forEach((element, index) => {
          result[index].symbol = element.symbol.substring(0, element.symbol.length - 4);
        });
        result.sort((a, b) => a.symbol.localeCompare(b.symbol));
        for (let i = 0; i < this.assetList.length; i++) {
          this.assetList[i].livePrice = result[i].price;
          this.assetList[i].liveTotal = this.assetList[i].units * this.assetList[i].livePrice; 
        }
        this.calculateTotal();
        // this.assetList.forEach(assetElement => {
        //   result.forEach(resultElement => {
        //     if (assetElement.symbol == resultElement.symbol) {
        //       assetElement.livePrice = resultElement.price;
        //       return;
        //     }
        //   });
        // });
      })
      await this.delay(5000)
    }
  }

  calculateTotal() {
    this.totalBalance = 0;
    this.assetList.forEach(element => {
      this.totalBalance = Number(this.totalBalance) + Number(element.liveTotal);
    });
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }


}
