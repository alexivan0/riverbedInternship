import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { Observable } from 'rxjs';
import { MarketDataService } from 'src/services/market-data.service';


@Component({
  selector: 'app-market-data',
  templateUrl: './market-data.component.html',
  styleUrls: ['./market-data.component.css']
})
export class MarketDataComponent implements OnInit {

  quoteList! : string[];
  filteredQuotes!: string[];;
  

  formGroup!: FormGroup;
  constructor( private service: MarketDataService, private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.initForm();
    this.getQuotes();
  }

  initForm() {
    this.formGroup = this.fb.group({
      'symbol': ['']
    })
    this.formGroup.get('symbol')?.valueChanges.subscribe(response => {
      this.filterdata(response);
    })
  }

  filterdata(enteredData: any){
    this.filteredQuotes = this.quoteList.filter(quote => {
      return quote.toLocaleLowerCase().indexOf(enteredData.toLocaleLowerCase()) > -1
    })
  }

  getQuotes(){
    this.service.getQuotes().subscribe(response => {
      this.quoteList = response;
      this.quoteList = this.quoteList.filter(array => array.includes('USDT'))
      this.quoteList.forEach((element,index) => {
        this.quoteList[index] = element.substring(0,element.length -4);
      });
      this.filteredQuotes = this.quoteList;
    })
  }
}