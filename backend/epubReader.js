const fs = require('fs');
const unzipper = require('unzipper');

const unzipEpub = async (epubFilePath, outputDir) => {
    try {
        await fs.createReadStream(epubFilePath)
            .pipe(unzipper.Extract({ path: outputDir }))
            .promise();
        console.log('EPUB extracted successfully.');
    } catch (error) {
        console.error('Error extracting EPUB:', error);
    }
};

// unzipEpub(epubFilePath, outputDir);