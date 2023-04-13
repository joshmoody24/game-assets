const Image = require("@11ty/eleventy-img");
const glob = require("glob-promise");

async function generateImages() {

    console.log("beginning thumbnail generation")

    const THUMBNAIL = 300;
    const FULL = 1280;

	let options = {
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
    eleventyConfig.addPassthroughCopy("images/**");
    eleventyConfig.addPassthroughCopy({"assets/**/*.blend": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.png": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.webp": "img"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.jpg": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.wav": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.mp3": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.ogg": "files"});

    // Unsorted items (in whatever order they were added)
    eleventyConfig.addCollection("gameAssets", function(collectionApi) {
        return collectionApi.getAll().filter(p => p.url.includes('assets')).sort((a,b) => a.title < b.title ? -1 : 1);
    });

    eleventyConfig.on('beforeBuild', async () => {
        await generateImages();
    })
};

