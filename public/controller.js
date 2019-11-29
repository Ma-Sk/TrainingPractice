function User(login, password) {
    this.login = login;
    this.password = password;
}

const controller = (function () {
    async function like(event) {
        try {
            const button = event.target;
            await view.addLike(button.closest('.post').id);
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    async function addMore() {
        try {
            await view.addMorePosts();
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    async function correctFilter(author, date, hashtags) {
        try {
            lastLoadedPostsAmount = 0;
            const createdDate = date.trim().split('/');
            await view.showPostsToHtml({
                author,
                createdAt: new Date(
                    parseInt(createdDate[2], 10),
                    parseInt(createdDate[1], 10) - 1, parseInt(createdDate[0], 10),
                ),
                hashtags: hashtags.trim().split(' '),
            });
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    async function login() {
        try {
            if (currentUser === null) {
                await view.loadLoginPage();
            } else {
                if (await model.logOff()) {
                    await view.setUser();
                }
            }
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    async function checkLog() {
        try {
            const loginInfo = document.getElementById('login').value;
            const passwordInfo = document.getElementById('pass').value;

            // users.forEach((value) => {
            //     if (value.login === loginInfo && value.password === passwordInfo) {
            //         flag = true;
            //     }
            // });
            let name = await model.logIn(loginInfo, passwordInfo);
            console.log(name);
            if (name !== 'false') {
                await view.loadMainPage(loginInfo);
            } else {
                alert('Invalid login or password');
            }
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    async function add() {
        try {
            await view.loadAddEditPage();
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    async function savePost(event, pid) {
        try {
            const dscrText = document.getElementById('descriptionText').value;
            const hstgText = document.getElementById('hashtagsAddEditText').value;
            const goodHashtags = hstgText.split(' ');
            if (pid === undefined) {
                const selectedFile = document.getElementById('files');
                const filePath = await model.downloadFile(selectedFile.files[0]);
                await model.addPhotoPost(new Photopost(
                    '-1', dscrText, new Date(),
                    currentUser, filePath, [], goodHashtags,
                ));
            } else {
                await model.editPhotoPost(pid, {description: dscrText, hashtags: goodHashtags});
            }
            await view.loadMainPage(currentUser);
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    async function edit(event) {
        try {
            const button = event.target;
            await view.loadAddEditPage(button.closest('.post').id);
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    async function del(event) {
        try {
            const button = event.target;
            await view.deletePostFromHtml(button.closest('.post').id);
        } catch (error) {
            view.loadErrorPage(error);
        }
    }

    function changePhoto(event) {
        const image = document.getElementById('addeditPhoto');
        const reader = new FileReader();
        if (event.target.files[0] !== undefined) {
            reader.readAsDataURL(event.target.files[0]);
            reader.onloadend = function () {
                image.src = reader.result;
            };
        } else {
            image.src = '';
        }
    }

    return {
        changePhoto,
        savePost,
        checkLog,
        like,
        addMore,
        login,
        add,
        edit,
        del,
        correctFilter,
    };
}());
