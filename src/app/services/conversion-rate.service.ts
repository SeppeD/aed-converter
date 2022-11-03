import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class ConversionRateService {
  private defaultRate: number = 0.275;
  private storeKey: string = 'conversionRate';

  private _conversionRate$ = new ReplaySubject<number>(1);

  constructor() {
    this.initConversionRate();
  }

  public getConversionRate$(): Observable<number> {
    return this._conversionRate$.asObservable();
  }

  public initConversionRate(): void {
    const rate = localStorage.getItem(this.storeKey);
    if (!rate) {
      this.setConversionRate();
      return;
    }

    const rateConversion = parseFloat(rate);
    if (isNaN(rateConversion)) {
      this.setConversionRate();
      return;
    }

    this._conversionRate$.next(rateConversion);
  }

  public setConversionRate(rate: number = this.defaultRate): void {
    if (isNaN(rate)) return;

    localStorage.setItem(this.storeKey, String(rate));
    this._conversionRate$.next(rate);
  }
}
