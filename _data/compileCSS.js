const fs = require("fs");
const MinifyCSS = require("clean-css");
const postCSS = require('postcss');
const purgeCSS = require('@fullhuman/postcss-purgecss');

module.exports = async function() {
    if (!fs.existsSync('_site')){fs.mkdirSync('_site');}
    if (!fs.existsSync('_site/bootstrap')){fs.mkdirSync('_site/bootstrap');}
    if (!fs.existsSync('_site/bootstrap/css')){fs.mkdirSync('_site/bootstrap/css');}

    const cssFiles = ["bootstrap/css/bootstrap.css", "bootstrap/css/bootstrap-icons.css", "styles.css"]
    // Add in your file types here
    const sourceContent = [
        '**/*.njk',
        '**/*.json'
    ];

    cssFiles.forEach(sourcePath => {
        const destinationPath = "_site/" + sourcePath;
        fs.readFile(sourcePath, (err, css) => {
            postCSS([
                purgeCSS({
                  content: sourceContent,
                  variables: true,
                  keyframes: true
                })
            ])
            .process(css, {
              from: sourcePath,
              to: destinationPath
            })
            .then(result => {
                let newCSS = result.css;
                let compiledCSS = new MinifyCSS().minify(newCSS)['styles'];
                fs.writeFileSync(destinationPath, compiledCSS, {encoding:"utf8"})
            })
            .catch(error => {
              console.log(error)
            });
        })
    })
}