/* Global variables*/
let mqtt = null //object for the connection
let message = null //when you get error, message should be displayed back
let status = null //part of the logs
let reconnectTimeout = 2000 //if you enter the wrong server information
let connected_flag = 0 //if broker is connected, flag = 1
let subs = [] //subscription will be in this array
let subs_qos = [] //subscription quality of service will be in this array
let subCount = 0 //when you add a subscription, add a count
let check = false; //checking if a wrong command is entered

let host = null //input for broker
let port = null //input for port 
let clientId = null //input for clientID
let el = null
let startConnection = null //disconnect is null
let pulishCheck = 0 //if publish is correct, then the check will be 1
let arraybyteData = null; //if your posting a file, the data will be stored here

//files
let commingFileNames = [];
let commingFiles = [];

/* Validation for connection. Making sure x (host), y(port), z(clientID) are not empty. 
   If they are empty, return false */
function validate(x, y, z) {
    if (x == "" || y == "" || z == "") {
        return false
    }
    return true
}

// Called when the client loses its connection
function onConnectionLost() {
    console.log("connection lost");
    let data = document.createElement('span');
    data.innerHTML = "connection lost";
    status.appendChild(data)
    let color = "#ff0000";
    el.style.borderColor = color;
    startConnection.style.background = "#00ff00";
    connected_flag = 0;
}

/*  The onFailure function shown below logs a message and attempts 
    a reconnect every few seconds set by the reconnecttimeout variable.*/
function onFailure() {
    console.log("Failed");
    let color = "#ff0000";
    el.style.borderColor = color;
    setTimeout(MQTTconnect, reconnectTimeout);
}

// Called when a message arrives
function onMessageArrived(r_message) {
    let messageData = r_message.payloadString;
    let checkFiles = messageData.split(" ")[0]
    let out_msg = "Message received on topic/";
    if (checkFiles == "MQTT_file_") {
        let filesName = messageData.split(" ")[1]
        messageData = messageData.substr(messageData.indexOf(" ") + 1);
        messageData = messageData.substr(messageData.indexOf(" ") + 1);
        commingFileNames.push(filesName)
        commingFiles.push(messageData)
        out_msg = out_msg + r_message.destinationName + ", file " + filesName;


        var a = document.createElement('a');
        var link = document.createTextNode("Download file");
        a.appendChild(link);
        a.title = "Download file";
        a.classList.add("link");
        a.href = commingFileNames.length - 1;

        let data = document.createElement('span');
        data.innerHTML = out_msg;
        data.appendChild(a)
        status.appendChild(data)
        console.log(out_msg);

    } else {
        out_msg = out_msg + r_message.destinationName + ": " + r_message.payloadString;
        let data = document.createElement('span');
        data.innerHTML = out_msg;
        status.appendChild(data)

    }

    var elements = document.getElementsByClassName('link');

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', function (e) {
            let fileIndex = parseInt(this.getAttribute("href"));


            var str = commingFiles[fileIndex],
                arr = new Uint8Array(str.length);
            str.split("").forEach(function (ac, b) {
                arr[b] = ac.charCodeAt();
            });

            download(arr, commingFileNames[fileIndex], "text/plain");
            e.preventDefault()
        });
    }

    notifyme(out_msg, 'success');
    arraybyteData = null;
    document.getElementById("myfile").value = "";

}

function onConnected(recon, url) {
    var data = document.createElement('span');
    data.innerHTML = " in onConnected " + reconn;
    status.appendChild(data)

}

// Called when the client connects
function onConnect() {
    connected_flag = 1
    el = document.getElementById("connectForm");
    let color = "#00ff00";
    el.style.borderColor = color;
    console.log("on Connect " + connected_flag);
    var data = document.createElement('span');
    data.innerHTML = "Connected to " + host + ":" + port;
    status.appendChild(data)
    notifyme("Connected to " + host + ":" + port);
    check = true;
    subs = []
    subs_qos = []
    populateSubs();
}

