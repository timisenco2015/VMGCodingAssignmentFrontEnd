import { Component,ViewChild,ChangeDetectorRef,NgZone } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import {TemperatureService} from "../service/temperatureService";
import { BaseChartDirective } from 'ng2-charts'
import {Observable,Subject,} from 'rxjs';
import { debounceTime} from 'rxjs/operators'; 


@Component({
  selector: 'app-root',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css'],

})


export class TemperatureComponent 
{
  celsiusTextChanged: Subject<string> = new Subject<string>();
  fahrenheitTextChanged: Subject<string> = new Subject<string>();
  title = 'VMGCodingAssignment';
  source$: Observable<Event>;
  fahrenheitGraphDataSource=[];
  celsiusGrphValueDataSource=[];
  temperatureTableDataSource=[];
  temperatureList=[];
  celsiusTempValue:any=0;
  fahrenheitTempValue:any=32;
  celsiusValue:any=0;
  fahrenheitValue:any=32;
  events:Object;
  width = 600;
  height = 400;
  type = "thermometer";
  dataFormat = "json";
  
// data source for fusionchart temperature guage for fahrenheit
  fahrenheitDataSource = 
  {
    "chart": 
    {
      caption: "Temperature",
      subcaption: "(Celsius)",
      lowerlimit: "120",
      upperlimit: "200",
      numbersuffix: "°F",
      thmfillcolor: "#FF0000",
      showgaugeborder: "1",
      gaugebordercolor: "#FF0000",
      gaugeborderthickness: "2",
      plottooltext: "Temperature: <b>$datavalue</b> ",
      theme: "fusion",
      showvalue: "1"
    },
    "event":
    {

    },
    value: "32"
  };

  //data source for fusionchart temperature guage for celsius
  celsuisDataSource = 
  {
    "chart": 
    {
      caption: "Temperature",
      subcaption: "(Celsius)",
      lowerlimit: "120",
      upperlimit: "200",
      numbersuffix: "°C",
      thmfillcolor: "#008ee4",
      showgaugeborder: "1",
      gaugebordercolor: "#008ee4",
      gaugeborderthickness: "2",
      plottooltext: "Temperature: <b>$datavalue</b> ",
      theme: "fusion",
      showvalue: "1"
    },
    "event":
    {

    },
    value: "0"
  };



  // variables declaration for the chartjs linear graph
  lineChartData: ChartDataSets[];
  lineChartLabels: Label[];
  lineChartColors: Color[];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';
  lineChartOptions = 
  {
      responsive: true,
  };

  @ViewChild(BaseChartDirective,{static: false}) chart: BaseChartDirective;
  _cd: ChangeDetectorRef;

  constructor(private temperatureService:TemperatureService)
  {
    
   
    this.getTemperatureList();
    this.populateLiearGrapghWithDataSource();
    
   
  }

  
  ngOnInit() 
  {
   
    // listening to celsius input field. Once users stop typing it will call the function that convert
    // celsius to fahrenheit
     this.celsiusTempValue= this.celsiusTextChanged.pipe(debounceTime(1000)).subscribe(response=>
      {
        if(Number.isInteger(Number(response)))
        {
          this.getConvertedCelsiusToFahrenheit(parseInt(response));
        }
      });
   
       // listening to fahrenheit input field. Once users stop typing it will call the function that convert
      // fahrenheit to celsius
     this.fahrenheitTempValue= this.fahrenheitTextChanged.pipe(debounceTime(1000)).subscribe(response=>
      {
        if(Number.isInteger(Number(response)))
        {
          this.getConvertedFahrenheitToCelsius(parseInt(response));
        }
      });
     
   
  }
  

  getTemperatureList()
  {
    
    this.temperatureService.getTemperatureList().subscribe(temperatureList => 
    {
      this.temperatureTableDataSource=[];
      this.temperatureList=temperatureList;
      for (let temperature of this.temperatureList) 
      {
        
          this.celsiusGrphValueDataSource.push(temperature.celsius);
          this.fahrenheitGraphDataSource.push(temperature.fahrenheit);
        
          this.temperatureTableDataSource.push({"celsuis":temperature.celsius,"fahrenheit":temperature.fahrenheit});
      }
    
      this.chart.chart.update();
    
    });
  }


  // this method is used to draw linear line chart for both celsius and fahrenheit
  populateLiearGrapghWithDataSource()
  {
    this.lineChartData = 
    [
      { data: this.celsiusGrphValueDataSource, label: 'T[F]',fill: false, pointStyle:'rectRounded'},

      { data: this.fahrenheitGraphDataSource, label: 'T[C]',fill: false,pointStyle:'rectRounded'} 
    ];
  
    this.lineChartLabels = ['1', '2', '3', '4', '5', '6','7','8','9','10'];
  }


  //get celsius value from input field
  celsiusInput(event)
  {
    this.celsiusTextChanged.next(event.target.value);
  
 
   
  }

  // get converted temperature in *F from the database using service class
  getConvertedCelsiusToFahrenheit(temp:number)
  {
    this.celsiusValue=temp;
    console.log(this.celsiusValue);
      
      this.temperatureService.postTemperatureValue({
        "convertionType":"Fahrenheit",
        "celsiusValue":this.celsiusValue
      }).subscribe(fahrenheitValue => 
      {
        this.fahrenheitValue=fahrenheitValue.fahrenheit;
        this.fahrenheitDataSource.value = fahrenheitValue.fahrenheit;
        this.celsuisDataSource.value=this.celsiusValue;
        this.getTemperatureList();
        this.populateLiearGrapghWithDataSource();
        
      });
     
    
  }

  // get converted temperature in *C from the database using service class
  getConvertedFahrenheitToCelsius(temp:number)
  {
    this.temperatureService.postTemperatureValue({
      "convertionType":"Celsius",
      "fahrenheitValue":this.fahrenheitValue
    }).subscribe(celsiusValue => 
    {
      this.celsiusValue=celsiusValue.celsius;
      this.celsuisDataSource.value = celsiusValue.celsius;
      this.fahrenheitDataSource.value = this.fahrenheitValue;
      this.getTemperatureList();
      this.populateLiearGrapghWithDataSource();
    });
   
  }

  //get fahrenheit value from input text field
  fahrenheitInput(event)
  {
  
    this.fahrenheitTextChanged.next(event.target.value);
     
  }

  
 

}

  
