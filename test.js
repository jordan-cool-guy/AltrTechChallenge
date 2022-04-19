

const http = require('http');
const req = require('request');

/*Test 1: basic test to see if first 10 requests in less 
than 1 minute return 200, and the rest return 401*/
async function makeSynchronousRequestTest1() {
	try {
        let passKey = true
        for (let i = 0; i < 200; i++){
            let http_promise = getPromise('http://localhost:8000/data');
            let response_body = await http_promise;
    
            if (i < 10){
                if (response_body != 200){
                    passKey = false
                    return
                }
            }else{
                if (response_body != 401){
                    passKey = false
                    return 
                }
            }
        }

		return passKey;
	}
	catch(error) {
		console.log(error);
	}
}

/*Test 2: test to see if requests to a new endpoint
allow additional 10 requests */
async function makeSynchronousRequestTest2() {
	try {
        let passKey = true
        for (let i = 0; i < 10; i++){
            let http_promise = getPromise('http://localhost:8000');
            let response_body = await http_promise;
    
            if (response_body != 200){
                passKey = false
                return
            }
            
        }

        for (let i = 0; i < 10; i++){
            let http_promise = getPromise('http://localhost:8000/Data');
            let response_body = await http_promise;
    
            if (i < 10){
                if (response_body != 200){
                    passKey = false
                    return
                }
            }
        }
        for (let i = 0; i < 10; i++){
            let http_promise = getPromise('http://localhost:8000/Data/');
            let response_body = await http_promise;
    
            if (i < 10){
                if (response_body != 200){
                    passKey = false
                    return
                }
            }
        }

		return passKey;
	}
	catch(error) {
		console.log(error);
	}
}

/*Test 3: test to ensure client can access endpoint after 1 minute has passed */
async function makeSynchronousRequestTest3() {
	try {
        let passKey = true
        for (let i = 0; i < 13; i++){
            let http_promise = getPromise('http://localhost:8000/');
            let response_body = await http_promise;
    
            if (i < 10){
                if (response_body != 200){
                    passKey = false
                    return
                }
            }else{
                if (response_body != 401){
                    passKey = false
                    return 
                }
            }
        }

        await sleep(61000);
        for (let i = 0; i < 11; i++){
            let http_promise = getPromise('http://localhost:8000/');
            let response_body = await http_promise;
    
            if (i < 10){
                if (response_body != 200){
                    passKey = false
                    return
                }
            }else{
                if (response_body != 401){
                    passKey = false
                    return 
                }
            }
        }

		return passKey;
	}
	catch(error) {
		console.log(error);
	}
}

/*Test 4: a request is made every 6 seconds*/
async function makeSynchronousRequestTest4() {
	try {
        let passKey = true
        for (let i = 0; i < 11; i++){
            let http_promise = getPromise('http://localhost:8000/');
            let response_body = await http_promise;
     
            if (response_body != 200){
                passKey = false
                return
            }
           
            await sleep(6000);

        }


		return passKey;
	}
	catch(error) {
		console.log(error);
	}
}

/*Test 5: a request is made every 5 seconds
should return 401 for last request*/
async function makeSynchronousRequestTest5() {
	try {
        let passKey = true
        for (let i = 0; i < 11; i++){
            let http_promise = getPromise('http://localhost:8000/');
            let response_body = await http_promise;
            
            if (i < 10){
                if (response_body != 200){
                    passKey = false
                    return
                }
            }else{
                if (response_body != 401){
                    passKey = false
                    return
                }
            }

           
            await sleep(5000);

        }


		return passKey;
	}
	catch(error) {
		console.log(error);
	}
}

/*Test 6: alternating requests between endpoints*/
async function makeSynchronousRequestTest6() {
	try {
        let passKey = true
        for (let i = 0; i < 200; i++){
            let http_promise1 = getPromise('http://localhost:8000/data');
            let response_body1 = await http_promise1;
            let http_promise2 = getPromise('http://localhost:8000/');
            let response_body2 = await http_promise2;
    
            if (i < 10){
                if (response_body1 != 200 || response_body2 != 200){
                    passKey = false
                    return
                }
            }else{
                if (response_body1 != 401 || response_body2 != 401){
                    passKey = false
                    return 
                }
            }
        }

		return passKey;
	}
	catch(error) {
		console.log(error);
	}
}



//driver function for tests
(async function () {
    // wait to http request to finish
    console.log("STARTING TEST 1");
    let res1 = await makeSynchronousRequestTest1();
    // below code will be executed after http request is finished
    passFail(res1, 1);
    await resetServer()

    console.log("STARTING TEST 2");
    let res2 = await makeSynchronousRequestTest2();
    // below code will be executed after http request is finished
    passFail(res2, 2);
    await resetServer()

    console.log("STARTING TEST 3");
    let res3 = await makeSynchronousRequestTest3();
    // below code will be executed after http request is finished
    passFail(res3, 3);
    await resetServer()

    console.log("STARTING TEST 4");
    let res4 = await makeSynchronousRequestTest4();
    // below code will be executed after http request is finished
    passFail(res4, 4);
    await resetServer()

    console.log("STARTING TEST 5");
    let res5 = await makeSynchronousRequestTest5();
    // below code will be executed after http request is finished
    passFail(res5, 5);
    await resetServer()

    console.log("STARTING TEST 6");
    let res6 = await makeSynchronousRequestTest6();
    // below code will be executed after http request is finished
    passFail(res6, 6);
    await resetServer()

})();




//utils
function passFail(result, testNum){
    if (result){
        console.log('PASSED TEST ' + testNum);
    }else{
        console.log('FAILED TEST ' + testNum);
    }
}

//creates delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//function tells server to clear it's cache
async function resetServer(){
    //reset server and prepare for second test
    return new Promise((resolve) => {
        const options = {
            url: 'http://localhost:8000',
            json: true,
            body: 'RESET'
        };
        
        req.post(options, (err, res, body) => {
            if (err) {
                return console.log(err);
            }
            // console.log(`Status: ${res.statusCode}`);
            resolve(body);
        });
        // resolve("RESTARTING SERVER");
    });

}

// function returns a Promise
function getPromise(url) {
	return new Promise((resolve) => {
		http.get(url, (res) => {
			let data = ""

			res.on('data', (chunks) => {
				data += chunks;
			});

			res.on('end', () => {
				let response_body = res.statusCode;
                
                // Buffer.concat(chunks_of_data);
				resolve(response_body);
			});

		})
	});
}