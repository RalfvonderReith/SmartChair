import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PressureComponent }   from './pressure.component';
import { TemperatureComponent }   from './temperature.component';
import { LineChartComponent } from './charts/linechart.component';

@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ PressureComponent, TemperatureComponent, LineChartComponent ],
    bootstrap:    [ PressureComponent, TemperatureComponent, LineChartComponent ]
})
export class AppModule { }