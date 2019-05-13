echo ">>> Regenerate certificates according to certificate.cnf \n";
openssl req -new -x509 -newkey rsa:2048 -sha256 -nodes -keyout localhost.key -days 3560 -out localhost.crt -config certificate.cnf

echo ">>> Installing certificates... \n";
sudo rm -rf /usr/share/ca-certificates/ArgosJS
sudo mkdir /usr/share/ca-certificates/ArgosJS
sudo cp localhost.* /usr/share/ca-certificates/ArgosJS/

#sudo dpkg-reconfigure ca-certificates
sudo update-ca-certificates;

certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "AngularJS Dev CA" -i /usr/share/ca-certificates/ArgosJS/localhost.crt 

echo ">>> Done! \n"

