# About
MQTT is lightweight, intuitive, and easy to use messaging protocol suitable for IoT applications and devices. Aside from the traditional request/response communication, MQTT protocol uses a paradigm known as publish/subscribe. Users (applications/devices) can publish or send data under certain topics. Similarly, other users can show interest in receiving updates and messages published on certain topic(s) by first subscribing. A topic is a meta-data and a short description of the communicated messages (e.g., Chicago weather, traffic updates), and users can subscribe to a wide range of topics. Spring 2021, I am adapting a 300-level course to an honors credit, fulfilling one of the curriculum requirements of the Honors Program. To adapt a course, I am expanding on what I am learning for my Computer Networks class by exploring the work of the MQTT protocol to implement a user-friendly JavaScript-based dashboard for MQTT users. Using the dashboard, a user can subscribe to a topic or a set of topics, publish a message(s), subscribe to topic(s), and view the published messages in a suitable format. The developed dashboard allows different types of messages to be published and displayed, that include JSON/XML-based content, documents, and images. 

# Check out the dashboard! 
  http://simplemqttdashboard.com/ 

## Dashboard Functions:
- New Changes:
	- Subscribes to topic(s)
	- Unsubscribes to topic(s)
	- Select subscribed topic
	- Publish files (text files, JSON, XML)
	- Pop-up notifications
	- logs

- Setbacks?
	- cannot unpack pdfs and high resolution images

## Libraries used: 
	- <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js"</script>
	- <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>

## References
	- HiveMQ, http://hivemq.com/demos/websocket-client/
	- stackoverflow, https://stackoverflow.com/
	- Steve's Internet Guide, http://www.steves-internet-guide.com/
	- Thomas Laurenson https://www.thomaslaurenson.com

# Authors
- Developer:  
	- Muhammad Bangash, Northeastern Illinois University, Department of Computer Science
	- https://www.linkedin.com/in/muhammad-saad-bangash-897a5216b/
	 
- Faculty Mentor: 
	- Professor Ahmed Khaled, Northeastern Illinois University, Department of Computer Science
	- http://cs.neiu.edu/~akhaled/
		
# How to Contribute? 
Just include this README.md file and License file to your project.

# License 
BSD 2-Clause License
Copyright (c) 2021, mbangash1neiu