//called when disconnect button is pressed
function disconnect() {
    let color = "#168D5F";
    startConnection.style.background = color;
    startConnection.innerHTML = "Connect"
    el.style.borderColor = "#000000";
    mqtt.disconnect();
    check = false
}

function MQTTconnect() {
    host = document.getElementById("url").value
    port = parseInt(document.getElementById("port").value)
    clientId = document.getElementById("userID").value
    el = document.getElementById("connectForm");
    startConnection = document.getElementById("connect");
    status = document.getElementById("messages");

    if (check) {
        disconnect();
    } else {
        if (validate(host, port, clientId)) {
            mqtt = new Paho.MQTT.Client(host, port, clientId);
            let options = {
                timeout: 3,
                onSuccess: onConnect,
                onFailure: onFailure,

            };

            mqtt.onConnectionLost = onConnectionLost;
            mqtt.onMessageArrived = onMessageArrived;
            //mqtt.onConnected = onConnected;

            mqtt.connect(options);
            startConnection.innerHTML = "Disconnect";
            let color = "#ff0000";
            startConnection.style.background = color;
            check = true;

        } else {
            var data = document.createElement('span');
            data.innerHTML = "Error! A correct input can be broker.hivemq.com:8000";
            status.appendChild(data)
        }
    }
    return false;
}

/*
    allows the user to subscribe,
    checks if user has already subscribed to a same topic,
    other checks for the client
*/
function sub_topics() {
    if (connected_flag == 0) {
        let out_msg = "Connect to a broker first!"
        console.log(out_msg);
        notifyme(out_msg, 'warning');
    } else {
        let stopic = document.getElementById("topic").value;

        if (stopic.trim() != "") {
            let qosNr = parseInt(document.getElementById("qos").value);
            let out_msg = "Subscribed to " + stopic + ":" + qosNr;
            let data = document.createElement('span');
            data.innerHTML = out_msg;
            status.appendChild(data);

            mqtt.subscribe(stopic, {
                qos: qosNr
            });
            if (!subs.includes(stopic)) {
                subs.push(stopic)
                subs_qos.push(qosNr)
                console.log(out_msg);
                notifyme(out_msg, 'success');
            } else {
                out_msg = "Already subscribed to " + stopic + ":" + qosNr;
                console.log(out_msg);
                notifyme(out_msg, 'warning');
            }
        } else {
            let out_msg = "Enter a topic!";
            console.log(out_msg);
            notifyme(out_msg, 'warning');
        }

        populateSubs()

    }
    return false;
}

//Everytime you subscribe, the sub will be populated. 
function populateSubs() {
    let dynamicSelect = document.getElementById("sub_topic");
    let mysubs = document.getElementById("mysubs");
    let post_topic = document.getElementById("post_topic");
    post_topic.innerHTML = ""
    mysubs.innerHTML = ""
    dynamicSelect.innerHTML = "";

    subs.forEach((element, index) => {
        let option_elem = document.createElement('option');
        option_elem.value = index;
        option_elem.textContent = element;
        dynamicSelect.appendChild(option_elem);

        let post_elem = document.createElement('option');
        post_elem.value = index;
        post_elem.textContent = element;
        post_topic.appendChild(post_elem);

        var subsSpan = document.createElement('span');
        subsSpan.innerHTML = element + " : " + subs_qos[index] + " ";
        mysubs.appendChild(subsSpan)
    });
}

//updates the sub array when unsubscribing
function unsubscribe_topics() {
    let index = document.getElementById("sub_topic").value;
    if (index != null) {
        try {
            mqtt.unsubscribe(subs[index]);
            let out_msg = "Unsubscribing: " + subs[index];
            console.log(out_msg);
            let data = document.createElement('span');
            data.innerHTML = out_msg;
            status.appendChild(data)
            if (index > -1) {
                subs.splice(index, 1);
                subs_qos.splice(index, 1);
            }
            notifyme(out_msg, 'success');
            populateSubs()
        } catch (error) {
            console.log("no topic to unsubscribe");
            notifyme('no topic to unsubscribe', 'success');
        }



    }

}

