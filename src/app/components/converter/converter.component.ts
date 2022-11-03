import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, mergeMap, Observable, take } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ExchangeRateDialogComponent } from '../exchange-rate-dialog/exchange-rate-dialog.component';
import { ConversionRateService } from '../../services/conversion-rate.service';

@Component({
  selector: 'app-converter',
  template: `
      <div class="conversion-container">
          <fieldset>
              <legend>AED</legend>
              <p class="currency ">{{ (aed$ | async) }}</p>
          </fieldset>

          <fieldset>
              <legend>EURO</legend>
              <p class="currency currency-converted">
                  {{ euro$ | async | currency:'EUR':'symbol':'1.0-2' }}
              </p>
          </fieldset>

          <div class="calculator">

              <button mat-flat-button type="button" class="settings" (click)="changeExchangeRate()">
                  <mat-icon>settings</mat-icon>
              </button>
              <button mat-flat-button type="button" class="clear" (click)="clearValue()">AC</button>
              <button mat-flat-button type="button" class="backspace" (click)="clearLastValue()">
                  <mat-icon>backspace</mat-icon>
              </button>

              <button mat-flat-button type="button" (click)="addValue(7)">7</button>
              <button mat-flat-button type="button" (click)="addValue(8)">8</button>
              <button mat-flat-button type="button" (click)="addValue(9)">9</button>
              <button mat-flat-button type="button" class="operator" (click)="addValue('/')">&divide;</button>


              <button mat-flat-button type="button" (click)="addValue(4)">4</button>
              <button mat-flat-button type="button" (click)="addValue(5)">5</button>
              <button mat-flat-button type="button" (click)="addValue(6)">6</button>
              <button mat-flat-button type="button" class="operator" (click)="addValue('&times')">&times;</button>


              <button mat-flat-button type="button" (click)="addValue(1)">1</button>
              <button mat-flat-button type="button" (click)="addValue(2)">2</button>
              <button mat-flat-button type="button" (click)="addValue(3)">3</button>
              <button mat-flat-button type="button" class="operator" (click)="addValue('-')">-</button>


              <button mat-flat-button type="button" (click)="addValue('.')">.</button>
              <button mat-flat-button type="button" class="zero" (click)="addValue(0)">0</button>
              <button mat-flat-button type="button" class="operator" (click)="addValue('+')">+</button>
          </div>
      </div>
  `,
  styleUrls: [ './converter.component.scss' ]
})
export class ConverterComponent implements OnInit {
  private _aed$ = new BehaviorSubject<string>('100');
  public aed$: Observable<string>;
  public euro$: Observable<number>;

  constructor(
    private dialog: MatDialog,
    private conversionRateService: ConversionRateService
  ) {
    this.conversionRateService.getConversionRate$();

    this.aed$ = this._aed$.asObservable()
      .pipe(
        map(val => val === '' ? '0' : val)
      );

    this.euro$ =
      combineLatest([
        this.aed$,
        this.conversionRateService.getConversionRate$()
      ])
        .pipe(
          filter(([ aed ]) => {
            try {
              const evaluation = eval(aed);
              return evaluation || evaluation === 0;
            } catch (err) {
              console.log(err);
              return false;
            }
          }),
          map(([ aed, rate ]) => (eval(aed) ?? 0) * rate)
        );
  }

  ngOnInit(): void {
  }

  public clearValue(): void {
    this._aed$.next('');
  }

  public addValue($event: string | number): void {
    this._aed$.next(this._aed$.getValue() + `${$event}`);
  }

  public clearLastValue(): void {
    const currentValue = this._aed$.getValue();
    if (currentValue !== '0' && !!currentValue) {
      this._aed$.next(currentValue?.slice(0, -1));
    }
  }

  public changeExchangeRate(): void {
    this.conversionRateService.getConversionRate$()
      .pipe(
        take(1),
        mergeMap(exchangeRate => {
          const dialogRef = this.dialog.open(ExchangeRateDialogComponent, {
            width: '250px',
            data: { exchangeRate }
          });

          return dialogRef.afterClosed()
        })
      )
      .subscribe(result => {
        if (!!result) {
          this.conversionRateService.setConversionRate(result);
        }
      });
  }
}
