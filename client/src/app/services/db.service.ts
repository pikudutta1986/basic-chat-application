import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable
({
	providedIn: 'root'
})

export class DbService
{
	public apiURL = environment.apiURL;
	constructor
	(
		private http: HttpClient,
		)
	{}
	public getAppInitialData()
	{
		return this.http.get (this.apiURL + "/api/get_initial_data");
	}
}
