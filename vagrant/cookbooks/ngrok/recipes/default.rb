execute "Add ngrok start on boot" do
  command "/vagrant/setupNgrokCron.sh"
end

execute "Start Ngrok Tunnels" do
  command "/ngrok/startNgrok.sh"
end
