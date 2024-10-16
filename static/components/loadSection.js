import misc from "../JS/misc.js"
import bookCard from "./bookCard.js"

/******************
 * Main Load Routine
 * *****************/
export default function loadSection(section) {
    misc.postData(`loadUserSection`, {
        userId: misc.ID,
        hashedPass: localStorage.getItem("userPass") != null ? localStorage.getItem("userPass").slice(3) : null,
        section: section
    }).then((books) => {
        if (books.length > 0) {
            let Div = document.createElement('div');
            let Container = document.createElement('div');
            let Row = document.createElement('div');
            Div.id = "mainChild";
            Div.className = "album py-4";
            Container.className = "container";
            /*************
             * Mobile View
             * ***********/
            if (window.innerWidth <= 480) {
                Row.className = "row row-cols-3 row-cols-sm-2 row-cols-md-6 g-2 mb-4 pb-4";
            } else {
                Row.className = "row row-cols-1 row-cols-sm-2 row-cols-md-6 g-2";
            }
            Container.append(Row);
            Div.append(Container);
            mainView.append(Div);
            /*********************
             * Create Books Elements
             * **********************/
            for (let index = 0; index < books.length; index++) {
                bookCard(Row, books[index]);
            }
        }
    })
}