import misc from "../JS/misc.js";

function review(reviewData) {

    return `
        <div class="d-flex flex-start" style="color: var(--App-secondaryTextColor);">
            <!-- User Profile -->
            <img class="rounded-circle shadow-1-strong ms-3" src="${reviewData.user.profile}" alt="avatar" width="54" height="54"/>
            <!-- User Review -->
            <div class="flex-grow-1 flex-shrink-1">
                <div class="position-relative">
                    <!-- Username And Time -->
                    <div class="d-flex justify-content-between align-items-center p-2">
                        <p class="mb-0">
                            <a href="/users?userId=${reviewData.user.id}" class="fw-bold userNameBt ms-2">${reviewData.user.fullname}</a>
                            &#x2022;<span class="fs-6 ps-1 pe-1">${misc.timeAgo(new Date(reviewData.review.datereview), 'ar')}</span>&#x2022;
                        </p>
                    </div>
                    <!-- Review Text -->
                    <p class="small pe-2 ps-4 mb-3 rounded reviewText">${reviewData.review.review}</p>
                    <!-- Review Counts -->
                    <div class="col reviewCount">
                        <!-- Likes Count -->
                        <a class="reviewCountLike row ms-1 cursorBt" data-Id="#threadId"><i class="fa-regular fa-thumbs-up"></i>${reviewData.review.likescount}</a>
                        <!-- Reply Count -->
                        <a class="reviewCountReply row ms-1 cursorBt " data-Id="#threadId"><i class="fa-regular fa-comment"></i>${reviewData.review.commentscount}</a>
                    </div>
                    <!-- Review Options -->
                    <nav class="blog-pagination me-2" aria-label="Pagination">
                        <a class="reviewBt rounded-5 ms-2"><span class="fw-bold">جيد</span><i class="fa-regular fa-thumbs-up ms-1 me-1"></i></a>
                        <a class="reviewBt rounded-5 ms-2"><span class="fw-bold">مراجعة</span><i class="fa-regular fa-comment ms-1 me-1"></i></a>
                        <a class="reviewBt rounded-5 ms-2"><span class="fw-bold">مشاركة</span><i class="fa-regular fa-share-from-square ms-1 me-1 ps-1"></i></a>
                    </nav>
                </div>
            </div>
        </div>
    `
}

const treeItemNotNested = (reviewData) => {
    return `<li class="pt-2 userReview UserComments-tree-NotNested">${review(reviewData)}</li>`
}
const treeItemNested = () => {
    return `  <li class="userReview UserComments-tree-Nested">${review()}<ul class="UserComments-tree ps-5 pe-5 me-5">
                            <!--Placeholder for thread -->
                        </ul></li>`
}

function userReview_(nested, reviewData) {
    if (nested) {
        const data = [1, 2];
        let itemsTree = '';
        for (let i = 0; i < data.length; i++) {
            itemsTree += treeItemNotNested(reviewData);
        }
        return `
                <!-- Main Comment -->
                <div class="mt-1 UserComments-tree-Nested">${review(reviewData)}</div>
                <!-- Thread -->
                <ul class="UserComments-tree ps-5 pe-5 me-5">
                    <!--Placeholder for thread -->
                    ${itemsTree}
                </ul>
    `
    } else {
        return `<!-- Main Comment --><div class="mt-1 UserComments-tree-NotNested">${review(reviewData)}</div>`
    }
}

export default function userReview(userUUID, editable = false) {
    misc.postData('loadUserReview', {
        userId: misc.ID,
        hashedPass: misc.hashedPass,
        table: userUUID,
        book: misc.bookId
    }).then(res => {
        /***
         * Success
         * */
        if (!res.status) {
            const review = res.msg;
            const container = document.createElement('div');
            container.className = "UserComment-container pe-3";
            /***
             * Nested
             * */
            if (review.review.commentscount) {
                container.innerHTML = userReview_(true, review);
            }
            /***
             * Not Netsted
             * */
            else {
                container.innerHTML = userReview_(false, review);
            }
            book_view.UserComments.append(container);
        }
        /***
         * Fail
         * */
        else {
        }
    });
}