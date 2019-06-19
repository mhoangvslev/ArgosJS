const fs = require("fs");
const file = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

console.log("Patching bugs...");

fs.readFile(file, 'utf8', (err, data) => {
    if (err) return console.log(err);

    let result = data.replace(/node: false/g, "node: {crypto: true, stream: true, fs: 'empty', net: 'empty'}");
    result = data.replace(/node: {crypto: true, stream: true}/g, "node: {crypto: true, stream: true, fs: 'empty', net: 'empty'}");
    
    console.log(result);
    fs.writeFile(file, result, (err) => {
        if (err) return console.log(err);
    });

    console.log("Done...");
})