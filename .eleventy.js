module.exports = function(eleventyConfig) {
    eleventyConfig.addPassthroughCopy("styles.css");
    eleventyConfig.addPassthroughCopy({"assets/**/*.blend": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.png": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.jpg": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.wav": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.mp3": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.ogg": "files"});
    eleventyConfig.addPassthroughCopy({"assets/**/*.psd": "files"});

    // Unsorted items (in whatever order they were added)
    eleventyConfig.addCollection("gameAssets", function(collectionApi) {
        return collectionApi.getAll().filter(p => p.url.includes('assets'));
    });
};