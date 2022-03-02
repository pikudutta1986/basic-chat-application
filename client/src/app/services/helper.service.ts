
import {Injectable, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {DbService} from './db.service';
declare var $: any;

@Injectable
({
	providedIn: 'root'
})

export class HelperService
{
	constructor(
		private dbService: DbService
		)
	{
	}
}
