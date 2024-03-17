const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");
const path = require('path');

async function generateImages() {

    console.log("beginning thumbnail generation")

    const THUMBNAIL = 480;
    const FULL = 1280;

	const options = {
		widths: [THUMBNAIL,FULL],
        outputDir: "_site/img/",
		formats: ['webp'],
		filenameFormat:function(id, src, width, format, options) {
			let origFilename = src.split('/').pop();
			//strip off the file type, this could probably be one line of fancier JS
			let parts = origFilename.split('.');
			parts.pop();
			origFilename = parts.join('.');

			if(width === THUMBNAIL) return `${origFilename}-thumb.${format}`;
			else return `${origFilename}.${format}`;
		}
	};

	let files = await glob('assets/**/*.webp');

    for(const f of files) {
		console.log('generating thumbnail for',f);
		let md = await Image(f, options);
	};

    console.log("thumbnail generation completed");
}

module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("styles.css");
    eleventyConfig.addPassthroughCopy({"bootstrap/js/*.js": "bootstrap/js"});
    eleventyConfig.addPassthroughCopy({"bootstrap/css/fonts/*": "bootstrap/css/fonts"});
    eleventyConfig.addPassthroughCopy("images/**");
    eleventyConfig.addPassthroughCopy("branding/**");
    eleventyConfig.addPassthroughCopy({"assets/**/*.blend": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.png": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.webp": "img"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.jpg": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.wav": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.mp3": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.ogg": "files"});
    eleventyConfig.addPassthroughCopy("robots.txt")

    eleventyConfig.addCollection("gameAssets", function(collectionApi) {
                // Use getAll to fetch all items and then filter or manipulate as needed
                const allItems = collectionApi.getAll();
        
                // Log the total number of items found
                console.log("Total items in collection:", allItems.length);
                console.log(allItems.filter(a => !a.url.includes('assets')).map(a => a.url));
        const assets = collectionApi.getAll().filter(item => {
            const assetPath = path.dirname(item.filePathStem);
            const category = assetPath.split('/').pop();
            return item.url.includes('assets') && category;
        }).map(item => {
            const assetPath = path.dirname(item.filePathStem);
            const category = assetPath.split('/').pop();
            item.data.category = category;
            return item;
        }).sort((a, b) => a.data.title < b.data.title ? -1 : 1);
        return assets;
    });

    eleventyConfig.on('beforeBuild', async () => {
        await generateImages();
    })
};

