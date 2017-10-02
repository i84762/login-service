var Hapi = require('hapi');
var server = new Hapi.Server();
var mqUtil = require('./_modules/mq/mq-util');
const gConfig = require('./_modules/config');
server.connection({port:8000});

server.start(err => {
        if(err)
            throw err;
        console.log("Server started ... ");
} );

server.route(
    {
        method : 'GET',
        path : "/",
        handler : (request, reply) => {
                    reply("working");
                }
    }
);
server.route({
    method : 'GET',
    path : '/login',
    handler : (request, reply) => {
            // console.log(request.query.hi);
            login(request.query.id, request.query.pass, response =>{reply(response)},
            request);
    }
});
server.route({
    method : 'GET',
    path : '/subscribe',
    handler : (request, reply) => {
            console.log(request.id);
            // mqUtil.subscribeQueue('new', 
            // body => {console.log('fatte hi chakk te ' + body);callback(body)},
            // {'tempQueue' : true});
    }
});

function login(loginId, password, callback, request)
{
    // mqUtil.subscribeQueue('new', 
    //                         body => {console.log('fatte hi chakk te ' + body);callback(body)},
    //                         {'tempQueue' : true});
    let queueName = gConfig.get('/queue/login');
    let user = {'loginId' : loginId, 'password' : password};
    mqUtil.sendAndWait(queueName, 
                        user, 
                        {'replyTo' : request.id+ '-login','type' : '', 'tempQueue' : false},
                        (body, headers) => {console.log('reply found ' + body);callback(body)});
}