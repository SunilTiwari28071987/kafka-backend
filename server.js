var connection =  new require('./kafka/Connection');
var sign_up = new require('./services/sign_up');
var sign_in =  new require('./services/sign_in');
var file_upload = new require('./services/file_upload');
var file_delete = new require('./services/file_delete');
var file_share = new require('./services/file_share');
var file_star = new require('./services/file_star');
var file_unstar = new require('./services/file_unstar');

var topic_array = [{topic:'sign_up_req', partition: 0}, {topic:'file_upload_req', partition: 0},
    {topic:'login_req', partition:0}, {topic:'file_delete_req', partition:0},
    {topic:'file_share_req', partition:0}, {topic:'file_star_req', partition:0},
    {topic:'file_unstar_req', partition:0}
];


var group_id = 'kafka-node-group';
var consumer = connection.getConsumer(topic_array,group_id);
var producer = connection.getProducer();



consumer.on('message', function (message) {
    console.log("message",message);
    var data = JSON.parse(message.value);
    var req_topic_name = message.topic;
    console.log("message",message);
    switch(req_topic_name){
        case "login_req":

            sign_in.handle_request(data.data, function(err,res){
                //console.log('after handle',res);
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                console.log(payloads);
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;


        case "sign_up_req":

        console.log("sign_up_req  1234");
        sign_up.handle_request(data.data, function(err,res){
            console.log('after handle',res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log('producer data',data);
            });
            return;
        });
        break;

        case "file_upload_req":

            console.log("file_upload_req");
            file_upload.handle_request(data.data, function(err,res){
                console.log('after handle',res);
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log('producer data',data);
                });
                return;
            });
            break;

        case "file_delete_req":

            console.log("file_delete_req");
            file_delete.handle_request(data.data, function(err,res){
                console.log('after handle',res);
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log('producer data',data);
                });
                return;
            });
            break;

        case "file_share_req":

            console.log("file_share_req");
            file_share.handle_request(data.data, function(err,res){
                console.log('after handle',res);
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log('producer data',data);
                });
                return;
            });

        break;

        case "file_star_req":

            console.log("file_star_req");
            file_star.handle_request(data.data, function(err,res){
                console.log('after handle',res);
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log('producer data',data);
                });
                return;
            });

        break;

        case "file_unstar_req":

            console.log("file_unstar_req");
            file_unstar.handle_request(data.data, function(err,res){
                console.log('after handle',res);
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                            correlationId:data.correlationId,
                            data : res
                        }),
                        partition : 0
                    }
                ];
                producer.send(payloads, function(err, data){
                    console.log('producer data',data);
                });
                return;
            });

        break;
    }
});
