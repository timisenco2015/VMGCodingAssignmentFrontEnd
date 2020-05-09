import { Component,ViewChild,OnDestroy } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts'
import {Observable,Subject,} from 'rxjs';
import {debounceTime, delay} from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { ConvertTemperatureModel,GetTemperatureListModel } from '../ngxs/temperatureconvertion.action';

enum STATUS
{
  refresh='Refresh',
  celsius='Celsius',
  fahrenheit = 'Fahrenheit'
}


@Component({
  selector: 'app-root',
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css'],

})


export class TemperatureComponent implements OnDestroy
{
  celsiusTextChanged: Subject<string> = new Subject<string>();
  fahrenheitTextChanged: Subject<string> = new Subject<string>();
  private onSubject = new Subject<{ key: string, value: any }>();
  title = 'VMGCodingAssignment';
  source: Observable<Event>;
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
  status: string = 'Refresh';
 

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
 

  constructor(private store: Store)
  {
    this.start();
    this.dispatchToGetALLTemperatureList();
    this.populateLiearGrapghWithDataSource();

    //It is an observable and its listening to changes in local storage. Uses the data change to refresh tabs in the same browser
    this.onSubject.subscribe(data=>
    {
       
        this.refreshData(data.value);
    })
   
  }

  ngOnInit() 
  {
     // listening to celsius input field. Once users stop typing it will call the function that convert
      // celsius to fahrenheit 
    this.celsiusTempValue= this.celsiusTextChanged.pipe(debounceTime(1000)).subscribe(response=>
    {
      if(response=="")
      {
        this.celsiusValue = 0;
      }
      else
      {
        if(Number.isInteger(Number(response)))
        {
          this.getConvertedTemperature(parseInt(response));
        }
      }
       
      });
   
       // listening to fahrenheit input field. Once users stop typing it will call the function that convert
      // fahrenheit to celsius
     this.fahrenheitTempValue= this.fahrenheitTextChanged.pipe(debounceTime(1000)).subscribe(response=>
      {
        if(response=="")
        {
          this.fahrenheitValue = 32;
        }
        else
        {
          if(Number.isInteger(Number(response)))
          {
            this.getConvertedTemperature(parseInt(response));
          }
        }
      });
  }
  
  ngOnDestroy() 
  {
    this.celsiusTextChanged.unsubscribe();
    this.fahrenheitTextChanged.unsubscribe();
    this.onSubject.unsubscribe();
    this.fahrenheitGraphDataSource=[];
    this.celsiusGrphValueDataSource=[];
    this.temperatureTableDataSource=[];
    this.temperatureList=[];
    window.localStorage.clear();
  }
  // used to set the datasource for the table, and both graphs
  getTemperatureList(temperatureList:any)
  {
    
    this.temperatureTableDataSource=[];
    this.celsiusGrphValueDataSource=[];
    this.fahrenheitGraphDataSource=[];
    this.temperatureList=temperatureList;
    
    for (let temperature of this.temperatureList) 
    { 
          
      this.celsiusGrphValueDataSource.push(temperature.celsius);
      this.fahrenheitGraphDataSource.push(temperature.fahrenheit);
      this.temperatureTableDataSource.push({"celsuis":temperature.celsius,"fahrenheit":temperature.fahrenheit});
    }
    
    
    this.populateLiearGrapghWithDataSource();
   // this.chart.chart.update();
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
  celsiusInput(event,actionName:string)
  {
    this.status=actionName;
    this.celsiusTextChanged.next(event.target.value);
  }

  //get fahrenheit value from input text field
  fahrenheitInput(event,actionName:string)
  {
    this.status=actionName;
    this.fahrenheitTextChanged.next(event.target.value);
  }

  // get converted temperature in *F from the database using service class
  getConvertedTemperature(temp:number)
  {
    if(this.status == STATUS.celsius)
    {
      this.celsiusValue=temp;
      this.dispatchToGetCelsiusToFahrenheit();
    } 
    else  if(this.status === STATUS.fahrenheit)
    {
      this.fahrenheitValue=temp;
      this.dispatchToGetFahrenheitToCelsius();   
    }
     
  }

 
  // ngx state. calls ngx action model which get data from the service and dispatch it to event listener
  dispatchToGetCelsiusToFahrenheit()
  {
    this.store.dispatch(new ConvertTemperatureModel(
    {
      "convertionType":"Fahrenheit",
      "celsiusValue":this.celsiusValue
    })).subscribe(
      (data) => 
      {
        this.status=STATUS.celsius;
        this.onSubject.next({ key: "TEMP_CONVERT_VALUE", value: data});
        window.localStorage.setItem("TEMP_CONVERT_VALUE", JSON.stringify(data));
        this.store.dispatch(new GetTemperatureListModel()).subscribe((fahrenheitData) => 
        {
          this.onSubject.next({ key: "TEMP_LIST", value: fahrenheitData});
          window.localStorage.setItem("TEMP_LIST", JSON.stringify(fahrenheitData));
          
        });
      });    
  }

  // ngx state. calls ngx action model which get data from the service and dispatch it to event listener
  dispatchToGetFahrenheitToCelsius()
  {
    this.store.dispatch(new ConvertTemperatureModel(
    {
      "convertionType":"Celsius",
      "fahrenheitValue":this.fahrenheitValue
    })).subscribe(
      (data) => 
      {
        this.status=STATUS.fahrenheit;
        window.localStorage.setItem("TEMP_CONVERT_VALUE", JSON.stringify(data));
        this.onSubject.next({ key: "TEMP_CONVERT_VALUE", value: data});
        this.store.dispatch(new GetTemperatureListModel()).subscribe((celsiusData) => 
        {
          this.onSubject.next({ key: "TEMP_LIST", value: celsiusData});
          window.localStorage.setItem("TEMP_LIST", JSON.stringify(celsiusData));
        });
      });
     
  }

  // ngx state. calls ngx action model which get data from the service and dispatch it to event listener
  dispatchToGetALLTemperatureList()
  {
    
    this.store.dispatch(new GetTemperatureListModel()).subscribe((data) => 
    {
      this.status=STATUS.refresh;
      this.onSubject.next({ key: "TEMP_LIST", value: data});
      window.localStorage.setItem("TEMP_LIST", JSON.stringify(data));
      
    });
  }

  //This method is passed to window.addEventListener
  private storageEventListener(event: StorageEvent) 
  {
 
    if (event.storageArea == localStorage) 
    {
      let tempValue;
      try 
      { 
        
        tempValue = JSON.parse(event.newValue); 
      }
      catch (e) 
      { 
        tempValue = event.newValue; 
      }
      this.onSubject.next({ key: event.key, value: tempValue });
    }
  }

  // start local storage event listener
  private start(): void 
  {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

 
 
  // used to refresh data display in browser tabs
  public refreshData(data:any) 
  {
    
    this.celsiusValue=data.TemperatureState.convert.celsius==null?0:data.TemperatureState.convert.celsius;
    this.celsuisDataSource.value = data.TemperatureState.convert.celsius==null?0:data.TemperatureState.convert.celsius;
    this.fahrenheitDataSource.value = data.TemperatureState.convert.fahrenheit==null?32:data.TemperatureState.convert.fahrenheit;
    this.fahrenheitValue = data.TemperatureState.convert.fahrenheit==null?32:data.TemperatureState.convert.fahrenheit;
    this.getTemperatureList(data.TemperatureState.getTemp);
    
  }
 
}

  