/* The publishSMS function extracts the message and topic and logs them.
   We use the payload method to send and recieve messages and files*/
function publishSMS() {
    if (connected_flag == 0) {
        let out_msg = "Connect to a broker first!"
        console.log(out_msg);
        notifyme(out_msg, 'warning');
        try {
            let data = document.createElement('span');
            data.innerHTML = out_msg;
            status.appendChild(data)
        } catch (error) {
            console.log("error ...");
        }

    } else {
        let payload = document.getElementById("sms").value;
        let topic = null;
        let qospublish = null;
        let topicpublish = null;

        //checking file payload
        if (arraybyteData !== null) {
            payload = arraybyteData;
        }

        if (pulishCheck == 0) {
            topic = document.getElementById("post_topic").value;
            if (topic == null || payload.trim() == "") {
                return inputRequired();
            }
        } else {
            topicpublish = document.getElementById("othertopic").value;
            qospublish = parseInt(document.getElementById("qos").value);
            if (topicpublish == null || payload.trim() == "") {
                return inputRequired();
            }
        }

        message = new Paho.MQTT.Message(payload)
        if (pulishCheck == 0) {
            message.destinationName = subs[topic];
            message.qos = subs_qos[topic];
        } else {
            message.destinationName = topicpublish.trim();
            message.qos = qospublish;
        }

        mqtt.send(message);
        arraybyteData = null;
        document.getElementById("myfile").value = "";
    }
    return false

}

function inputRequired() {
    Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Oops! ',
        text: 'Sorry topic , message or file are required to publish ',
        showConfirmButton: false,
        timer: 2000
    })
    return false;
}

//popup alert
function notifyme(sms, type) {
    Swal.fire({
        position: 'top-end',
        icon: type,
        title: sms,
        showConfirmButton: false,
        timer: 1500
    })
}

function topicOption() {

    let checkBox = document.getElementById("unsub");

    let othertopics = document.getElementById("othertopic");
    let lbothertopics = document.getElementById("lbOthertopics");

    let mytopics = document.getElementById("post_topic");
    let lbmytopics = document.getElementById("lbSelectTopic");

    if (checkBox.checked == true) {
        othertopics.style.display = "inline";
        lbothertopics.style.display = "inline";
        lb_qospublish.style.display = "inline";
        qospublish.style.display = "inline";
        mytopics.style.display = "none";
        lbmytopics.style.display = "none";
        pulishCheck = 1;
    } else {
        othertopics.style.display = "none";
        lbothertopics.style.display = "none";
        lb_qospublish.style.display = "none";
        qospublish.style.display = "none";
        mytopics.style.display = "inline";
        lbmytopics.style.display = "inline";
        pulishCheck = 0;
    }

}
//store file byte array data here
function valueData(sms) {
    let fullPath = document.getElementById('myfile');
    let filename = fullPath.files[0].name;
    filename = filename.split(' ').join('_');

    arraybyteData = "MQTT_file_ " + filename + " " + sms;

}

/*User imports file 
         ==> create a buffer
               ==> process the file to a Unit8Array 
                         ==>process the Unit8Array to a binaryString*/
document.querySelector("#myfile").addEventListener(
    "change",
    function () {
        var reader = new FileReader();
        reader.onload = function () {
            var arrayBuffer = this.result,
                array = new Uint8Array(arrayBuffer),
                binaryString = String.fromCharCode.apply(null, array);

            valueData(binaryString);
        };
        reader.readAsArrayBuffer(this.files[0]);
    },

    false
);

//subscribe model
let model = document.getElementById('subscribeWindow');
let btn = document.getElementById("showWindow");
let close = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    model.style.display = "block";
}
close.onclick = function () {
    model.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == model) {
        model.style.display = "none";
    }
}