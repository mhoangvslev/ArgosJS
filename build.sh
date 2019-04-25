echo "Reinstall nodejs modules..."
npm clean-install;

echo "Adding few tweaks..."
sed -i "s/node: false/node: { crypto: true, stream: true, fs: 'empty' }/g" ./node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js

echo "All done!"
