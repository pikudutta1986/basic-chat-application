const mysqlClass = require ('../classes/mysql');
const store = require ('../store');

class apiClass 
{
	#mysql;
	constructor()
	{
		this.#mysql = new mysqlClass();
	}
	
	// THIS FUNCTION WILL HANDLE GET/POST REQUESTS MADE BY USER FROM FRONT END APPLICATIONS.
	handleRequests (app)
	{
		// THIS END POINT WILL BE CALLED TO FETCH THE INITIAL DATA FOR THE FRONT END APPLICATION.
		app.get ('/api/get_initial_data', (req, res) =>
		{
			let user_id = req.body.user_id; 
			let response = {};
			this.#mysql.getDbInstance().getRows("SELECT * FROM pages").then(allpages=>
			{
			 	console.log(allpages);
				response.success = true;
				response.allpages = allpages;
				// SEND THE RESPONSE.
				res.send (response);
			});
		});
	}
}

// EXPORTING THIS CLASS SO OTHER CLASSES CAN IMPORT AND USE IT.
module.exports = apiClass;
