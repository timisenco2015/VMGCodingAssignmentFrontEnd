import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of,EMPTY} from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import { ApiService } from './apiService';


@Injectable()
export class TemperatureService
{
  private _http: HttpClient;
  _apiService: ApiService;
  

  constructor(private http: HttpClient,_apiService: ApiService)
  {
    this._http=http;
    this._apiService = _apiService;
  }


  //get all devices from the database
  // filters the device list on criteria isProcessing is false
  // returns deviceId and total event count for each device id
  postTemperatureValue(data:any): Observable<any>
  {
    
    return  this._apiService.post(`temperatureconversion/convertTemperature`, data)
    .pipe(

      map((response) => 
      {
        
        if(response==null)
        {
          return EMPTY;
        }
        else
        {
          return response.data;
        }
      }), 
      
      catchError(this.handleError)
    )
  }

  //add device to the database
  getTemperatureList():Observable<any>
  {
    
    return  this._apiService.get(`temperatureconversion/getTemperatureList`)
    .pipe(

      map((response) => 
      {
        if(response==null)
        {
          return EMPTY;
        }
        else
        {
          return response.data;
        }
      })
      );
  }


  
 
  private handleError(error: Response) 
  {
    console.error(error)
    return Observable.throw(error|| "Server error");
  }
}