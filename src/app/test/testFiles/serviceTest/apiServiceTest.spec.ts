import {TestBed} from '@angular/core/testing'
import { HttpClientTestingModule,HttpTestingController } from '@angular/common/http/testing';
import {ApiService} from "../../../../../../../Do_not_delete_project_folder/redSpaceChanllenge/redSpaceFrontEnd/src/app/service/api.service";
import { APP_CONFIG, AppConfig} from '../../../../../../../Do_not_delete_project_folder/redSpaceChanllenge/redSpaceFrontEnd/src/app/app.config';
import { environment } from '../../../../../../../Do_not_delete_project_folder/redSpaceChanllenge/redSpaceFrontEnd/src/environments/environment';
import { Title } from '@angular/platform-browser';


describe('ApiService', ()=>
{
    let apiService:ApiService;
    let httpTestingController: HttpTestingController;
    let api_url: string;
    

    const mockTemperatureList = 
    {
      "data": [
            {
                "type": "Fahrenheit",
                "celsius": 140,
                "fahrenheit": 284
            },
            {
                "type": "Fahrenheit",
                "celsius": 150,
                "fahrenheit": 302
            },
            {
                "type": "Fahrenheit",
                "celsius": "6",
                "fahrenheit": 42.8
            },
            {
                "type": "Fahrenheit",
                "celsius": "60",
                "fahrenheit": 140
            },
            {
                "type": "Fahrenheit",
                "celsius": "1",
                "fahrenheit": 33.8
            },
            {
                "type": "Fahrenheit",
                "celsius": "16",
                "fahrenheit": 60.8
            },
            {
                "type": "Fahrenheit",
                "celsius": "160",
                "fahrenheit": 320
            },
            {
                "type": "Fahrenheit",
                "celsius": "1",
                "fahrenheit": 33.8
            },
            {
                "type": "Fahrenheit",
                "celsius": "17",
                "fahrenheit": 62.6
            },
            {
                "type": "Fahrenheit",
                "celsius": "170",
                "fahrenheit": 338
            }
        ]
    }
    
  
    beforeEach(()=>
    {
       
        TestBed.configureTestingModule({providers:[Title, { provide: APP_CONFIG, useValue: AppConfig },ApiService],imports: [ HttpClientTestingModule]})
        httpTestingController = TestBed.get(HttpTestingController);
        apiService = TestBed.get(ApiService);
            
    });
    
    
    afterEach(() =>
    {
        apiService =null;
        httpTestingController.verify();
    });

    
    it('should be created', () => 
    {
        expect(apiService).toBeTruthy();
    });
    

    it('should not immediately connect to the server', () => 
    {
        httpTestingController.expectNone({});
    });

    // test for get person details
    it('get person details',()=>
    {
        
       apiService.getStarWarsCelebrity(environment.getTemperatureListUrlTest).subscribe(temperatureList => 
        {
            
            expect(temperatureList).not.toBe(null);
            expect(temperatureList[0].fahrenheit).toEqual(284);
        },
        error => 
        {
            expect(error).not.toBe(null);
        });
       
        const req = httpTestingController.expectOne({ method: 'GET', url: environment.getTemperatureListUrlTest + "person.getDetails"});

        expect(req.request.method).toEqual('GET');
    
        req.flush(mockTemperatureList);
    });   

});

