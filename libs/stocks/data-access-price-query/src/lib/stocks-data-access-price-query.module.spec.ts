import { async, TestBed, inject } from '@angular/core/testing';
import { StocksDataAccessPriceQueryModule } from './stocks-data-access-price-query.module';
import { hot, cold } from 'jasmine-marbles';
import { PriceQueryResponse } from './+state/price-query.type';
import { FetchPriceQueryForDateRange, PriceQueryFetched } from './+state/price-query.actions';
import { PriceQueryEffects } from './+state/price-query.effects';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IexService } from '../services/iex.service';



describe('StocksDataAccessPriceQueryModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StocksDataAccessPriceQueryModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(StocksDataAccessPriceQueryModule).toBeDefined();
  });
});


describe('FetchPriceQueryForDateRangeEffect', () => {
  const stockQuotes: PriceQueryResponse[] = [
    {
       "date":"2020-03-20",
       "open":256.01,
       "close":231.27,
       "high":262.72,
       "low":235,
       "volume":102357473,
       "uOpen":250.18,
       "uClose":232.75,
       "uHigh":257.03,
       "uLow":232,
       "uVolume":103036840,
       "change":-15.56,
       "changePercent":-6.4902,
       "label":"Mar 20, 20",
       "changeOverTime":0.200374
    },
    {
       "date":"2020-03-23",
       "open":236.83,
       "close":234.38,
       "high":235.2,
       "low":217.67,
       "volume":85001638,
       "uOpen":237.03,
       "uClose":229.7,
       "uHigh":234.6,
       "uLow":214.62,
       "uVolume":87427563,
       "change":-5.09,
       "changePercent":-2.1691,
       "label":"Mar 23, 20",
       "changeOverTime":0.179326
    },
    {
       "date":"2020-03-24",
       "open":242.92,
       "close":257.83,
       "high":251.85,
       "low":241.5,
       "volume":74734521,
       "uOpen":237.99,
       "uClose":250.79,
       "uHigh":257.06,
       "uLow":236.5,
       "uVolume":72419798,
       "change":23.01,
       "changePercent":10.4673,
       "label":"Mar 24, 20",
       "changeOverTime":0.301987
    },
    {
       "date":"2020-03-25",
       "open":263.07,
       "close":246.45,
       "high":264.67,
       "low":252.7,
       "volume":79591712,
       "uOpen":259.79,
       "uClose":254.47,
       "uHigh":261.68,
       "uLow":249.9,
       "uVolume":77673019,
       "change":-1.43,
       "changePercent":-0.5519,
       "label":"Mar 25, 20",
       "changeOverTime":0.293868
    },
    {
       "date":"2020-03-26",
       "open":248.68,
       "close":268.13,
       "high":261.4,
       "low":256.16,
       "volume":64096571,
       "uOpen":257.42,
       "uClose":265.2,
       "uHigh":265.88,
       "uLow":257.51,
       "uVolume":65571835,
       "change":13.5,
       "changePercent":5.4373,
       "label":"Mar 26, 20",
       "changeOverTime":0.36366
    },
    {
       "date":"2020-03-27",
       "open":264.69,
       "close":257.9,
       "high":263.39,
       "low":248.1,
       "volume":51559545,
       "uOpen":256.57,
       "uClose":251.8,
       "uHigh":259.58,
       "uLow":249.6,
       "uVolume":51182915,
       "change":-10.8,
       "changePercent":-4.217,
       "label":"Mar 27, 20",
       "changeOverTime":0.3077
    },
    {
       "date":"2020-03-30",
       "open":255.69,
       "close":261.45,
       "high":264.14,
       "low":256.1,
       "volume":43860084,
       "uOpen":251.85,
       "uClose":263.59,
       "uHigh":261.8,
       "uLow":252.5,
       "uVolume":42348403,
       "change":7.32,
       "changePercent":2.854,
       "label":"Mar 30, 20",
       "changeOverTime":0.34422
    },
    {
       "date":"2020-03-31",
       "open":264.1,
       "close":264.71,
       "high":274.25,
       "low":261,
       "volume":50183466,
       "uOpen":264.5,
       "uClose":261.64,
       "uHigh":265.33,
       "uLow":263,
       "uVolume":50391885,
       "change":-0.55,
       "changePercent":-0.2103,
       "label":"Mar 31, 20",
       "changeOverTime":0.33332
    }
  ];
  const filteredStockQuotes: PriceQueryResponse[] = [
     {
        "date":"2020-03-23",
        "open":236.83,
        "close":234.38,
        "high":235.2,
        "low":217.67,
        "volume":85001638,
        "uOpen":237.03,
        "uClose":229.7,
        "uHigh":234.6,
        "uLow":214.62,
        "uVolume":87427563,
        "change":-5.09,
        "changePercent":-2.1691,
        "label":"Mar 23, 20",
        "changeOverTime":0.179326
     },
     {
        "date":"2020-03-24",
        "open":242.92,
        "close":257.83,
        "high":251.85,
        "low":241.5,
        "volume":74734521,
        "uOpen":237.99,
        "uClose":250.79,
        "uHigh":257.06,
        "uLow":236.5,
        "uVolume":72419798,
        "change":23.01,
        "changePercent":10.4673,
        "label":"Mar 24, 20",
        "changeOverTime":0.301987
     },
     {
        "date":"2020-03-25",
        "open":263.07,
        "close":246.45,
        "high":264.67,
        "low":252.7,
        "volume":79591712,
        "uOpen":259.79,
        "uClose":254.47,
        "uHigh":261.68,
        "uLow":249.9,
        "uVolume":77673019,
        "change":-1.43,
        "changePercent":-0.5519,
        "label":"Mar 25, 20",
        "changeOverTime":0.293868
     },
     {
        "date":"2020-03-26",
        "open":248.68,
        "close":268.13,
        "high":261.4,
        "low":256.16,
        "volume":64096571,
        "uOpen":257.42,
        "uClose":265.2,
        "uHigh":265.88,
        "uLow":257.51,
        "uVolume":65571835,
        "change":13.5,
        "changePercent":5.4373,
        "label":"Mar 26, 20",
        "changeOverTime":0.36366
     },
     {
        "date":"2020-03-27",
        "open":264.69,
        "close":257.9,
        "high":263.39,
        "low":248.1,
        "volume":51559545,
        "uOpen":256.57,
        "uClose":251.8,
        "uHigh":259.58,
        "uLow":249.6,
        "uVolume":51182915,
        "change":-10.8,
        "changePercent":-4.217,
        "label":"Mar 27, 20",
        "changeOverTime":0.3077
     }
  ];
  
  let iexService: IexService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        PriceQueryEffects,
        {
          provide: IexService,
          useValue: {
            fetchPriceQuery: jest.fn(() => stockQuotes)
          }
        }
      ]
    });
    iexService = TestBed.get(IexService);
  });

  it('should return a filtered array of stock quotes', () => {
    const action = new FetchPriceQueryForDateRange('AAPL', new Date('2020-03-23'), new Date('2020-03-27'));
    const outcome = new PriceQueryFetched(filteredStockQuotes);

    console.log(iexService.fetchPriceQuery(null, null));
  });
});