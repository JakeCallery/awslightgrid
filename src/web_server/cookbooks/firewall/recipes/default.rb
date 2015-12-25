execute "allow ports 80,443,5000" do
	command "iptables -A INPUT -p tcp --dport 80 -j ACCEPT"
	command "iptables -A INPUT -p tcp --dport 443 -j ACCEPT"
	command "iptables -A INPUT -p tcp --dport 5000 -j ACCEPT"
	command "iptables-save"
end