execute "Change hostname" do
	command "echo 'awslightgrid.ngrok.io' > /etc/hostname"
end

execute "run hostname" do
	command "hostname awslightgrid.ngrok.io"
end

ruby_block "insert_line" do
  block do
    file = Chef::Util::FileEdit.new("/etc/hosts")
	  file.insert_line_if_no_match("127.0.0.1 awslightgrid.ngrok.io", "127.0.0.1 awslightgrid.ngrok.io")
    file.write_file
  end
end
