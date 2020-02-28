import {Observable} from 'rxjs';
import { catchError, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { APP_CONFIG, AppConfigInterface } from 'src/app/app.config';

import { throwError } from 'rxjs';

@Injectable()
export class MockAPIService 
{
    

  private url = "http://localhost:3004/"; 
  private path = "temperature.getTemperatureList";
  constructor(private _http: HttpClient)
  {
      
  }


  getTemperatureList(paths:string): Observable<any> 
  {
   //path="person.getDetails";
    return this._http.get(`${this.url}${this.path}`).pipe(catchError(this.formatErrors));
  }


 
  private formatErrors(error: any) 
  {
        
    return throwError(error.error);
  }
   
  
}