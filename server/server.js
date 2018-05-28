const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require('multer');
const events = require('events');

const dispatcher = new events.EventEmitter();


const app = express();
const port = 3000;
const dataPath = '../server/data/posts.json';


const server = (function () {
  const usedID = new Set([]);

  function readPostsString() {
    return new Promise((resolve, reject) => {
      fs.readFile(dataPath, (err, postsString) => {
        if (err) {
          reject(err);
        } else {
          const photoPosts = JSON.parse(postsString, (key, value) => {
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
      fs.writeFile(dataPath, JSON.stringify(photoPosts), (err) => {
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

  async function hashtagsSelect() {
    const set = new Set();
    const activePhotoPosts = await readPostsString();
    for (let i = 0; i < activePhotoPosts.length; i++) {
      if (!activePhotoPosts[i].isDeleted) {
        activePhotoPosts[i].hashtags.forEach((value) => {
          set.add(value);
        });
      }
    }
    return Array.from(set);
  }

  async function authorsSelect() {
    const set = new Set();
    const activePhotoPosts = await readPostsString();
    for (let i = 0; i < activePhotoPosts.length; i++) {
      if (!activePhotoPosts[i].isDeleted) {
        set.add(activePhotoPosts[i].author);
      }
    }
    return Array.from(set);
  }

  async function getFreeId() {
    for (let i = 0; true; i++) {
      if (!usedID.has(i.toString())) {
        usedID.add(i.toString());
        return i.toString();
      }
    }
  }

  function correctHashtag(val) {
    if (typeof (val) === 'string' && val.charAt(0) === '#') {
      for (let i = 0; i < val.length; i++) {
        if (val.charAt(i) === ' ') {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  function isString(val) {
    return (typeof (val) === 'string');
  }

  function validatePhotoPost(photoPost) {
    if (typeof (photoPost.id) !== 'string'
            || typeof (photoPost.description) !== 'string'
            || photoPost.createdAt === 'Invalid Date'
            || typeof (photoPost.author) !== 'string'
            || typeof (photoPost.photolink) !== 'string') {
      return false;
    }
    if (!(Array.isArray(photoPost.likes))) {
      return false;
    }
    if (!(Array.isArray(photoPost.hashtags))) {
      return false;
    }

    // function isString(item) {
    //   return (typeof (item) === 'string');
    // }

    if (!photoPost.hashtags.every(correctHashtag)) {
      return false;
    }
    if (!photoPost.hashtags.every(isString)) {
      return false;
    }

    return true;
  }

  async function addPhotoPost(photoPost_) {
    const photoPost = photoPost_;
    const allPostsString = await readPostsString();
    if (photoPost.id === '-1' || usedID.has(photoPost.id)) {
      photoPost.id = await getFreeId();
    }
    if (validatePhotoPost(photoPost)) {
      allPostsString.push(photoPost);
      await writePostsString(allPostsString);
      return true;
    }
    return false;
  }

  async function getPhotoPost(id) {
    const allPostsString = await readPostsString();

    for (let i = 0; i < allPostsString.length; i++) {
      if (allPostsString[i].id === id && !allPostsString[i].isDeleted) {
        return allPostsString[i];
      }
    }
    return -1;
  }

  async function getPhotoPostIndex(id) {
    const allPostsString = await readPostsString();

    for (let i = 0; i < allPostsString.length; i++) {
      if (allPostsString[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  async function editPhotoPost(id, photoPostChange) {
    const allPostsString = await readPostsString();

    const postToEdit = await getPhotoPost(id);

    if (postToEdit === undefined) {
      return false;
    }

    let flag = false;
    if (photoPostChange.photolink !== undefined) {
      if (typeof (photoPostChange.photolink) === 'string') {
        postToEdit.photolink = photoPostChange.photolink;
        flag = true;
      }
    }
    if (photoPostChange.description !== undefined) {
      if (typeof (photoPostChange.description) === 'string') {
        postToEdit.description = photoPostChange.description;
        flag = true;
      }
    }
    if (photoPostChange.hashtags !== undefined) {
      if (Array.isArray(photoPostChange.hashtags)) {
        postToEdit.hashtags = [];
        for (let i = 0; i < photoPostChange.hashtags.length; i++) {
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
          const tempLikesSet = new Set(postToEdit.likes);
          if (tempLikesSet.has(photoPostChange.likes[j])) {
            tempLikesSet.delete(photoPostChange.likes[j]);
            flag = true;
          } else {
            tempLikesSet.add(photoPostChange.likes[j]);
            flag = true;
          }
          postToEdit.likes = Array.from(tempLikesSet);
        }
      }
    }
    allPostsString[await getPhotoPostIndex(postToEdit.id)] = postToEdit;
    await writePostsString(allPostsString);
    return flag;
  }

  async function removePhotoPost(id) {
    const allPostsString = await readPostsString();
    for (let i = 0; i < allPostsString.length; i++) {
      if (allPostsString[i].id === id) {
        allPostsString[i].isDeleted = true;
        break;
      }
    }
    await writePostsString(allPostsString);
    return true;
  }

  function filtfunc(param, filterConfig) {
    let flagAuthor = true;
    let flagHash = true;

    function haveAuthor(value) {
      return (param.author === value);
    }

    if (filterConfig.author !== undefined && filterConfig.author !== '') {
      const authors = filterConfig.author.trim().split(' ');
      if (Array.isArray(authors)) {
        flagAuthor = authors.some(haveAuthor);
      } else {
        return false;
      }
    }
    if (filterConfig.createdAt !== undefined && filterConfig.createdAt !== ''
            && filterConfig.createdAt !== 'Invalid Date' && filterConfig.createdAt !== null) {
      if (typeof (filterConfig.createdAt) === 'object') {
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
          flagHash = filterConfig.hashtags.some(haveHashtag);
        } else {
          return false;
        }
      }
    }
    return flagAuthor && flagHash;
  }

  async function getPhotoPosts(skip_, top_, filterConfig_) {
    let skip = skip_;
    let top = top_;
    let filterConfig = filterConfig_;
    let filteredPosts = [];
    if (typeof (skip) === 'string') {
      skip = JSON.parse(skip);
    }
    if (typeof (top) === 'string') {
      top = JSON.parse(top);
    }
    if (typeof (filterConfig) === 'string') {
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

    const stringOfPosts = await readPostsString();

    stringOfPosts.sort(datesort);
    if (typeof (filterConfig) !== 'undefined') {
      for (let i = 0; i < stringOfPosts.length; i++) {
        if (!stringOfPosts[i].isDeleted) {
          if (filtfunc(stringOfPosts[i], filterConfig)) {
            filteredPosts.push(stringOfPosts[i]);
          }
        }
      }
    } else {
      filteredPosts = stringOfPosts.filter(element => !element.isDeleted);
    }
    return filteredPosts.slice(skip, skip + top);
  }

  async function onLoad() {
    const stringOfPosts = await readPostsString();
    stringOfPosts.forEach((value) => {
      usedID.add(value.id);
    });
  }

  onLoad();
  return {
    hashtagsSelect,
    authorsSelect,
    getPhotoPost,
    getPhotoPosts,
    addPhotoPost,
    editPhotoPost,
    removePhotoPost,
  };
}());

module.exports = server;


const storagex = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../public/images');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storagex });

function parseDate(key, value) {
  if (key === 'createdAt' && typeof value === 'string') {
    return new Date(value);
  }
  return value;
}

app.use(bodyParser.json({ reviver: parseDate }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../public'));

app.get('/getPhotoPost/:id', async (req, res) => {
  const post = await server.getPhotoPost(req.params.id);
  if (post !== undefined) {
    res.send(post);
  } else {
    res.status(404).send('Photopost not found');
  }
});

app.post('/getPhotoPosts', async (req, res) => {
  const skip = req.query.skip;
  const top = req.query.top;
  const filterConfig = req.body;
  const photoPosts = await server.getPhotoPosts(skip, top, filterConfig);
  if (photoPosts !== undefined) {
    res.send(photoPosts);
  } else {
    res.status(404).send('Photopost not found');
  }
});

let subscribers = {};

app.post('/addPhotoPost', async (req, res) => {
  // принять POST-запрос
  console.log(`есть сообщение, клиентов:${Object.keys(subscribers).length}`);
  if (await server.addPhotoPost(req.body)) {
    for (const id in subscribers) {
      console.log(`отсылаю сообщение ${id}`);
      const result = subscribers[id];
      result.send(JSON.stringify(req.body));
      res.send('Success');
    }
  }
  subscribers = {};
});

app.put('/editPhotoPost/:id', async (req, res) => {
  if (await server.editPhotoPost(req.params.id, req.body)) {
    res.send('Photopost was successfully edited');
  } else {
    res.status(400).send('Operation failed');
  }
});

app.delete('/removePhotoPost/:id', async (req, res) => {
  if (await server.removePhotoPost(req.params.id)) {
    res.send('Photopost was successfully deleted');
  } else {
    res.status(400).send('Operation failed');
  }
});

app.post('/downloadFile', upload.single('file'), async (req, res) => {
  const fileName = req.file.filename;
  if (fileName !== null) {
    res.send(JSON.stringify(`./images/${fileName}`));
  } else {
    res.status(400).send('Photo downloading failed');
  }
});

app.get('/getHashtags', async (req, res) => {
  const result = await server.hashtagsSelect();
  if (result !== undefined) {
    res.send(JSON.stringify(result));
  } else {
    res.status(400).send('Operation failed');
  }
});

app.get('/getAuthors', async (req, res) => {
  const result = await server.authorsSelect();
  if (result !== undefined) {
    res.send(JSON.stringify(result));
  } else {
    res.status(400).send('Operation failed');
  }
});

app.get('/subscribe', async (req, res) => {
  const id = Math.random();

  res.setHeader('Content-Type', 'text/plain;charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  subscribers[id] = res;
  console.log(`новый клиент ${id}, клиентов:${Object.keys(subscribers).length}`);

  req.on('close', () => {
    delete subscribers[id];
    console.log(`клиент ${id} отсоединился, клиентов:${Object.keys(subscribers).length}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
