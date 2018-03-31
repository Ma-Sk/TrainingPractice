'use strict';
let usedID = new Set(["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",])
function Photopost(id, description, createdAt, author, photolink, likes, hashtags) {
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
    this.likes = new Set(likes) || new Set([]);
    this.hashtags = hashtags || [];
    this.isDeleted = false;
}

let photoPosts = [
    new Photopost("1", "description1", new Date("2018-02-26T23:00:00"), "Dima", "images/face.jpg", new Set(["Vasia"]), new Set(["#cool", "#2018"])),
    new Photopost("2", "description2", new Date("2017-02-26T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("3", "description3", new Date("2018-03-14T16:20:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#soocool", "#2020"])),
    new Photopost("4", "description4", new Date("2019-02-26T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia"]), new Set(["#cool", "#2018"])),
    new Photopost("5", "description5", new Date("2015-02-26T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#cool", "#2017"])),
    new Photopost("6", "description6", new Date("2018-03-26T23:00:00"), "Vasia", "images/face.jpg", new Set(["Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("7", "description7", new Date("2018-01-26T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("8", "description8", new Date("2018-04-26T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("9", "description9", new Date("2018-02-22T23:00:00"), "Vasia", "images/face.jpg", new Set(["Dima"]), new Set(["#cool", "#2018"])),
    new Photopost("10", "description10", new Date("2018-02-23T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("11", "description11", new Date("2018-02-21T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("12", "description12", new Date("2018-03-14T16:20:00"), "Vasia", "images/face.jpg", new Set(["Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("13", "description13", new Date("2018-02-19T23:00:00"), "Dima", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#soocool", "#2017"])),
    new Photopost("14", "description14", new Date("2018-02-27T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#2017"])),
    new Photopost("15", "description15", new Date("2018-03-14T16:20:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#soocool", "#2017"])),
    new Photopost("16", "description16", new Date("2018-03-14T16:20:00"), "Vasia", "images/face.jpg", new Set(["Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("17", "description17", new Date("2018-02-17T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia"]), new Set(["#cool", "#2018"])),
    new Photopost("18", "description18", new Date("2018-02-16T23:00:00"), "Vasia", "images/face.jpg", new Set(["Dima"]), new Set(["#cool", "#2018"])),
    new Photopost("19", "description19", new Date("2018-02-15T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#cool", "#2018"])),
    new Photopost("20", "description20", new Date("2018-02-14T23:00:00"), "Vasia", "images/face.jpg", new Set(["Vasia", "Petia"]), new Set(["#cool", "#2018"]))
];
let js = (function () {

    function datesort(a, b) {
        let dif = a.createdAt - b.createdAt;
        if (dif > 0) {
            return 1;
        }
        if (dif < 0) {
            return -1;
        }
        return 0;
    }

    function getPhotoPosts(skip, top, filterConfig) {
        let buffmass1 = [];
        skip = skip || 0;
        if (typeof(skip) !== "number") {
            skip = 0;
        }
        top = top || 10;
        if (typeof(top) !== "number") {
            top = 0;
        }
        photoPosts.sort(datesort);
        if (typeof(filterConfig) !== "undefined") {
            for (let i = 0; i < photoPosts.length; i++) {
                if(photoPosts[i].isDeleted === false) {
                    if (filtfunc(photoPosts[i], filterConfig)) {
                        buffmass1.push(photoPosts[i]);
                    }
                }
            }
        }
        else {
            for (let i = 0; i < photoPosts.length; i++) {
                if (photoPosts[i].isDeleted === false) {
                    buffmass1.push(photoPosts[i]);
                }
            }
        }
        return buffmass1.slice(skip, skip + top);
    }

    function getPhotoPost(id) {
        for (let i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id === id) {
                return photoPosts[i];
            }
        }
    }

    function filtfunc(param, filterConfig) {
        if (filterConfig.author !== undefined) {
            if (typeof(filterConfig.author) === "string") {
                if (filterConfig.author !== param.author) {
                    return false;
                }
            }
        }
        if (filterConfig.createdAt !== undefined) {
            if (typeof(filterConfig.createdAt) === "object") {
                if (filterConfig.createdAt.getFullYear() !== param.createdAt.getFullYear()
                    || filterConfig.createdAt.getMonth() !== param.createdAt.getMonth()
                    || filterConfig.createdAt.getDate() !== param.createdAt.getDate()) {
                    return false;
                }
            }
        }

        function haveHashtag(value) {
            return (param.hashtags.has(value))
            // for (let j = 0; j < param.hashtags.length; j++) {
            //     if (param.hashtags[j] === value) {
            //         return true;
            //     }
            // }
            // return false;
        }

        if (filterConfig.hashtags !== undefined) {
            let hashtags = Array.from(filterConfig.hashtags);
            if (Array.isArray(hashtags)) {
                return hashtags.some(haveHashtag)
            }
            else
                return false;
        }
        return true;
    }

    function correctHashtag(val) {
        if (val.charAt(0) === "#") {
            for (let i = 0; i < val.length; i++) {
                if (val.charAt(i) === " ") {
                    return false;
                }
            }
            return true;
        }
        else return false;
    }

    function validatePhotoPost(photoPost) {
        if (typeof(photoPost.id) !== "string"
            || typeof(photoPost.description) !== "string"
            || photoPost.createdAt == "Invalid Date"
            || typeof(photoPost.author) !== "string"
            || typeof(photoPost.photolink) !== "string")
            return false;

        if (typeof(photoPost.likes) === "object") {
            for (let val of photoPost.likes) {
                if (typeof(val) !== "string") {
                    return false;
                }
            }
        }
        else return false;
        let hashtags = Array.from(photoPost.hashtags);
        if (Array.isArray(hashtags)) {
            if (!hashtags.every(correctHashtag)) {
                return false;
            }
        }
        else return false;

        return true;
    }

    function addPhotoPost(photoPost)//: boolean
    {
        if (validatePhotoPost(photoPost)) {
            if(!usedID.has(photoPost.id)) {
                photoPosts.push(photoPost);
                usedID.add(photoPost.id);
                return true;
            }
        }
        return false;
    }

    function editPhotoPost(id, photoPostChange)//: boolean
    {
        let i, j;
        let flag = false;
        for (i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id == id) {
                if (validatePhotoPost(photoPosts[i])) {
                    if (photoPostChange.description !== undefined) {
                        if (typeof(photoPostChange.description) === "string") {
                            photoPosts[i].description = photoPostChange.description;
                            flag = true;
                        }
                    }
                    if (photoPostChange.photolink !== undefined) {
                        if (typeof(photoPostChange.photolink) === "string") {
                            photoPosts[i].photolink = photoPostChange.photolink;
                            flag = true;
                        }
                    }
                    if (photoPostChange.hashtags !== undefined) {
                        let hashtags = Array.from(photoPostChange.hashtags);
                        if (Array.isArray(hashtags)) {
                            for (j = 0; j < hashtags.length; j++) {
                                if (typeof(hashtags[j]) === "string") {
                                    if (correctHashtag(hashtags[j])) {
                                        if (photoPosts[i].hashtags.has(hashtags[j])) {
                                            photoPosts[i].hashtags.delete(hashtags[j]);
                                            flag = true;
                                        }
                                        else {
                                            photoPosts[i].hashtags.add(hashtags[j]);
                                            flag = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (photoPostChange.likes !== undefined) {
                        let likes = Array.from(photoPostChange.likes);
                        if (Array.isArray(likes)) {
                            for (j = 0; j < likes.length; j++) {
                                if (typeof(likes[j]) === "string") {
                                    if (photoPosts[i].likes.has(likes[j])) {
                                        photoPosts[i].likes.delete(likes[j]);
                                        flag = true;
                                    }
                                    else {
                                        photoPosts[i].likes.add(likes[j]);
                                        flag = true;
                                    }
                                }
                            }
                            // photoPosts[i].likes.length = 0;
                            // for (j = 0; j < photoPostChange.likes.length; j++) {
                            //     if (typeof(photoPostChange.likes[j]) === "string") {
                            //         photoPosts[i].likes.push(photoPostChange.likes[j]);
                            //         flag = true;
                            //     }
                            // }
                        }
                    }
                    break;
                }
            }
        }
        return flag;
    }

    function removePhotoPost(id) {
        let i;
        for (i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id === id) {
                photoPosts.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    // console.log("\n\n\nget photoposts true");
    // let ob0_1 = new Photopost("101", "description51", new Date("2018-03-14T16:20:00"), "Dima", "link", new Set([]), new Set(["#cool", "#2017"]));
    // console.log(addPhotoPost(ob0_1));
    // console.log("Author\n");
    // console.log(getPhotoPosts(0, 10, {author: "Dima"}));
    // console.log("Date\n");
    // console.log(getPhotoPosts(0, 2, {createdAt: new Date("2018-03-14T16:20:00")}));
    // console.log("Hashtags\n");
    // console.log(getPhotoPosts(0, 10, {hashtags: new Set(["#2017", "soocool"])}));
    // console.log("Hashtags and date\n");
    // console.log(getPhotoPosts(0, 10, {
    //     hashtags: new Set(["#2017", "soocool"]),
    //     createdAt: new Date("2018-03-14T16:20:00")
    // }));
    // console.log(removePhotoPost("101"));
    //
    // console.log("\nget photoposts false");
    // let ob0_2 = new Photopost("102", "description52", new Date("2018-03-14T16:20:00"), "Vasia", "link", new Set([]), new Set(["#cool", "#2018"]));
    // console.log(addPhotoPost(ob0_2));
    // console.log(getPhotoPosts(0, 5, {author: "Wrong"}));
    //
    // console.log("\n\n\nget photopost true");
    // let ob_1 = getPhotoPost("4");
    // console.log(ob_1);
    //
    // console.log("\nget photopost false");
    // let ob_2 = getPhotoPost("546");
    // console.log(ob_2);
    //
    // console.log("\n\n\nvalidate photopost true");
    // let ob1_1 = new Photopost("31", "description26", new Date("2018-03-14T16:20:00"), "Vasia", "link", new Set([]), new Set(["#cool", "#2018"]));
    // console.log(validatePhotoPost(ob1_1));
    //
    // console.log("\nvalidate photopost false");
    // let ob1_2 = new Photopost("32", new Date("2018-14T16:20:00"), "Vasia", "link", new Set([]), new Set(["#cool", "#2018"]));
    // console.log(validatePhotoPost(ob1_2));
    //
    // console.log("\n\n\nadd photopost true");
    // let ob2_1 = new Photopost("41", "description22", new Date("2018-03-14T16:20:00"), "Vasia", "link", new Set([]), new Set(["#cool", "#2018"]));
    // console.log(addPhotoPost(ob2_1));
    // console.log(getPhotoPost("41"));
    //
    // console.log("\nadd photopost false");
    // let ob2_2 = new Photopost("42", new Date("2018-03-14T16:20:00"), "Vasia", "link", new Set([]), new Set(["#cool", "#2018"]));
    // console.log(addPhotoPost(ob2_2));
    // console.log(getPhotoPost("42"));
    //
    // console.log("\n\n\nedit photopost true");
    // let ob3_1 = new Photopost("51", "description51", new Date("2018-03-14T16:20:00"), "Vasia", "link", new Set([]), new Set(["#cool", "#2018"]));
    // console.log(addPhotoPost(ob3_1));
    // console.log(ob3_1);
    // console.log(editPhotoPost("51", {
    //     photolink: 'update photolink',
    //     description: 'update description',
    //     hashtags: new Set(["#soocool", "#2010", "#2018"]),
    //     likes: new Set(["Mike", "Phil"])
    // }));
    // console.log(getPhotoPost("51"));
    // console.log(removePhotoPost("51"));
    //
    // console.log("\nedit photopost false");
    // let ob3_2 = new Photopost("52", "description52", new Date("2018-03-14T16:20:00"), "Vasia", "link", new Set([]), new Set(["#cool", "#2018"]));
    // console.log(addPhotoPost(ob3_2));
    // console.log(editPhotoPost("52", {}));
    // console.log(getPhotoPost("52"));
    //
    // console.log("\n\n\nremove photopost true");
    // let ob4 = new Photopost("61", "description22", new Date("2014-03-14T16:20:00"), "Vasia", "link", new Set([]), new Set(["#cool", "#2018"]));
    // console.log(addPhotoPost(ob4));
    // console.log(getPhotoPosts(0, 10));
    // console.log(removePhotoPost("61"));
    // console.log(getPhotoPosts(0, 10));
    //
    // console.log("\nremove photopost false");
    // console.log(removePhotoPost("1250"));
    return {
        addPhotoPost,
        getPhotoPosts,
        removePhotoPost,
        editPhotoPost
    }
}());


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
        else if(isLogged){
            document.getElementById('addedit').style.display = "none";
            document.getElementById('usericon').setAttribute('src', 'images/user.png');
            document.getElementById('username').style.display = "none";
            document.getElementById('log').innerHTML = "Sign in";
            currentUser = null;
            showPostsToHtml();
            return 0;
        }
    }

    function allHashtags(set){
        let str = "";
        set.forEach(function(value) {
            str += value + " ";
        });
        return str;
    }

    function showPostsToHtml() {
        let container = document.getElementById('column');

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        let htmlPhotoPosts = js.getPhotoPosts();
        for (let i = 0; i < htmlPhotoPosts.length; i++) {
            if(htmlPhotoPosts[i].isDeleted === false) {
                let post = document.createElement("div");
                post.className = "post";
                post.id = htmlPhotoPosts[i].id;
                post.innerHTML =
                    "<div class=\"userphoto\">\n" +
                    "   <img src=\"images/user.png\"/>\n" +
                    "   <div>" + htmlPhotoPosts[i].author + "</div>\n" +
                    "   <div class=\"date\">" + getTime(htmlPhotoPosts[i].createdAt.toString()) + "</div>\n" +
                    "</div>\n" +
                    "<img src=" + htmlPhotoPosts[i].photolink + " class=\"photopost\">\n" +
                    "<div>\n" +
                    "   <img src=\"images/like.jpg\" class=\"like\"><span style='font-size: 180%' class='likesCount'> " + htmlPhotoPosts[i].likes.size + "</span>"
                    + ((currentUser !== null && currentUser === htmlPhotoPosts[i].author) ? "\n<img src=\"images/edit.png\" class=\"edit\">" : " ")
                    + ((currentUser !== null && currentUser === htmlPhotoPosts[i].author) ? "\n<img src=\"images/bin.jpg\" class=\"delete\">" : " ") +
                    "\n</div>\n" +
                    "<hr>\n" +
                    "<div>\n" +
                    "   <div class=\"hashtags\">\n" + allHashtags(htmlPhotoPosts[i].hashtags) + "</div>\n"
                    + htmlPhotoPosts[i].description +
                    "</div>";
                let column = document.getElementById("column");
                column.appendChild(post);
            }
        }
        return 0;
    }

    function addPostToHtml(photoPost) {
        if (!js.addPhotoPost(photoPost)) {
            return -1;
        }
        let post = document.createElement("div");
        post.className = "post";
        post.id = photoPost.id;
        post.innerHTML =
            "<div class=\"userphoto\">\n" +
            "   <img src=\"images/user.png\"/>\n" +
            "   <div>" + photoPost.author + "</div>\n" +
            "   <div class=\"date\">" + getTime(photoPost.createdAt.toString()) + "</div>\n" +
            "</div>\n" +
            "<img src=" + photoPost.photolink + " class=\"photopost\">\n" +
            "<div>\n" +
            "   <img src=\"images/like.jpg\" class=\"like\"><span style='font-size: 180%' class='likesCount'> " + photoPost.likes.size + "</span>"
            + ((currentUser !== null && currentUser === photoPost.author) ? "\n<img src=\"images/edit.png\" class=\"edit\">" : " ")
            + ((currentUser !== null && currentUser === photoPost.author) ? "\n<img src=\"images/bin.jpg\" class=\"delete\">" : " ") +
            "\n</div>\n" +
            "<hr>\n" +
            "<div>\n" +
            "   <div class=\"hashtags\">\n" + allHashtags(photoPost.hashtags) + "</div>\n"
            + photoPost.description +
            "</div>";
        let column = document.getElementById("column");
        column.insertBefore(post, column.firstChild);
        authorsSelect();
        hashtagsSelect();
        return 0;
        // showPostsToHtml();
    }

    function deletePostFromHtml(id) {
        let container = document.getElementById('column');
        let post = document.getElementById(id);
        if(!container.removeChild(post)){
            return -1;
        }
        for(let i = 0; i < photoPosts.length; i++){
            if(photoPosts[i].id == id){
                photoPosts[i].isDeleted = true;
                authorsSelect();
                hashtagsSelect();
                return 0;
            }
        }
        // if (!js.removePhotoPost(id)) {
        //     return -1;
        // }
        // showPostsToHtml();
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
        for (let i = 0; i < photoPosts.length; i++) {
            if(photoPosts[i].isDeleted === false) {
                set.add(photoPosts[i].author);
            }
        }
        let an = document.getElementById("authornames");
        while (an.firstChild) {
            an.removeChild(an.firstChild);
        }
        set.forEach(function (value) {
            an.innerHTML += "<option>" + value + "</option>";
        });
    }

    function hashtagsSelect() {
        let set = new Set();
        for (let i = 0; i < photoPosts.length; i++) {
            if(photoPosts[i].isDeleted === false) {
                photoPosts[i].hashtags.forEach(function (value) {
                    set.add(value);
                });
            }
        }
        let an = document.getElementById("hashtags");
        while (an.firstChild) {
            an.removeChild(an.firstChild);
        }
        set.forEach(function (value) {
            an.innerHTML += "<option>" + value + "</option>";
        });
    }

    function addLike(id, author) {
        if (!js.editPhotoPost(id, {likes: new Set(author)})) {
            return -1;
        }
        let post = document.getElementById(id);
        if(post === null){
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

    function getTime(createdAt) {
        let date = new Date(createdAt);
        let days = date.getDate();
        if (days < 10) {
            days = '0' + days;
        }
        let months = date.getMonth() + 1;
        if (months < 10) {
            months = '0' + months;
        }
        let years = date.getFullYear();
        let hours = date.getHours();
        if (hours < 10) {
            hours = '0' + hours;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        return days + '.' + months + '.' + years + ' ' + hours + ':' + minutes;
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
dom.editPostFromHtml("2", {description: 'update description', hashtags: new Set(["#phil"]) });
debugger;
dom.addLike("2", new Set(["Phil"])); // add like
debugger;
dom.addLike("1000", new Set(["Vasia"])); //delete like
debugger;
dom.setUser();//log off
debugger;
dom.deletePostFromHtml("1000");
