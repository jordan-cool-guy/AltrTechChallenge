const http = require("http");

const host = "localhost";
const port = 8000;
let counter = 1;
let userDict = {};

const requestListener = function (req, res) {
    //for testing purposes to reset the user dict
    if (req.method === 'POST') {
        let text = '';
        req.on('data', chunk => {
            text += chunk.toString(); // convert Buffer to string
        });

        req.on('end', () => {
            if (text == '"RESET"'){
                userDict = {};
            }
            res.end("doopa");
        });
    }else{
        let timeStamp = new Date().getTime() / 1000;

        let dictKey = req.socket.remoteAddress + req.url;

        let responseCode;
        //if dict contains attempt
        if (dictKey in userDict){
            //if attempts for specific param exceed 10
            if (userDict[dictKey].length > 9){
                const timeInterval = timeStamp - userDict[dictKey][0];
                if (timeInterval > 60){
                    userDict[dictKey].push(timeStamp);
                    userDict[dictKey].shift(); //pop the first timestamp from the queue
                    responseCode = 200;
                    //return 200
                }else{
                    responseCode = 401
    
                }
            //if attempts for param is less than 10
            }else{
                userDict[dictKey].push(timeStamp);
                responseCode = 200
    
            }
    
        //if dict doesn't contain attempt
        }else{
            userDict[dictKey] = [timeStamp];
            responseCode = 200;
    
        }
        res.writeHead(responseCode);
        res.end();
    }

    
  
};


const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});