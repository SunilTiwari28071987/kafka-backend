var connection =  new require('./kafka/Connection');
var sign_up = new require('./services/sign_up');
var sign_in = new require('./services/sign_in');

var topic_array = [{topic:'sign_up_req', partition: 0},{topic:'sign_in_req', partition: 0}];

var group_id = 'kafka-node-group';
var consumer = connection.getConsumer(topic_array,group_id);
var producer = connection.getProducer();


consumer.on('message', function (message) {
    console.log("message",message);
    var data = JSON.parse(message.value);
    var req_topic_name = message.topic;
    console.log("message",message);
    switch(req_topic_name){

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

        case "sign_in_req":

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
                producer.send(payloads, function(err, data){
                    console.log(data);
                });
                return;
            });
            break;


    }
});
