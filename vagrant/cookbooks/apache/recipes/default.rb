package "apache2"

link "/var/www/awslightgrid" do
  to "/vagrant_web_app"
end

link "/socketserver" do
  to "/vagrant_socket_server"
end

file "/etc/apache2/sites-available/awslightgrid.ngrok.io.conf" do
	owner "root"
	group "root"
	mode 0644
	content IO.read("/vagrant_filestocopy/apache_configs/awslightgrid.ngrok.io.conf")
	action :create
end

execute "disable default site" do
	command "a2dissite 000-default"
end

execute "enable site" do
	command "a2ensite awslightgrid.ngrok.io"
end

ruby_block "insert_line" do
	block do
		file = Chef::Util::FileEdit.new("/etc/apache2/ports.conf")
		file.insert_line_if_no_match("Listen 8080", "Listen 8080")
		file.write_file
	end
end

execute "restart apache" do
	command "/etc/init.d/apache2 restart"
end




