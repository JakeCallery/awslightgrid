execute "Change hostname" do
	command "echo 'cfnsns.massivepoint.com' > /etc/hostname"
end

execute "run hostname" do
	command "hostname cfnsns.massivepoint.com"
end

ruby_block "insert_line" do
  block do
    file = Chef::Util::FileEdit.new("/etc/hosts")
	file.insert_line_if_no_match("127.0.0.1 cfnsns.massivepoint.com", "127.0.0.1 cfnsns.massivepoint.com")
    file.write_file
  end
end
