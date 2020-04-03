import { Injectable, Inject } from '@angular/core';
import { StocksAppConfigToken } from '../../../data-access-app-config/src/lib/stocks-app-data-token.constant';
import { StocksAppConfig } from '../../../data-access-app-config/src/lib/stocks-app-config.type';
import { HttpClient } from '@angular/common/http';
import { PriceQueryResponse } from '../lib/+state/price-query.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IexService {

  constructor(
    @Inject(StocksAppConfigToken) private env: StocksAppConfig,
    private httpClient: HttpClient
  ) { }

  fetchPriceQuery(symbol: string, period: string): Observable<PriceQueryResponse[]> {
    return this.httpClient
      .get<PriceQueryResponse[]>(
        `${this.env.apiURL}/beta/stock/${symbol}/chart/${period}?token=${this.env.apiKey}`
      );
  }
}
