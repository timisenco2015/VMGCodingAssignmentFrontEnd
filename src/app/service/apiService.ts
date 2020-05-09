import { Injectable, Injector,Inject } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { catchError,map } from 'rxjs/operators';
import { APP_CONFIG, AppConfigInterface } from 'src/app/app.config';
import { throwError } from 'rxjs';


@Injectable()
export class ApiService 
{
  api_url: string;


  constructor(
    private injector: Injector,
    private _http: HttpClient,
    
    @Inject(APP_CONFIG) private config: AppConfigInterface) 
    {
      this.api_url = this.config.GETAPI_ENDPOINT;
     
    }

 
  private formatErrors(error: any) 
  {
    
    return throwError(error.error);
  }

 

  post(path: string, body: Object = {}): Observable<any> {
    return this._http.post(
       `${this.api_url}${path}`, body
     ).pipe(catchError(this.formatErrors));
   }

  //get each device event count
  get(path: string): Observable<any> 
  {
    return this._http.get(
      `${this.api_url}${path}`).pipe(catchError(this.formatErrors));
  }



   //for future reference use

  /*
    default values: courseId:number, filter='', sortOrder='asc', pageNumber=0, pageSize=3
    return this.http.get('your url', params: new HttpParams().set('courseId',courseId.toString)
                                                              .set('filter',filter)
                                                              .set('sortOrder',sortOrder)
                                                              .set('pageNumber', pageNumber.toString())
                                                              .set('pageSize', pageSize.toString()))
    
  */

}