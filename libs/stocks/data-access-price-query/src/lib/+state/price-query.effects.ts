import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { DataPersistence } from '@nrwl/nx';
import { map, filter, concatMap, toArray } from 'rxjs/operators';
import {
  FetchPriceQuery,
  PriceQueryActionTypes,
  PriceQueryFetched,
  PriceQueryFetchError,
  FetchPriceQueryForDateRange
} from './price-query.actions';
import { PriceQueryPartialState } from './price-query.reducer';
import { PriceQueryResponse } from './price-query.type';
import { from } from 'rxjs';
import { IexService } from '../../services/iex.service';

@Injectable()
export class PriceQueryEffects {
  @Effect() loadPriceQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQuery,
    {
      run: (action: FetchPriceQuery, state: PriceQueryPartialState) => {
        return this.iexService.fetchPriceQuery(action.symbol, action.period)
          .pipe(
            map(resp => new PriceQueryFetched(resp as PriceQueryResponse[]))
          );
      },

      onError: (action: FetchPriceQuery, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  @Effect() loadPriceForDateRangeQuery$ = this.dataPersistence.fetch(
    PriceQueryActionTypes.FetchPriceQueryForDateRange,
    {
      run: (action: FetchPriceQueryForDateRange, state: PriceQueryPartialState) => {
        return this.iexService.fetchPriceQuery(action.symbol, 'max')
          .pipe(
            concatMap((priceQueryResponses: PriceQueryResponse[]) => from(priceQueryResponses)),
            filter((priceQueryResponse: PriceQueryResponse) => {
              console.log(priceQueryResponse);
              const date = new Date(priceQueryResponse.date);
              return action.startDate <= date && action.endDate >= date;
            }),
            toArray(),
            map((filteredResponse: PriceQueryResponse[]) => new PriceQueryFetched(filteredResponse))
          );
      },

      onError: (action: FetchPriceQueryForDateRange, error) => {
        return new PriceQueryFetchError(error);
      }
    }
  );

  constructor(
    private dataPersistence: DataPersistence<PriceQueryPartialState>,
    private iexService: IexService
  ) {}
}
