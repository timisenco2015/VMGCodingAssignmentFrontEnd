import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import {TemperatureService} from "./service/temperatureService";
import {ApiService} from "./service/apiService";
import { AppRoutingModule } from './app-routing.module';
import { TemperatureComponent } from './temperatureComponent/temperature.component';
// Import angular-fusioncharts
import { FusionChartsModule } from "angular-fusioncharts";
import { APP_CONFIG, AppConfig } from './app.config';
import { HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';
// Import FusionCharts library and chart modules
import * as FusionCharts from "fusioncharts";
import * as Widgets from "fusioncharts/fusioncharts.widgets";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { environment } from '../environments/environment';

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, Widgets, FusionTheme);



@NgModule({
  declarations: [
    TemperatureComponent
  ],
  imports: [
    BrowserModule,
    FusionChartsModule,
    ChartsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule.forRoot()
    
  ],
  providers: [
    { provide: APP_CONFIG, useValue: AppConfig },TemperatureService,ApiService, { provide: NG_ENTITY_SERVICE_CONFIG, useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' }}],
  bootstrap: [TemperatureComponent]
})
export class AppModule { }
