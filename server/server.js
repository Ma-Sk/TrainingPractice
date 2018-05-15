let express = require('express');
let fs = require("fs");
let bodyParser = require('body-parser');

const app = express();
const port = 3000;
let dataPath = '../server/data/posts.json';
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

function readPostsString() {
    return new Promise((resolve, reject) => {
        fs.readFile(dataPath, (err, postsString) => {
            if (err) {
                reject(err);
            } else {
                let photoPosts = JSON.parse(postsString, function (key, value) {
                    if (key === 'createdAt') {
                        return new Date(value);
                    }
                    return value;
                });
                resolve(photoPosts);
            }
        });
    });
}

function writePostsString(photoPosts) {
    return new Promise((resolve, reject) => {
        fs.writeFile(dataPath, JSON.stringify(photoPosts), err => {
            if (err) {
                reject(err);
            } else {
                resolve('Operation successfull');
            }
        });
    });
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

    return true;
}

async function addPhotoPost(photoPost) {
    let allPostsString = await readPostsString();

    if (validatePhotoPost(photoPost)) {
        allPostsString.push(photoPost);
        await writePostsString(allPostsString);
        return true;
    }
    return false;
}

async function getPhotoPost(id) {
    let allPostsString = await readPostsString();

    for (let i = 0; i < allPostsString.length; i++) {
        if (allPostsString[i].id === id && !allPostsString[i].isDeleted) {
            return allPostsString[i];
        }
    }
}

async function editPhotoPost(id, photoPostChange) {
    let allPostsString = await readPostsString();

    let postToEdit = await getPhotoPost(id);

    if (postToEdit === undefined) {
        return false;
    }

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
    await writePostsString(allPostsString);
    return flag;
}

async function removePhotoPost(id) {
    let allPostsString = await readPostsString();

    for (let i = 0; i < allPostsString.length; i++) {
        if (allPostsString[i].id === id) {
            allPostsString[i].isDeleted = true;
            await writePostsString(allPostsString);
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

async function getPhotoPosts(skip, top, filterConfig) {
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

    let stringOfPosts = await readPostsString();

    stringOfPosts.sort(datesort);
    if (typeof(filterConfig) !== 'undefined') {
        for (let i = 0; i < stringOfPosts.length; i++) {
            if (!stringOfPosts[i].isDeleted) {
                if (filtfunc(stringOfPosts[i], filterConfig)) {
                    filteredPosts.push(stringOfPosts[i]);
                }
            }
        }
    }
    else {
        filteredPosts = stringOfPosts.filter(element => {
            return !element.isDeleted;
        });
    }
    return filteredPosts.slice(skip, skip + top);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('../public'));


app.get('/getPhotoPost/:id', async function (req, res) {
    let post = await getPhotoPost(req.params.id);
    if (post !== undefined) {
        res.send(post);
    }else {
        res.status(404).send('Photopost not found');
    }
});

app.post('/getPhotoPosts', async function (req, res) {
    let skip = req.query.skip;
    let top = req.query.top;
    let filterConfig = req.body;
    let photoPosts = await getPhotoPosts(skip, top, filterConfig);
    if (photoPosts !== undefined) {
        res.send(photoPosts);
    } else {
        res.status(404).send('Photopost not found');
    }
});

app.post('/addPhotoPost', async function (req, res) {
    if (await addPhotoPost(req.body)) {
        res.send('Photopost was successfully added');
    }else {
        res.status(400).send('Operation failed');
    }
});

app.put('/editPhotoPost/:id', async function (req, res) {
    if (await editPhotoPost(req.params.id, req.body)) {
        res.send('Photopost was successfully edited');
    } else{
        res.status(400).send('Operation failed');
    }
});

app.delete('/removePhotoPost/:id', async function (req, res) {
    if (await removePhotoPost(req.params.id)) {
        res.send('Photopost was successfully deleted');
    }else {
        res.status(400).send('Operation failed');
    }
});

app.listen(port, function () {
    console.log('Server is running at port ' + port);
});
