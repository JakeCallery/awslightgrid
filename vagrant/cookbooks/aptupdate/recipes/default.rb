execute "add ppa mosquitto repo" do
  command "apt-add-repository ppa:mosquitto-dev/mosquitto-ppa"
end

execute "apt-get update"
