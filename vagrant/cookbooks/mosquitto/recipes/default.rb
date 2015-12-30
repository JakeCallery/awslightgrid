package "mosquitto"

file '/etc/mosquitto/conf.d/logging.conf' do
  owner "root"
  group "root"
  mode 0644
  content IO.read('/vagrant_filestocopy/mosquitto_configs/logging.conf')
  action :create
end

service "mosquitto" do
  action :restart
end