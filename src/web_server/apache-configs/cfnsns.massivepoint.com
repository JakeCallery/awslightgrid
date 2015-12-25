<virtualhost *:80>
    ServerName cfnsns.massivepoint.com

    WSGIDaemonProcess cfnsnswebapp user=vagrant group=www-data threads=5 home=/var/www
    WSGIScriptAlias / /var/www/cfnsnswebapp.wsgi

    <directory /var/www>
        WSGIProcessGroup cfnsnswebapp
        WSGIApplicationGroup %{GLOBAL}
        WSGIScriptReloading On
        Order allow,deny
        Allow from all
    </directory>
</virtualhost>