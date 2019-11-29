function Photopost(id, description, createdAt, author, photolink, likes, hashtags, isDeleted) {
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
    this.likes = likes || [];
    this.hashtags = hashtags || [];
    if (typeof (isDeleted) === 'boolean') {
        this.isDeleted = isDeleted;
    } else {
        this.isDeleted = false;
    }
}


const model = (function () {
    function getPhotoPosts(skip_, top_, filterConfig) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            let skip = skip_;
            let top = top_;
            if (typeof (skip) !== 'number') {
                skip = 0;
            }

            if (typeof (top) !== 'number') {
                top = 10;
            }

            xhr.open('POST', `getPhotoPosts?skip=${skip}&top=${top}`, true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            let photoPosts;
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    photoPosts = JSON.parse(xhr.responseText, (key, value) => {
                        if (key === 'createdAt') {
                            return new Date(value);
                        }
                        return value;
                    });
                    resolve(photoPosts);
                } else {
                    console.log(`${xhr.status}: ${xhr.statusText}`);
                    reject(new Error(xhr.responseText));
                }
            };

            if (filterConfig !== undefined) {
                xhr.send(JSON.stringify(filterConfig));
            } else {
                xhr.send();
            }
        });
    }

    function getPhotoPost(id) {
        return new Promise((resolve, reject) => {
            if (id === undefined) {
                reject(new Error('No such ID'));
            }

            const xhr = new XMLHttpRequest();

            xhr.open('GET', `getPhotoPost/${id}`, true);

            let photoPost;

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    photoPost = JSON.parse(xhr.responseText, (key, value) => {
                        if (key === 'createdAt') {
                            return new Date(value);
                        }
                        return value;
                    });
                    resolve(photoPost);
                } else {
                    console.log(`${xhr.status}: ${xhr.statusText}`);
                    reject(new Error(xhr.responseText));
                }
            };

            xhr.send();
        });
    }

    async function logIn(login, password) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();

            xhr.open('POST', '/logIn', true);
            xhr.setRequestHeader('Content-type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    console.log(`${xhr.status}: ${xhr.responseText}`);
                    reject(new Error(xhr.responseText));
                }
            };
            xhr.send(JSON.stringify({username: login, password}));
        });
    }

    async function logOff() {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', '/logOff', true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else {
                    console.log(`${xhr.status}: ${xhr.responseText}`);
                    reject(new Error(xhr.responseText));
                }
            };
            xhr.send();
        });
    }

    function addPhotoPost(photoPost) {
        return new Promise((resolve, reject) => {
            if (photoPost === undefined) {
                reject(new Error('No such photopost'));
            }
            const xhr = new XMLHttpRequest();

            xhr.open('POST', 'addPhotoPost', true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            let flag = false;
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    resolve('Success');
                    flag = true;
                } else {
                    console.log(`${xhr.status}: ${xhr.statusText}`);
                    reject(new Error(xhr.responseText));
                }
            };
            xhr.send(JSON.stringify(photoPost));

            return flag;
        });
    }

    function removePhotoPost(id) {
        return new Promise((resolve, reject) => {
            if (id === undefined) {
                reject(new Error('No such ID'));
            }

            const xhr = new XMLHttpRequest();

            xhr.open('DELETE', `removePhotoPost/${id}`, true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    resolve('Success');
                } else {
                    console.log(`${xhr.status}: ${xhr.statusText}`);
                    reject(new Error(xhr.responseText));
                }
            };

            xhr.send();
        });
    }

    function editPhotoPost(id, photoPostEdit) {
        return new Promise((resolve, reject) => {
            if (id === undefined || photoPostEdit === undefined) {
                reject(new Error('No Such ID or Bad edit information'));
            }

            const xhr = new XMLHttpRequest();

            xhr.open('PUT', `editPhotoPost/${id}`, true);

            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    resolve('Success');
                } else {
                    console.log(`${xhr.status}: ${xhr.statusText}`);
                    reject(new Error(xhr.responseText));
                }
            };

            xhr.send(JSON.stringify(photoPostEdit));
        });
    }

    function downloadFile(file) {
        return new Promise((resolve, reject) => {
            if (file === null || file === undefined) {
                reject(new Error('Bad file'));
            }

            const xhr = new XMLHttpRequest();

            xhr.open('POST', 'downloadFile', true);

            const formData = new FormData();
            formData.append('file', file);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    console.log(`${xhr.status}: ${xhr.statusText}`);
                    reject(new Error(xhr.responseText));
                }
            };

            xhr.send(formData);
        });
    }

    function hashtagsSelect() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', 'getHashtags', true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
                    reject(new Error(xhr.responseText));
                } else {
                    resolve(JSON.parse(xhr.responseText));
                }
            };

            xhr.send();
        });
    }

    function authorsSelect() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', 'getAuthors', true);

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status !== 200) {
                    console.log(`${xhr.status}: ${xhr.responseText || xhr.statusText}`);
                    reject(new Error(xhr.responseText));
                } else {
                    resolve(JSON.parse(xhr.responseText));
                }
            };

            xhr.send();
        });
    }

    async function subscribe() {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) {
                    return;
                }
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    const photoPost = JSON.parse(xhr.responseText, (key, value) => {
                        if (key === 'createdAt') {
                            return new Date(value);
                        }
                        return value;
                    });
                    if (document.getElementById(photoPost.id) === null) {
                        view.addPostToHtml(photoPost);
                    }
                    subscribe();
                    return;
                }
                console.log(`${xhr.status}: ${xhr.statusText}`);
                console.log(xhr.responseText);

                resolve();
                setTimeout(subscribe, 1000); // попробовать ещё раз через 1 сек
            };
            xhr.open('GET', 'subscribe', true);
            xhr.send();
        });
    }

    subscribe();
    return {
        getPhotoPosts,
        getPhotoPost,
        addPhotoPost,
        removePhotoPost,
        editPhotoPost,
        downloadFile,
        authorsSelect,
        hashtagsSelect,
        logIn,
        logOff
    };
}());
