import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAsset, MarketDataService } from 'src/app/services/market-data.service';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  symbolList!: string[];
  filteredSymbols!: string[];
  assetList!: IAsset[];
  public toggleShowUpdateAsset: boolean = false;
  public updatedAsset: IAsset = {
    assetId: 0,
    portfolioId: 0,
    units: 0,
    symbol: ''
  }

  formGroup!: FormGroup;


  constructor(private service: MarketDataService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.getSymbols();
    this.getAllAssets();
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

  getAllAssets() {
    this.service.getAllAssets().subscribe(result => {
      this.assetList = result;
    }, error => console.log(error));
  }

  postAsset(symbol: string, units: number) {
    this.service.postAsset(symbol, units).subscribe(result => {
      this.getAllAssets()
    }, error => console.error(error));
  }

  toggleUpdateAsset(assetId: number, portfolioId: number, units: number, symbol: string)
  {
    this.toggleShowUpdateAsset = true;
    this.updatedAsset.assetId = assetId;
    this.updatedAsset.portfolioId = portfolioId;   
    this.updatedAsset.units = units;
    this.updatedAsset.symbol = symbol;
  }

  updateAsset(assetId: number, portfolioId: number, symbol: string, units: number)
  {
    this.service.updateAsset(assetId, portfolioId, symbol, units).subscribe(result => {
      console.log(result);
      this.getAllAssets();
    }, error => console.log(error));
    this.toggleShowUpdateAsset = false;
  }
}
