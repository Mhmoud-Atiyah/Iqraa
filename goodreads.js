function getCover(title) {
    //TODO: do function right
    return "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1706818727i/206741391.jpg";
}

function bookAbout(title) {
    return "Set on the French Riviera in the late 1920s, Tender Is the Night is the tragic romance of the young actress Rosemary Hoyt and the stylish American couple Dick and Nicole Diver. A brilliant young psychiatrist at the time of his marriage, Dick is both husband and doctor to Nicole, whose wealth goads him into a lifestyle not his own, and whose growing strength highlights Dick's harrowing demise. A profound study of the romantic concept of character, Tender Is the Night is lyrical, expansive, and hauntingly evocative."
}

function authorData(author) {
    return {
        "birth": "21/11/1032",
        "info": "Francis Scott Key Fitzgerald was an American writer of novels and short stories, whose works have been seen as evocative of the Jazz Age, a term he himself allegedly coined. He is regarded as one of the greatest twentieth century writers. Fitzgerald was of the self-styled 'Lost Generation,' Americans born in the 1890s who came of age during World War I. He finished four novels, left a fifth unfinished, and wrote dozens of short stories that treat themes of youth, despair, and age. He was married to Zelda Fitzgerald.",
        "path": "https://www.goodreads.com/author/show/4536964.Amor_Towles"
    }
}

function createBook(id) {
    fs.writeFile(`${DATAPATH}/books/${id}.json`, `[]`, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log(`Book of Id[${id}] File Created`);
        }
    });
}