set RSYNC_PASSWORD=password
rsync -avtz --delete-during --exclude .git --exclude .idea --exclude .gitignore --exclude syncfiles.bat ./ rsync://root@192.168.1.190/mqtttest