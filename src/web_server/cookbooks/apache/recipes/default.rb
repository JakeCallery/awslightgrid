package "apache2"
execute "rm -rf /var/www"
link "/var/www" do
	to "/vagrant_source/cfnsns"
end

package "libapache2-mod-wsgi"

file "/etc/apache2/sites-available/cfnsns.massivepoint.com" do
	owner "root"
	group "root"
	mode 0644
	content ::File.open("/vagrant_apache_configs/cfnsns.massivepoint.com").read
	action :create
end

execute "disable default site" do
	command "a2dissite default"
end

execute "enable site" do
	command "a2ensite cfnsns.massivepoint.com"
end

execute "restart apache" do
	command "/etc/init.d/apache2 restart"
end



