"c:\Program Files (x86)\mosquitto\mosquitto_pub.exe" --cafile root-CA.crt --cert certificate.pem.crt --key private.pem.key -h "A330MM7RATC5K1.iot.us-east-1.amazonaws.com" -p 8883 -q 1 -d -t topic_1 -i clientid2 -m "Hi Data"