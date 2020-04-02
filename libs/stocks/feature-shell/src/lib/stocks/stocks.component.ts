import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  period: string;

  startDate = new FormControl(new Date(), Validators.required);
  endDate = new FormControl(new Date(), Validators.required);

  quotes$ = this.priceQuery.priceQueries$;

  timePeriods = [
    { viewValue: 'All available data', value: 'max' },
    { viewValue: 'Five years', value: '5y' },
    { viewValue: 'Two years', value: '2y' },
    { viewValue: 'One year', value: '1y' },
    { viewValue: 'Year-to-date', value: 'ytd' },
    { viewValue: 'Six months', value: '6m' },
    { viewValue: 'Three months', value: '3m' },
    { viewValue: 'One month', value: '1m' },
    { viewValue: 'Date range', value: 'date-range' },
  ];

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      period: [null, Validators.required]
    });
  }

  ngOnInit() {}

  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, period } = this.stockPickerForm.value;
      if (period === 'date-range') {
        this.priceQuery.fetchQuoteForDateRange(symbol, new Date(this.startDate.value), new Date(this.endDate.value))
      }
      else {
        this.priceQuery.fetchQuote(symbol, period);
      }
    }
  }

  startDateChange(event: Event) {
    if (new Date(this.startDate.value) > new Date()) {
      this.startDate.setValue(new Date());
    }
    if (new Date(this.startDate.value) > new Date(this.endDate.value)) {
      this.endDate.setValue(this.startDate.value);
    }
  }

  endDateChange(event: Event) {
    if (new Date(this.endDate.value) > new Date()) {
      this.endDate.setValue(new Date());
    }
    if (new Date(this.startDate.value) > new Date(this.endDate.value)) {
      this.startDate.setValue(this.endDate.value);
    }
  }
}
