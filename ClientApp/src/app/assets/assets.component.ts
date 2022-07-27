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
    symbol: ''
  }

  formGroup!: FormGroup;


  constructor(private service: AppDataService, private fb: FormBuilder) {
   }

  ngOnInit(): void {
    this.initForm();
    this.getSymbols();
    this.getAllAssets(this.portfolioId);
  }



  ngAfterViewInit() {
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
      this.assetList = result;
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


}
