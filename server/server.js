let express = require('express');
let fs = require("fs");
let bodyParser = require('body-parser');

const app = express();
const port = 3000;

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

function getFreeId() {
    for (let i = 0; true; i++) {
        if (usedID.indexOf(i.toString()) === -1) {
            return i.toString();
        }
    }
}

function datesort(a, b) {
    return a.createdAt - b.createdAt;
}

function correctHashtag(val) {
    if (typeof(val) === 'string' && val.charAt(0) === '#') {
        for (let i = 0; i < val.length; i++) {
            if (val.charAt(i) === ' ') {
                return false;
            }
        }
        return true;
    }
    else return false;
}

function isString(val) {
    return (typeof (val) === 'string');
}

function validatePhotoPost(photoPost) {
    if (typeof(photoPost.id) !== 'string'
        || typeof(photoPost.description) !== 'string'
        || photoPost.createdAt == 'Invalid Date'
        || typeof(photoPost.author) !== 'string'
        || typeof(photoPost.photolink) !== 'string')
        return false;
    if (!(Array.isArray(photoPost.likes))) {
        return false;
    }
    if (!(Array.isArray(photoPost.hashtags))) {
        return false;
    }

    function isString(item) {
        return (typeof (item) === 'string');
    }

    if (!photoPost.hashtags.every(correctHashtag)) {
        return false;
    }
    if (!photoPost.hashtags.every(isString)) {
        return false;
    }
    // if (!photoPosts.every(item => item.id !== photoPost.id)) {
    //     return false;
    // }

    return true;
}

function addPhotoPost(photoPost) {
    let allPostsString = fs.readFileSync('./data/posts.json');
    let photoPosts = JSON.parse(allPostsString, function (key, value) {
        if (key == 'createdAt') {
            return new Date(value);
        }
        return value;
    });
    if (validatePhotoPost(photoPost)) {
        photoPosts.push(photoPost);
        fs.writeFileSync('./data/posts.json', JSON.stringify(photoPosts));
        return true;
    }
    return false;
}

function getPhotoPost(id) {
    let allPostsString = fs.readFileSync('./data/posts.json');
    let photoPosts = JSON.parse(allPostsString, function (key, value) {
        if (key === 'createdAt') {
            return new Date(value);
        }
        return value;
    });
    for (let i = 0; i < photoPosts.length; i++) {
        if (photoPosts[i].id === id) {
            return photoPosts[i];
        }
    }
}

function editPhotoPost(id, photoPostChange) {

    photoPostChange = JSON.parse(photoPostChange);

    let allPostsString = fs.readFileSync('/data/posts.json');
    let photoPosts = JSON.parse(allPostsString, function (key, value) {
        if (key == 'createdAt') {
            return new Date(value);
        }
        return value;
    });
    //
    // if (typeof (id) !== 'string') {
    //     return false;
    // }
    // if (photoPost === undefined) {
    //     return false;
    // }

    let postToEdit = getPhotoPost(id);

    if (postToEdit === undefined) {
        return false;
    }

    // buff = clone(buff);
    let flag = false;
    if (photoPostChange.description !== undefined) {
        if (typeof (photoPostChange.description) === 'string') {
            postToEdit.description = photoPostChange.description;
            flag = true;
        }
    }
    if (photoPostChange.hashtags !== undefined) {
        if (Array.isArray(photoPostChange.hashtags)) {
            postToEdit.hashtags = [];
            for(let i = 0; i < photoPostChange.hashtags.length; i++){
                if (correctHashtag(photoPostChange.hashtags[i])) {
                    postToEdit.hashtags.push(photoPostChange.hashtags[i]);
                    flag = true;
                }
            }
        }
    }
    if (photoPostChange.likes !== undefined) {
        if (Array.isArray(photoPostChange.likes) && photoPostChange.likes.every(isString)) {
            for (let j = 0; j < photoPostChange.likes.length; j++) {
                let tempLikesSet = new Set(photoPostChange.likes);
                if (tempLikesSet.has(photoPostChange.likes[j])) {
                    tempLikesSet.delete(photoPostChange.likes[j]);
                    flag = true;
                }
                else {
                    tempLikesSet.add(photoPostChange.likes[j]);
                    flag = true;
                }
                postToEdit.likes = Array.from(tempLikesSet);
            }
        }
    }
    fs.writeFileSync('/data/posts.json', JSON.stringify(photoPosts));
    return flag;
}

function removePhotoPost(id) {
    let allPostsString = fs.readFileSync('/data/posts.json');
    let photoPosts = JSON.parse(allPostsString, function (key, value) {
        if (key == 'createdAt') {
            return new Date(value);
        }
        return value;
    });

    for (let i = 0; i < photoPosts.length; i++) {
        if (photoPosts[i].id === id) {
            //photoPosts.splice(index, 1);
            photoPosts[i].isDeleted = true;
            fs.writeFileSync('/data/posts.json', JSON.stringify(photoPosts));
            return true;
        }
    }
    return false;
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

function getPhotoPosts(skip, top, filterConfig) {
    let filteredPosts = [];
    if (typeof(skip) === 'string') {
        skip = JSON.parse(skip);
    }
    if (typeof(top) === 'string') {
        top = JSON.parse(top);
    }
    if (typeof(filterConfig) === 'string') {
        filterConfig = JSON.parse(filterConfig);
    }

    skip = skip || 0;
    if (typeof (skip) !== 'number') {
        skip = 0;
    }

    top = top || 10;
    if (typeof (top) !== 'number') {
        top = 10;
    }
    let stringOfPosts = fs.readFileSync('/data/posts.json');
    let photoPosts = JSON.parse(stringOfPosts, function (key, value) {
        if (key == 'createdAt') {
            return new Date(value);
        }
        return value;
    });

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
        filteredPosts = photoPosts.filter(element => {
            return !element.isDeleted;
        });//Need to filter only deleted elements
    }
    return JSON.stringify(filteredPosts.slice(skip, skip + top));
}

app.use(bodyParser.json());
//app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('../public'));


app.get('/getPhotoPost/:id', function (req, res) {
    let post = getPhotoPost(req.params.id);
    if (post !== undefined) {
        post = JSON.stringify(post);
        res.send(200, post);
    }
    res.send(404, `Photopost not found`);
});

app.post('/getPhotoPosts', function (req, res) {
    let skip = req.query.skip;
    let top = req.query.top;
    let filterConfig = req.body;
    //filterConfig = JSON.stringify(filterConfig);
    // console.log(filterConfig);
    let photoPosts = getPhotoPosts(skip, top, filterConfig);
    if (photoPosts !== undefined) {
        res.send(200, photoPosts);
    }
    res.send(404, 'Error');
});

app.post('/addPhotoPost', function (req, res) {
    if (addPhotoPost(req.body)) {
        res.send(200, `Photopost was successfully added`);
    }
    res.send(404, `Operation failed`);
});

app.put('/editPhotoPost/:id', function (req, res) {
    if (editPhotoPost(req.params.id, req.body)) {
        res.send(200, `Photopost was successfully edited`);
    }
    res.send(404, 'Operation failed');
});

app.delete('/removePhotoPost/:id', function (req, res) {
    if (removePhotoPost(req.params.id)) {
        res.send(200, `Photopost was successfully deleted`);
    }
    res.send(404, `Operation failed`);
});

app.listen(port, function () {
    console.log('Server is running at port ' + port);
});
