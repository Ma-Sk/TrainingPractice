
let lastLoadedPostsAmount = 0;
let currentUser = null;
let lastFilterConfig;

let photoPosts = [];

const view = (function () {
  async function clearPage() {
    const content = document.getElementById('content');
    while (content.hasChildNodes()) {
      content.removeChild(content.firstChild);
    }
  }

  function loadErrorPage(error) {
    clearPage();
    const content = document.getElementById('content');
    content.innerHTML =
            `<div class="errorblock">
                <p class="errortext">Ooops! Something went wrong:(</p>
                <p class="errortext">${error.message}</p>
        </div>`;
  }

  function allHashtags(set) {
    try {
      let str = '';
      set.forEach((value) => {
        str += `${value} `;
      });
      return str;
    } catch (error) {
      loadErrorPage(error);
      return -1;
    }
  }

  function generatePostToHtml(photoPostToLoad) {
    const post = document.createElement('div');
    post.className = 'post';
    post.id = photoPostToLoad.id;
    post.innerHTML =
            `<div class="userphoto">
               <img src="images/user.png"/>
               <div>${photoPostToLoad.author}</div>
               <div class="date">${photoPostToLoad.createdAt.toLocaleDateString()} ${photoPostToLoad.createdAt.toLocaleTimeString()}</div>
            </div>
            <img src="${photoPostToLoad.photolink}" class="photopost">
            <div>
                <button class="photobutton like"><img src="images/like.jpg" class="like"></button><span style='font-size: 180%' class='likesCount'>${photoPostToLoad.likes.length}</span>
                ${((currentUser !== null && currentUser === photoPostToLoad.author) ? "<button class='photobutton edit'><img src=\"images/edit.png\" class=\"edit\"></button>" : ' ')}
                ${((currentUser !== null && currentUser === photoPostToLoad.author) ? "<button class='photobutton delete'><img src=\"images/bin.jpg\" class=\"del\"></button>" : ' ')}
            </div>
            <hr>
            <div>
               <div class="hashtags">${allHashtags(photoPostToLoad.hashtags)}</div>${photoPostToLoad.description}
            </div>`;
    let element = post.getElementsByClassName('like')[0];
    element.addEventListener('click', controller.like);
    element = post.getElementsByClassName('edit')[0];
    if (element !== undefined) {
      element.addEventListener('click', controller.edit);
      element = post.getElementsByClassName('del')[0];
      element.addEventListener('click', controller.del);
    }
    return post;
  }

  async function showPostsToHtml(filterConfig) {
    try {
      lastFilterConfig = filterConfig;
      const column = document.getElementById('column');
      while (column.firstChild) {
        column.removeChild(column.firstChild);
      }
      const htmlPhotoPosts = await model.getPhotoPosts(0, 10 + lastLoadedPostsAmount, filterConfig);
      lastLoadedPostsAmount += htmlPhotoPosts.length;
      for (let i = 0; i < htmlPhotoPosts.length; i += 1) {
        column.appendChild(generatePostToHtml(htmlPhotoPosts[i]));
      }
      return 0;
    } catch (error) {
      loadErrorPage(error);
      return -1;
    }
  }

  async function addMorePosts() {
    try {
      const htmlPhotoPosts = await model.getPhotoPosts(lastLoadedPostsAmount, 10, lastFilterConfig);
      lastLoadedPostsAmount += htmlPhotoPosts.length;
      for (let i = 0; i < htmlPhotoPosts.length; i++) {
        const column = document.getElementById('column');
        column.appendChild(generatePostToHtml(htmlPhotoPosts[i]));
      }
      return 0;
    } catch (error) {
      loadErrorPage(error);
      return -1;
    }
  }

  async function addPostToHtml(photoPost) {
    try {
      const column = document.getElementById('column');
      column.insertBefore(generatePostToHtml(photoPost), column.firstChild);
      lastLoadedPostsAmount += 1;
      // await authorsSelect();
      // await hashtagsSelect();
      return 0;
    } catch (error) {
      loadErrorPage(error);
      return -1;
    }
  }

  async function deletePostFromHtml(id) {
    try {
      const container = document.getElementById('column');
      const post = document.getElementById(id);
      if (!container.removeChild(post)) {
        return -1;
      }
      for (let i = 0; i < photoPosts.length; i++) {
        if (photoPosts[i].id === id.toString()) {
          photoPosts[i].isDeleted = true;
          // await authorsSelect();
          // await hashtagsSelect();
          localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
          break;
        }
      }
      await model.removePhotoPost(id);
      // await showPostsToHtml(lastFilterConfig);
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }


  async function hashtagsSelect() {
    try {
      const set = new Set();
      set.add('');
      const hashtags = await model.hashtagsSelect();
      hashtags.forEach((value) => {
        set.add(value);
      });

      const hashs = document.getElementById('hashtags');

      while (hashs.firstChild) {
        hashs.removeChild(hashs.firstChild);
      }
      set.forEach((value) => {
        hashs.innerHTML += `<option>${value}</option>`;
      });
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }

  async function editPostFromHtml(id, change) {
    try {
      if (!await model.editPhotoPost(id, change)) {
        return -1;
      }
      await hashtagsSelect();
      await showPostsToHtml();
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }


  async function authorsSelect() {
    try {
      const set = new Set();
      set.add('');
      const authors = await model.authorsSelect();
      for (let i = 0; i < authors.length; i++) {
        set.add(authors[i]);
      }
      const authorNames = document.getElementById('authornames');
      while (authorNames.firstChild) {
        authorNames.removeChild(authorNames.firstChild);
      }
      set.forEach((value) => {
        authorNames.innerHTML += `<option>${value}</option>`;
      });
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }

  async function addLike(id) {
    if (typeof (currentUser) !== 'string') {
      return -1;
    }
    try {
      if (!await model.editPhotoPost(id, { likes: [currentUser] })) {
        return -1;
      }
      const post = document.getElementById(id);
      if (post === null) {
        return -1;
      }
      const lc = post.getElementsByClassName('likesCount')[0];
      for (let i = 0; i < photoPosts.length; i++) {
        if (photoPosts[i].id === id.toString()) {
          lc.innerHTML = photoPosts[i].likes.length.toString();
          break;
        }
      }
      await showPostsToHtml(lastFilterConfig);
      return 0;
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }

  async function setUser(username) {
    try {
      if ((currentUser === null || currentUser === username) && username !== '' && username !== null && username !== undefined) {
        currentUser = username;

        const element = document.getElementById('addedit');
        element.style.display = 'inline-block';
        element.addEventListener('click', controller.add);

        document.getElementById('usericon').setAttribute('src', 'images/face.jpg');
        document.getElementById('username').style.display = 'inline-block';
        document.getElementById('username').innerHTML = username;
        document.getElementById('log').innerHTML = 'Log out';
        await showPostsToHtml();
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return 0;
      }

      document.getElementById('addedit').style.display = 'none';
      document.getElementById('usericon').setAttribute('src', 'images/user.png');
      document.getElementById('username').style.display = 'none';
      document.getElementById('log').innerHTML = 'Sign in';
      currentUser = null;
      await showPostsToHtml();
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return 0;
    } catch (error) {
      loadErrorPage(error);
      return -1;
    }
  }
  async function loadMainPage(user) {
    try {
      console.log(user);
      await clearPage();
      lastLoadedPostsAmount = 0;
      const content = document.getElementById('content');
      const filter = document.createElement('aside');
      filter.id = 'mainPageAside';
      filter.innerHTML =
                `<form> 
                <div> 
                    <h6 class="filternames">Authors name:</h6> 
                    <input class="textinput" placeholder="Author" name="author" size="20">
                    <select class="textinput" id="authornames" name="authorselect" 
                     onchange="this.form.author.value += this.form.authorselect.value  + ' '"></select> 
                </div> 
                    <div> 
                    <h6 class="filternames">Date:</h6> 
                    <input class="textinput" placeholder="27/2/2018" name="date" size="20"> 
                </div> 
                <div> 
                    <h6 class="filternames">Hashtags:</h6> 
                    <input class="textinput" placeholder="Hashtags" name="hashtagsname" size="20"> 
                    <select id="hashtags" class="textinput" name="hashtagsselect" 
                     onchange="this.form.hashtagsname.value += this.form.hashtagsselect.value  + ' '"></select> 
                </div> 
                <input type="button" value="Filter" id="filterbutton" 
                 onclick="controller.correctFilter( this.form.author.value, this.form.date.value, this.form.hashtagsname.value )"> 
            </form>`;
      content.appendChild(filter);
      const main = document.createElement('main');
      main.id = 'mainPageMain';
      main.innerHTML =
                `<div id="column"></div>
            <div><button><img id="more" src="images/arrow.jpg"></button></div>`;
      content.appendChild(main);
      const more = document.getElementById('more');
      more.addEventListener('click', controller.addMore);
      const login = document.getElementById('log');
      login.addEventListener('click', controller.login);
      lastLoadedPostsAmount = 0;
      await authorsSelect();
      await hashtagsSelect();
      await setUser(user);
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }

  async function loadSite() {
    try {
      if (localStorage.length === 0) {
        localStorage.setItem('photoPosts', JSON.stringify(photoPosts));
      }
      const tempPhotoPosts = JSON.parse(localStorage.getItem('photoPosts'), (key, value) => {
        if (key === 'createdAt') { return new Date(value); }
        return value;
      });
      for (let i = 0; i < tempPhotoPosts.length; i++) {
        photoPosts[i] = new Photopost(
          tempPhotoPosts[i].id, tempPhotoPosts[i].description,
          tempPhotoPosts[i].createdAt, tempPhotoPosts[i].author, tempPhotoPosts[i].photolink,
          tempPhotoPosts[i].likes, tempPhotoPosts[i].hashtags, tempPhotoPosts[i].isDeleted,
        );
      }
      currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (photoPosts === null) {
        photoPosts = [];
      }
      await loadMainPage(currentUser);
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }

  async function loadLoginPage() {
    try {
      await clearPage();
      const content = document.getElementById('content');
      const loginForm = document.createElement('form');
      loginForm.id = 'loginform';
      loginForm.innerHTML =
                `<h1>PortalPhoto</h1>
            <p><input type="text" id="login" name="login" placeholder="Login" required></p>
            <p><input type="password" id="pass" name="password" placeholder="Password" required></p>
            <p><input type="submit" id="checklog" name="submit" value="Submit" ></p>`;
      content.appendChild(loginForm);
      const checklog = document.getElementById('checklog');
      checklog.addEventListener('click', controller.checkLog);
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }

  async function loadAddEditPage(pid) {
    try {
      await clearPage();
      let post = new Photopost('-1', '', new Date(), currentUser, 'images/No_image.jpg.png', new Set([]), new Set([]));
      if (pid !== undefined) {
        post = await model.getPhotoPost(pid);
      }
      const content = document.getElementById('content');
      const loginForm = document.createElement('aside');
      loginForm.id = 'addeditfilter';
      loginForm.innerHTML =
                `<form>
                <div id="description">
                    <h6 class="filternames">Description:</h6>
                    <textarea id="descriptionText" maxlength="300" name="description" placeholder="Enter Description">${post.description}</textarea>
                </div>
                <div id="hashtagsAddEdit">
                    <h6 class="filternames">Hashtags:</h6>
                    <textarea id="hashtagsAddEditText" maxlength="100" name="hashtags" placeholder="Enter Hashtags">${await allHashtags(post.hashtags)}</textarea>
                </div>
                <input type="button" value="Save" id="filterbuttonAddEdit" >
            </form>`;
      content.appendChild(loginForm);
      const savebutton = document.getElementById('filterbuttonAddEdit');
      savebutton.addEventListener('click', (evt) => {
        controller.savePost(evt, pid);
      }, false);


      const main = document.createElement('main');
      main.id = 'addeditmain';
      main.innerHTML =
                `<div id="addeditPost">
                <div class="userphoto">
                    <img src="images/user.png">
                    <div>${post.author}</div>
                    <div class="date">${post.createdAt.toLocaleDateString()} ${post.createdAt.toLocaleTimeString()}</div>
                </div>
                <img src="${post.photolink}" alt="Mat" id="addeditPhoto">
                ${(pid !== undefined) ? '' : '<div class="imagemarginclass"> <label class="imagefilemodinput" for="files">Select Image</label> <input id="files" class="imagefileinput" type="file" name="photo" multiple accept="image/*,image/jpeg"></div>'}
            </div>`;
      content.appendChild(main);
      if (pid === undefined) {
        const file = document.getElementById('files');
        file.addEventListener('change', controller.changePhoto);
      }
    } catch (error) {
      loadErrorPage(error);
    }
    return -1;
  }

  loadSite();
  return {
    showPostsToHtml,
    setUser,
    deletePostFromHtml,
    editPostFromHtml,
    addLike,
    addMorePosts,
    loadMainPage,
    loadLoginPage,
    loadAddEditPage,
    loadErrorPage,
    addPostToHtml,
  };
}());
