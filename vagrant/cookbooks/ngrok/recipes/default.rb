execute "Start Ngrok Tunnels" do
  command "/ngrok/ngrok start -config /ngrok/ngrok.yml -log=stdout --all > /dev/null &"
end