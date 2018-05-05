'use strict';
let lastLoadedPostsAmount = 0;

let dom = (function () {

    function setUser(username) {
        if ((currentUser === null || currentUser === username) && username !== "" && username !== null && username !== undefined) {
            currentUser = username;

            let element = document.getElementById('addedit');
            element.style.display = "inline-block";
            element.addEventListener('click', eve.add);

            document.getElementById('usericon').setAttribute('src', 'images/face.jpg');
            document.getElementById('username').style.display = "inline-block";
            document.getElementById('username').innerHTML = username;
            document.getElementById('log').innerHTML = "Log out";
            showPostsToHtml();
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            return 0;
        }
        else {
            document.getElementById('addedit').style.display = "none";
            document.getElementById('usericon').setAttribute('src', 'images/user.png');
            document.getElementById('username').style.display = "none";
            document.getElementById('log').innerHTML = "Sign in";
            currentUser = null;
            showPostsToHtml();
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
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

    function showPostsToHtml(filterConfig) {
        lastFilterConfig = filterConfig;
        let column = document.getElementById('column');
        while (column.firstChild) {
            column.removeChild(column.firstChild);
        }
        let htmlPhotoPosts = js.getPhotoPosts(0, 10 + lastLoadedPostsAmount, filterConfig);
        for (let i = 0; i < htmlPhotoPosts.length; i++) {
            column.appendChild(generatePostToHtml(htmlPhotoPosts[i]));
        }
        return 0;
    }

    function addMorePosts() {
        let htmlPhotoPosts = js.getPhotoPosts(lastLoadedPostsAmount, 10, lastFilterConfig);
        lastLoadedPostsAmount += htmlPhotoPosts.length;
        for (let i = 0; i < htmlPhotoPosts.length; i++) {
            let column = document.getElementById("column");
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

    function generatePostToHtml(photoPostToLoad) {
        let post = document.createElement("div");
        post.className = "post";
        post.id = photoPostToLoad.id;
        post.innerHTML =
            "<div class=\"userphoto\">\n" +
            "   <img src=\"images/user.png\"/>\n" +
            "   <div>" + photoPostToLoad.author + "</div>\n" +
            "   <div class=\"date\">" + photoPostToLoad.createdAt.toLocaleDateString() + " " + photoPostToLoad.createdAt.toLocaleTimeString() + "</div>\n" +
            "</div>\n" +
            "<img src=" + photoPostToLoad.photolink + " class=\"photopost\">\n" +
            "<div>\n" +
            "   <button class='photobutton like'><img src=\"images/like.jpg\" class=\"like\"></button><span style='font-size: 180%' class='likesCount'> " + photoPostToLoad.likes.length + "</span>"
            + ((currentUser !== null && currentUser === photoPostToLoad.author) ? "\n<button class='photobutton edit'><img src=\"images/edit.png\" class=\"edit\"></button>" : " ")
            + ((currentUser !== null && currentUser === photoPostToLoad.author) ? "\n<button class='photobutton delete'><img src=\"images/bin.jpg\" class=\"del\"></button>" : " ") +
            "\n</div>\n" +
            "<hr>\n" +
            "<div>\n" +
            "   <div class=\"hashtags\">\n" + allHashtags(photoPostToLoad.hashtags) + "</div>\n"
            + photoPostToLoad.description +
            "</div>";
        let element = post.getElementsByClassName('like')[0];
        element.addEventListener('click', eve.like);
        element = post.getElementsByClassName('edit')[0];
        if (element !== undefined) {
            element.addEventListener('click', eve.edit);
            element = post.getElementsByClassName('del')[0];
            element.addEventListener('click', eve.del);
        }
        return post;
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
                localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
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
        set.add("");
        let activePhotoPosts = js.getPhotoPosts(0, photoPosts.length);
        for (let i = 0; i < activePhotoPosts.length; i++) {
                set.add(activePhotoPosts[i].author);
        }
        let authornames = document.getElementById("authornames");
        while (authornames.firstChild) {
            authornames.removeChild(authornames.firstChild);
        }
        set.forEach(function (value) {
            authornames.innerHTML += "<option>" + value + "</option>";
        });
    }

    function hashtagsSelect() {
        let set = new Set();
        set.add("");
        let activePhotoPosts = js.getPhotoPosts(0, photoPosts.length);
        for (let i = 0; i < activePhotoPosts.length; i++) {
            activePhotoPosts[i].hashtags.forEach(function (value) {
                set.add(value);
            });
        }
        let hashs = document.getElementById("hashtags");
        while (hashs.firstChild) {
            hashs.removeChild(hashs.firstChild);
        }
        set.forEach(function (value) {
            hashs.innerHTML += "<option>" + value + "</option>";
        });
    }

    function addLike(id) {
        if (!js.editPhotoPost(id, {likes: [currentUser]})) {
            return -1;
        }
        let post = document.getElementById(id);
        if (post === null) {
            return -1;
        }
        let lc = post.getElementsByClassName("likesCount")[0];
        for (let i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id == id) {
                lc.innerHTML = photoPosts[i].likes.length.toString();
                break;
            }
        }
        return 0;
    }

    function addMainPageEventListeners() {
        let more = document.getElementById('more');
        more.addEventListener('click', eve.addMore);
        let log = document.getElementById('log');
        log.addEventListener('click', eve.log);
    }


    function clearPage() {
        let content = document.getElementById('content');
        while (content.hasChildNodes()) {
            content.removeChild(content.firstChild)
        }
    }

    function loadMainPage(user) {
        clearPage();
        let content = document.getElementById('content');
        let filter = document.createElement('aside');
        filter.id = "mainPageAside";
        filter.innerHTML =
            "<form>\n" +
            "<div>\n" +
            "<h6 class='filternames'>Authors name:</h6>\n" +
            "<input class='textinput' placeholder='Author' name='author' size='20'>\n" +
            "<select class='textinput' id='authornames' name='authorselect' onchange='this.form.author.value += this.form.authorselect.value  + \" \"'></select>\n" +
            "</div>\n" +
            "<div>\n" +
            "<h6 class='filternames'>Date:</h6>\n" +
            "<input class='textinput' placeholder='27/2/2018' name='date' size='20'>\n" +
            "</div>\n" +
            "<div>\n" +
            "<h6 class='filternames'>Hashtags:</h6>\n" +
            "<input class='textinput' placeholder='Hashtags' name='hashtagsname' size='20'>\n" +
            "<select id='hashtags' class='textinput' name='hashtagsselect' onchange='this.form.hashtagsname.value += this.form.hashtagsselect.value  + \" \"'></select>\n" +
            "</div>\n" +
            "<input type='button' value='Filter' id='filterbutton'" +
            " onclick='return eve.correctFilter( this.form.author.value, this.form.date.value, this.form.hashtagsname.value )'>\n" +
            "</form>\n";
        content.appendChild(filter);
        let main = document.createElement('main');
        main.id = "mainPageMain";
        main.innerHTML =
            "<div id='column'>\n" +
            "</div>\n" +
            "<div><button><img id='more' src='images/arrow.jpg'></button></div>";
        content.appendChild(main);

        lastLoadedPostsAmount = 0;

        authorsSelect();
        hashtagsSelect();
        addMainPageEventListeners();
        setUser(user);
    }

    function loadLoginPage() {
        clearPage();
        let content = document.getElementById('content');
        let loginForm = document.createElement('form');
        loginForm.id = 'loginform';
        loginForm.innerHTML =
            "<h1>PortalPhoto</h1>\n" +
            "<p><input type='text' name='login' placeholder='Login' required></p>\n" +
            "<p><input type='password' name='password' placeholder='Password' required></p>\n" +
            "<p><input type='submit' name='submit' value='Submit' onclick='return js.checkLog(this.form.login.value, this.form.password.value)'></p>\n";
        content.appendChild(loginForm);
    }

    function loadAddEditPage(pid) {
        clearPage();
        let post = new Photopost(js.getFreeId(), "", new Date(), currentUser, "images/face.jpg", new Set([]), new Set([]));
        if (pid !== undefined) {
            post = js.getPhotoPost(pid);
        }
        let content = document.getElementById('content');
        let loginForm = document.createElement('aside');
        loginForm.id = 'addeditfilter';
        loginForm.innerHTML =
            "<form>\n" +
            "<div id='description'>\n" +
            "<h6 class='filternames'>Description:</h6>\n" +
            "<textarea id='descriptionText' maxlength='300' name='description' placeholder='Enter Description'>" + post.description + "</textarea>\n" +
            "</div>\n" +
            "<div id='hashtagsAddEdit'>\n" +
            "<h6 class='filternames'>Hashtags:</h6>\n" +
            "<textarea id='hashtagsAddEditText' maxlength='100' name='hashtags' placeholder='Enter Hashtags'>" + allHashtags(post.hashtags) + "</textarea>\n" +
            "</div>\n" +
            "<input type='button' value='Save' id='filterbuttonAddEdit' onclick='return js.savePost(this.form.description.value, this.form.hashtags.value," + pid + ")'>\n" +
            "</form>\n";
        content.appendChild(loginForm);

        let main = document.createElement('main');
        main.id = 'addeditmain';
        main.innerHTML =
            "<div id='addeditPost'>\n" +
            "<div class='userphoto'>\n" +
            "<img src='images/user.png'>\n" +
            "<div>" + post.author + "</div>\n" +
            "<div class='date'>" + post.createdAt.toLocaleDateString() + " " + post.createdAt.toLocaleTimeString() + "</div>\n" +
            "</div>\n" +
            "<img src=" + post.photolink + " id='addeditPhoto'>\n" +
            "</div>\n";
        content.appendChild(main);
    }

    function loadSite() {
        if (localStorage.length === 0) {
            localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
            localStorage.setItem('usedID', JSON.stringify(usedID));
        }
        let tempPhotoPosts = JSON.parse(localStorage.getItem('photoPosts'), function (key, value) {
            if (key == 'createdAt')
                return new Date(value);
            return value;
        });
        for (let i = 0; i < tempPhotoPosts.length; i++) {
            photoPosts[i] = new Photopost(tempPhotoPosts[i].id, tempPhotoPosts[i].description,
                tempPhotoPosts[i].createdAt, tempPhotoPosts[i].author, tempPhotoPosts[i].photolink,
                tempPhotoPosts[i].likes, tempPhotoPosts[i].hashtags, tempPhotoPosts[i].isDeleted);
        }
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        usedID = JSON.parse(localStorage.getItem('usedID'));
        if (photoPosts === null) {
            photoPosts = [];
        }
        loadMainPage(currentUser)
    }

    loadSite();
    return {
        showPostsToHtml,
        setUser,
        deletePostFromHtml,
        addLike,
        addMorePosts,
        loadMainPage,
        loadLoginPage,
        loadAddEditPage
    }
}());
