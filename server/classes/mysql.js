const dbClass = require('../database/db');

class mysqlClass
{
	#Db; 
	constructor ()
	{
		this.#Db = new dbClass();
	}
	
	getDbInstance()
	{
		return this.#Db;
	}
}

// EXPORTING THIS CLASS SO OTHER CLASSES CAN IMPORT AND USE IT.
module.exports = mysqlClass;
