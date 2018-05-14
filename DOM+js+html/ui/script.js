'use strict';
let usedID = new Set(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",])

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
        return a.createdAt - b.createdAt;
    }

    function getPhotoPosts(skip, top, filterConfig) {
        let filteredPosts = [];
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
                if (photoPosts[i].isDeleted === false) {
                    if (filtfunc(photoPosts[i], filterConfig)) {
                        filteredPosts.push(photoPosts[i]);
                    }
                }
            }
        }
        else {
            for (let i = 0; i < photoPosts.length; i++) {
                if (photoPosts[i].isDeleted === false) {
                    filteredPosts.push(photoPosts[i]);
                }
            }
        }
        return filteredPosts.slice(skip, skip + top);
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
            if (!usedID.has(photoPost.id)) {
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

    return {
        addPhotoPost,
        getPhotoPosts,
        removePhotoPost,
        editPhotoPost
    }
}());