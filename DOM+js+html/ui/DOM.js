let currentUser = null;
let setuser = "Vasia";
let dom = (function () {
    function setUser(username) {

        let isLogged = (currentUser !== null);
        if (!isLogged && username !== "" && username !== null) {
            currentUser = username;
            document.getElementById('addedit').style.display = "block";
            document.getElementById('usericon').setAttribute('src', 'images/face.jpg');
            document.getElementById('username').style.display = "inline-block";
            document.getElementById('username').innerHTML = username;
            document.getElementById('log').innerHTML = "Log out";
            showPostsToHtml();
            return 0;
        }
        else if (isLogged) {
            document.getElementById('addedit').style.display = "none";
            document.getElementById('usericon').setAttribute('src', 'images/user.png');
            document.getElementById('username').style.display = "none";
            document.getElementById('log').innerHTML = "Sign in";
            currentUser = null;
            showPostsToHtml();
            return 0;
        }
    }

    function allHashtags(set) {
        let str = "";
        set.forEach(function (value) {
            str += value + " ";
        });
        return str;
    }

    function generatePostToHtml(photoPostToLoad) {
        let post = document.createElement("div");
        post.className = "post";
        post.id = photoPostToLoad.id;
        post.innerHTML =
            "<div class=\"userphoto\">\n" +
            "   <img src=\"images/user.png\"/>\n" +
            "   <div>" + photoPostToLoad.author + "</div>\n" +
            "   <div class=\"date\">" + photoPostToLoad.createdAt.toLocaleDateString() + "</div>\n" +
            "</div>\n" +
            "<img src=" + photoPostToLoad.photolink + " class=\"photopost\">\n" +
            "<div>\n" +
            "   <img src=\"images/like.jpg\" class=\"like\"><span style='font-size: 180%' class='likesCount'> " + photoPostToLoad.likes.size + "</span>"
            + ((currentUser !== null && currentUser === photoPostToLoad.author) ? "\n<img src=\"images/edit.png\" class=\"edit\">" : " ")
            + ((currentUser !== null && currentUser === photoPostToLoad.author) ? "\n<img src=\"images/bin.jpg\" class=\"delete\">" : " ") +
            "\n</div>\n" +
            "<hr>\n" +
            "<div>\n" +
            "   <div class=\"hashtags\">\n" + allHashtags(photoPostToLoad.hashtags) + "</div>\n"
            + photoPostToLoad.description +
            "</div>";
        return post;
    }

    function showPostsToHtml() {
        let column = document.getElementById('column');
        while (column.firstChild) {
            column.removeChild(column.firstChild);
        }
        let htmlPhotoPosts = js.getPhotoPosts();
        for (let i = 0; i < htmlPhotoPosts.length; i++) {
            column.appendChild(generatePostToHtml(htmlPhotoPosts[i]));
        }
        return 0;
    }

    function addPostToHtml(photoPost) {
        if (!js.addPhotoPost(photoPost)) {
            return -1;
        }
        let column = document.getElementById("column");
        column.insertBefore(generatePostToHtml(photoPost), column.firstChild);
        lastLoadedPostsAmount += 1;
        authorsSelect();
        hashtagsSelect();
        return 0;
    }
	
    function deletePostFromHtml(id) {
        let container = document.getElementById('column');
        let post = document.getElementById(id);
        if (!container.removeChild(post)) {
            return -1;
        }
        for (let i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id == id) {
                photoPosts[i].isDeleted = true;
                authorsSelect();
                hashtagsSelect();
                return 0;
            }
        }
    }

    function editPostFromHtml(id, change) {
        if (!js.editPhotoPost(id, change)) {
            return -1;
        }
        hashtagsSelect();
        showPostsToHtml();
    }


    function authorsSelect() {
        let set = new Set();
        let activePhotoPosts = js.getPhotoPosts(0, Photopost.length);
        for (let i = 0; i < activePhotoPosts.length; i++) {
            set.add(activePhotoPosts[i].author);
        }

        let authornames = document.getElementById("authornames");
        while (authornames.firstChild) {
            authornames.removeChild(an.firstChild);
        }
        set.forEach(function (value) {
            authornames.innerHTML += "<option>" + value + "</option>";
        });

    }

    function hashtagsSelect() {
        let set = new Set();
        let activePhotoPosts = js.getPhotoPosts(0, Photopost.length);
        for (let i = 0; i < activePhotoPosts.length; i++) {
            activePhotoPosts[i].hashtags.forEach(function (value) {
                set.add(value);
            });
        }
        let hashs = document.getElementById("hashtags");
        while (hashs.firstChild) {
            hashs.removeChild(an.firstChild);
        }
        set.forEach(function (value) {
            hashs.innerHTML += "<option>" + value + "</option>";
        });
    }

    function addLike(id, author) {
        if (!js.editPhotoPost(id, {likes: new Set(author)})) {
            return -1;
        }
        let post = document.getElementById(id);
        if (post === null) {
            return -1;
        }
        let lc = post.getElementsByClassName("likesCount")[0];
        for (let i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id == id) {
                lc.innerHTML = photoPosts[i].likes.size.toString();
                break;
            }
        }
    }

    return {
        addPostToHtml,
        showPostsToHtml,
        setUser,
        deletePostFromHtml,
        editPostFromHtml,
        authorsSelect,
        hashtagsSelect,
        addLike
    }
}());

debugger;
dom.showPostsToHtml();
debugger;
dom.setUser(setuser);
debugger;
dom.authorsSelect();
debugger;
dom.hashtagsSelect();
debugger;
dom.addPostToHtml(new Photopost("1000", "description100", new Date("2010-01-26T23:00:00"), "Phillip", "images/face.jpg", new Set(["Vasia", "Dima"]), new Set(["#col", "#218"])));
debugger;
dom.deletePostFromHtml("5");
debugger;
dom.editPostFromHtml("2", {description: 'update description', hashtags: new Set(["#phil"])});
debugger;
dom.addLike("2", new Set(["Phil"])); // add like
debugger;
dom.addLike("1000", new Set(["Vasia"])); //delete like
debugger;
dom.setUser();//log off
debugger;
dom.deletePostFromHtml("1000");
