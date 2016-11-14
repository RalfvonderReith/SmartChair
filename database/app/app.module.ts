import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { PressureComponent }   from './pressure.component';
import { TemperatureComponent }   from './temperature.component';
import { LineChartComponent } from './charts/linechart.component';

@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ AppComponent, PressureComponent, TemperatureComponent, LineChartComponent ],
    bootstrap:    [ AppComponent, PressureComponent, TemperatureComponent, LineChartComponent ]
})
export class AppModule { }