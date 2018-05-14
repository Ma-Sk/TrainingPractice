'use strict';
let eve = (function() {
    function like(event) {
        let button = event.target;
        let id = button.closest('.post').id;
        dom.addLike(id);
    }

    function addMore() {
        dom.addMorePosts();
    }


    function correctFilter(author, date, hashtags) {
        lastLoadedPostsAmount = 0;
        let createdDate = date.trim().split('/');
        dom.showPostsToHtml({ author: author, createdAt: new Date(parseInt(createdDate[2]), parseInt(createdDate[1]) - 1, parseInt(createdDate[0])), hashtags: hashtags.trim().split(' ')});
    }
    function login() {
        if(currentUser === null){
            dom.loadLoginPage();
        }else{
            dom.setUser();
        }
    }
    function add() {
        dom.loadAddEditPage();
    }

    function edit(event) {
        let button = event.target;
        let id = button.closest('.post').id;
        dom.loadAddEditPage(id);
    }

    function del(event) {
        let button = event.target;
        let id = button.closest('.post').id;
        dom.deletePostFromHtml(id)
    }

    return {
        like,
        addMore,
        login,
        add,
        edit,
        del,
        correctFilter
    }
}());