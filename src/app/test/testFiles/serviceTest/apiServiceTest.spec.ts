import {TestBed} from '@angular/core/testing'
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';
import {ApiService} from "../../../service/apiService";
import { APP_CONFIG, AppConfig,AppConfigInterface} from '../../../../../src/app/app.config';
import { Title } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', ()=>
{
    let apiService:ApiService;
    let httpTestingController: HttpTestingController;
    let config: AppConfigInterface;
    let requestBody = 
    {
        "celsiusValue":36,
        "fahrenheitValue":0,
        "convertionType":"Fahrenheit"
    }
  
    beforeEach(()=>
    {
       
        TestBed.configureTestingModule({providers:[Title, { provide: APP_CONFIG, useValue: AppConfig },ApiService],imports: [ HttpClientTestingModule]})
        httpTestingController = TestBed.get(HttpTestingController);
        apiService = TestBed.get(ApiService);
        config= TestBed.get(APP_CONFIG);
    });
    
    
    it('should be created', () => 
    {
        expect(apiService).toBeTruthy();
        expect(httpTestingController).toBeTruthy();
        expect(config).toBeTruthy();
    });
    

    it('post method in API Service',()=>
    {
        apiService.post(`temperatureconversion/convertTemperature`,requestBody).subscribe(result=>
        {
                expect(result.status).toEqual(200);
                expect(result.data.fahrenheit).toEqual(96.8);
        });
        
        const resp = httpTestingController.expectOne(config.GETAPI_ENDPOINT+`temperatureconversion/convertTemperature`);
        
        expect(resp.request.method).toEqual("POST");

        // for parameter use expect(resp.request.params.celsiusValue).toEqual(36);

        expect(resp.request.body.celsiusValue).toEqual(36);

        resp.flush({
            "status": 200,
            "statusDesc": "succesful",
            "data": {
                "celsius": 36,
                "fahrenheit": 96.8,
                "convertionType": "Fahrenheit"
            },
            "message": "Record Fecthed Successfully"
        });

    });


    it('get method in API Service',()=>
    {
        apiService.get(`temperatureconversion/getTemperatureList`).subscribe(result=>
        {

        });
        
        const resp = httpTestingController.expectOne(config.GETAPI_ENDPOINT+`temperatureconversion/getTemperatureList`);
        
        expect(resp.request.method).toEqual("GET");

    
        resp.flush({
            "status": 200,
            "statusDesc": "succesful",
            "data": [
                {
                    "fahrenheit": null,
                    "convertionType": "Fahrenheit"
                },
                {
                    "celsius": 36,
                    "fahrenheit": 96.8,
                    "convertionType": "Fahrenheit"
                }
            ],
            "message": "Record Fecthed Successfully"
        });

    });
    
    it('test getTemperature Error',()=>
    {
        apiService.get(`temperatureconversion/getTemperatureList`).subscribe(()=> 
        {
            fail("The get temperature list operation should fail");
            (error:HttpErrorResponse)=>
            {
                expect(error.status).toBe(500);
                
            }

        });
        
        const resp = httpTestingController.expectOne(config.GETAPI_ENDPOINT+`temperatureconversion/getTemperatureList`);
        
        expect(resp.request.method).toEqual("GET");

    
        resp.flush('Get temperature list failed', {status:500, statusText:'Internal Server Error'});

    });
    
    afterEach(() =>
    {
        apiService =null;
        httpTestingController.verify();
        httpTestingController = null;
        config=null;
    });

});

//

