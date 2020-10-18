const io = require('socket.io')();
const os = require('os');
const utils = require('os-utils');
const PORT = 5000;

function getCPUUsage(){
    let usage;
    utils.cpuUsage(value=>usage=`CPU Usage: ${(value*100).toFixed(2)}%`);
    return usage;
}

io.on("connection",client=>{
    console.log(`Websocket connected to client.${new Date().toString()}`);
    client.on('get-health',(data)=>{
        console.log(`Client URL: ${data}`);
        setInterval(()=>{
            let usage;
            utils.cpuUsage(value=>{
                usage=`CPU Usage: ${(value*100).toFixed(2)}%`;
                const ut = os.uptime();
                const data = {
                    uptime:`${ut} second(s) [ ${parseInt((ut/60)/60)} hour(s) and ${parseInt((((ut/60)/60).toFixed(2)-parseInt((ut/60)/60))*59)} minute(s) ⏳ ]`,
                    operatingSystem:os.type()+' | '+os.release()+' | '+os.platform()+' | '+os.arch(),
                    memoryUsedPercent:(((os.totalmem()-os.freemem())/os.totalmem())*100).toFixed(1)+'%',
                    cpuUsage :usage
                };
                client.emit('send-health',data);
            });
        },1000);
    })
})

io.listen(PORT);
console.log(`Websocket server listening on port ${PORT}`)
