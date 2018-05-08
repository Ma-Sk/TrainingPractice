'use strict';
let currentUser = null;

let lastFilterConfig;

function User(login, password) {
    this.login = login;
    this.password = password;
}

let users = new Set([
    new User('Dima', '12345'),
    new User('Philip', '11111'),
    new User('Vasia', '11111')
]);
let usedID = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

function Photopost(id, description, createdAt, author, photolink, likes, hashtags, isDeleted) {
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
    this.likes = likes || [];
    this.hashtags = hashtags || [];
    if (typeof(isDeleted) === 'boolean') {
        this.isDeleted = isDeleted;
    }
    else {
        this.isDeleted = false;
    }
}

let photoPosts = [
    new Photopost('1', 'description1', new Date('2018-02-26T23:00:00'), 'Dima', 'images/face.jpg', ['Vasia'], ['#cool', '#2018']),
    new Photopost('2', 'description2', new Date('2017-02-26T23:00:00'), 'Vasia', 'images/face.jpg', ['Petia'], ['#cool', '#2018']),
    new Photopost('3', 'description3', new Date('2018-03-14T16:20:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#soocool', '#2020']),
    new Photopost('4', 'description4', new Date('2019-02-26T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia'], ['#cool', '#2018']),
    new Photopost('5', 'description5', new Date('2015-02-26T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#cool', '#2017']),
    new Photopost('6', 'description6', new Date('2018-03-26T23:00:00'), 'Vasia', 'images/face.jpg', ['Petia'], ['#cool', '#2018']),
    new Photopost('7', 'description7', new Date('2018-01-26T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('8', 'description8', new Date('2018-04-26T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('9', 'description9', new Date('2018-02-22T23:00:00'), 'Vasia', 'images/face.jpg', ['Dima'], ['#cool', '#2018']),
    new Photopost('10', 'description10', new Date('2018-02-23T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('11', 'description11', new Date('2018-02-21T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('12', 'description12', new Date('2018-03-14T16:20:00'), 'Vasia', 'images/face.jpg', ['Petia'], ['#cool', '#2018']),
    new Photopost('13', 'description13', new Date('2018-02-19T23:00:00'), 'Dima', 'images/face.jpg', ['Vasia', 'Petia'], ['#soocool', '#2017']),
    new Photopost('14', 'description14', new Date('2018-02-27T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#2017']),
    new Photopost('15', 'description15', new Date('2018-03-14T16:20:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#soocool', '#2017']),
    new Photopost('16', 'description16', new Date('2018-03-14T16:20:00'), 'Vasia', 'images/face.jpg', ['Petia'], ['#cool', '#2018']),
    new Photopost('17', 'description17', new Date('2018-02-17T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia'], ['#cool', '#2018']),
    new Photopost('18', 'description18', new Date('2018-02-16T23:00:00'), 'Vasia', 'images/face.jpg', ['Dima'], ['#cool', '#2018']),
    new Photopost('19', 'description19', new Date('2018-02-15T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#cool', '#2018']),
    new Photopost('20', 'description20', new Date('2018-02-14T23:00:00'), 'Vasia', 'images/face.jpg', ['Vasia', 'Petia'], ['#cool', '#2018'])
];

let js = (function () {

    function checkLog(log, pas) {
        let flag = false;
        users.forEach(function (value) {
            if (value.login === log && value.password === pas) {
                flag = true;
            }
        });
        if (flag === true) {
            dom.loadMainPage(log);
        } else {
            alert('Invalid login or password');
        }
    }

    function datesort(a, b) {
        return a.createdAt - b.createdAt;
    }

    function getPhotoPosts(skip, top, filterConfig) {
        let filteredPosts = [];
        skip = skip || 0;
        if (typeof(skip) !== 'number') {
            skip = 0;
        }
        top = top || 10;
        if (typeof(top) !== 'number') {
            top = 0;
        }
        photoPosts.sort(datesort);
        if (typeof(filterConfig) !== 'undefined') {
            for (let i = 0; i < photoPosts.length; i++) {
                if (!photoPosts[i].isDeleted) {
                    if (filtfunc(photoPosts[i], filterConfig)) {
                        filteredPosts.push(photoPosts[i]);
                    }
                }
            }
        }
        else {
            for (let i = 0; i < photoPosts.length; i++) {
                if (!photoPosts[i].isDeleted) {
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
        let flagAuthor = true;
        let flagHash = true;

        function haveAuthor(value) {
            return (param.author === value)
        }

        if (filterConfig.author !== undefined && filterConfig.author !== '') {
            let authors = filterConfig.author.trim().split(' ');
            if (Array.isArray(authors)) {
                flagAuthor = authors.some(haveAuthor)
            }
            else
                return false;
        }
        if (filterConfig.createdAt !== undefined && filterConfig.createdAt !== '' && filterConfig.createdAt != 'Invalid Date') {
            if (typeof(filterConfig.createdAt) === 'object') {
                if (filterConfig.createdAt.getFullYear() !== param.createdAt.getFullYear()
                    || filterConfig.createdAt.getMonth() !== param.createdAt.getMonth()
                    || filterConfig.createdAt.getDate() !== param.createdAt.getDate()) {
                    return false;
                }
            }
        }

        function haveHashtag(value) {
            for (let i = 0; i < param.hashtags.length; i++) {
                if (param.hashtags[i] === value) {
                    return true;
                }
            }
            return false;
        }

        if (filterConfig.hashtags !== undefined) {
            if (filterConfig.hashtags[0] !== '') {
                if (Array.isArray(filterConfig.hashtags)) {
                    flagHash = filterConfig.hashtags.some(haveHashtag)
                }
                else
                    return false;
            }
        }
        return flagAuthor && flagHash;
    }

    function correctHashtag(val) {
        if (val.charAt(0) === '#') {
            for (let i = 0; i < val.length; i++) {
                if (val.charAt(i) === ' ') {
                    return false;
                }
            }
            return true;
        }
        else return false;
    }

    function validatePhotoPost(photoPost) {
        if (typeof(photoPost.id) !== 'string'
            || typeof(photoPost.description) !== 'string'
            || photoPost.createdAt == 'Invalid Date'
            || typeof(photoPost.author) !== 'string'
            || typeof(photoPost.photolink) !== 'string')
            return false;
        if (typeof(photoPost.likes) === 'object') {
            for (let val of photoPost.likes) {
                if (typeof(val) !== 'string') {
                    return false;
                }
            }
        }
        else return false;
        if (Array.isArray(photoPost.hashtags)) {
            if (!photoPost.hashtags.every(correctHashtag)) {
                return false;
            }
        }
        else return false;
        return true;
    }

    function getFreeId() {
        for (let i = 0; true; i++) {
            if (usedID.indexOf(i.toString()) === -1) {
                return i.toString();
            }
        }
    }

    function savePost(descript, hash, id) {
        let goodHashtags = hash.split(' ');
        if (id === undefined) {
            addPhotoPost(new Photopost(getFreeId(), descript, new Date(),
                currentUser, 'images/face.jpg', [], goodHashtags));
        } else {
            editPhotoPost(id, {description: descript, hashtags: goodHashtags});
        }
        dom.loadMainPage(currentUser);
    }

    function addPhotoPost(photoPost) {
        if (validatePhotoPost(photoPost)) {
            photoPosts.push(photoPost);
            usedID.push(photoPost.id);
            localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
            localStorage.setItem('usedID', JSON.stringify(usedID));
            return true;
        }
        return false;
    }

    function editPhotoPost(id, photoPostChange) {
        let i, j;
        let flag = false;
        for (i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id == id) {
                if (validatePhotoPost(photoPosts[i])) {
                    if (photoPostChange.description !== undefined) {
                        if (typeof(photoPostChange.description) === 'string') {
                            photoPosts[i].description = photoPostChange.description;
                            flag = true;
                        }
                    }
                    if (photoPostChange.photolink !== undefined) {
                        if (typeof(photoPostChange.photolink) === 'string') {
                            photoPosts[i].photolink = photoPostChange.photolink;
                            flag = true;
                        }
                    }
                    if (photoPostChange.hashtags !== undefined) {
                        if (Array.isArray(photoPostChange.hashtags)) {
                            photoPosts[i].hashtags = [];
                            for (j = 0; j < photoPostChange.hashtags.length; j++) {
                                if (typeof(photoPostChange.hashtags[j]) === 'string') {
                                    if (correctHashtag(photoPostChange.hashtags[j])) {
                                        photoPosts[i].hashtags.push(photoPostChange.hashtags[j]);
                                        flag = true;
                                    }
                                }
                            }
                        }
                    }
                    if (photoPostChange.likes !== undefined) {
                        if (Array.isArray(photoPostChange.likes)) {
                            for (j = 0; j < photoPostChange.likes.length; j++) {
                                if (typeof(photoPostChange.likes[j]) === 'string') {
                                    let tempLikesSet = new Set(photoPosts[i].likes);
                                    if (tempLikesSet.has(photoPostChange.likes[j])) {
                                        tempLikesSet.delete(photoPostChange.likes[j]);
                                        flag = true;
                                    }
                                    else {
                                        tempLikesSet.add(photoPostChange.likes[j]);
                                        flag = true;
                                    }
                                    photoPosts[i].likes = Array.from(tempLikesSet);
                                }
                            }
                        }
                    }
                    break;
                }
            }
        }
        localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
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
        getPhotoPost,
        addPhotoPost,
        getPhotoPosts,
        editPhotoPost,
        checkLog,
        savePost,
        getFreeId
    }
}());

