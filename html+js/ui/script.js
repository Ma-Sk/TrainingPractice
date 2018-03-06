(function () {
    function Photopost(id, description, createdAt, author, photolink, likes, hashtags) {
        this.id = id;
        this.description = description;
        this.createdAt = createdAt;
        this.author = author;
        this.photolink = photolink;
        this.likes = likes || [];
        this.hashtags = hashtags || [];
    }

    var photoPosts = [
        new Photopost("1", "description1", new Date("2018-02-26T23:00:00"), "Dima", "link", ["Vasia"], ["#cool", "#2018"]),
        new Photopost("2", "description2", new Date("2017-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
        new Photopost("3", "description3", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#soocool", "#2020"]),
        new Photopost("4", "description4", new Date("2019-02-26T23:00:00"), "Vasia", "link", ["Vasia"], ["#cool", "#2018"]),
        new Photopost("5", "description5", new Date("2015-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2017"]),
        new Photopost("6", "description6", new Date("2018-03-26T23:00:00"), "Vasia", "link", ["Petia"], ["#cool", "#2018"]),
        new Photopost("7", "description7", new Date("2018-01-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
        new Photopost("8", "description8", new Date("2018-04-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
        new Photopost("9", "description9", new Date("2018-02-22T23:00:00"), "Vasia", "link", ["Dima"], ["#cool", "#2018"]),
        new Photopost("10", "description10", new Date("2018-02-23T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
        new Photopost("11", "description11", new Date("2018-02-21T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
        new Photopost("12", "description12", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Petia"], ["#cool", "#2018"]),
        new Photopost("13", "description13", new Date("2018-02-19T23:00:00"), "Dima", "link", ["Vasia", "Petia"], ["#soocool", "#2017"]),
        new Photopost("14", "description14", new Date("2018-02-27T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#2017"]),
        new Photopost("15", "description15", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#soocool", "#2017"]),
        new Photopost("16", "description16", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Petia"], ["#cool", "#2018"]),
        new Photopost("17", "description17", new Date("2018-02-17T23:00:00"), "Vasia", "link", ["Vasia"], ["#cool", "#2018"]),
        new Photopost("18", "description18", new Date("2018-02-16T23:00:00"), "Vasia", "link", ["Dima"], ["#cool", "#2018"]),
        new Photopost("19", "description19", new Date("2018-02-15T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
        new Photopost("20", "description20", new Date("2018-02-14T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"])
    ];

    function datesort(a, b) {
        var dif = a.createdAt - b.createdAt;
        if (dif > 0) {
            return 1;
        }
        if (dif < 0) {
            return -1;
        }
        return 0;
    }

    function haveHashtag(value, param) {
        for (var j = 0; j < param.hashtags.length; j++) {
            if (param.hashtags[j] === value) {
                return true;
            }
        }
        return false;
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

        if (filterConfig.hashtags !== undefined) {
            if (Array.isArray(filterConfig.hashtags)) {
                return filterConfig.hashtags.some(haveHashtag)
            }
            else
                return false;
        }
        return true;
    }

    function getPhotoPosts(skip, top, filterConfig) {
        var buffmass1 = [];
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
            for (var i = 0; i < photoPosts.length; i++) {
                if (filtfunc(photoPosts[i], filterConfig)) {
                    buffmass1.push(photoPosts[i]);
                }
            }
        }
        else {
            buffmass1 = photoPosts;
        }
        return buffmass1.slice(skip, skip + top);
    }

    function getPhotoPost(id) {
        for (var i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id === id) {
                return photoPosts[i];
            }
        }
    }

    function validatePhotoPost(photoPost) {
        if (typeof(photoPost.id) !== "string" || typeof(photoPost.description) !== "string"
            || photoPost.createdAt == "Invalid Date" || typeof(photoPost.author) !== "string"
            || typeof(photoPost.photolink) !== "string")
            return false;

        function isString(val) {
            return (typeof(val) === "string")
        }

        function correctHashtag(val) {
            if (val.charAt(0) === "#") {
                for (var i = 0; i < val.length; i++)
                    if (val.charAt(i) === " ")
                        return false;
                return true;
            }
            return false;
        }

        if (Array.isArray(photoPost.likes)) {
            if (!photoPost.likes.every(isString))
                return false;
        }
        else return false;

        if (Array.isArray(photoPost.hashtags)) {
            if (!photoPost.hashtags.every(correctHashtag))
                return false;
        }
        else return false;

        return true;
    }

    function addPhotoPost(photoPost)//: boolean
    {
        if (validatePhotoPost(photoPost)) {
            photoPosts.push(photoPost);
            return true;
        }
        else
            return false;
    }

    function editPhotoPost(id, photoPostChange)//: boolean
    {
        var i, j;
        var flag = false;
        for (i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id === id) {
                validatePhotoPost(photoPosts[i]);
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
                    if (Array.isArray(photoPostChange.hashtags)) {
                        photoPosts[i].hashtags.length = 0;
                        for (j = 0; j < photoPostChange.hashtags.length; j++) {
                            if (typeof(photoPostChange.hashtags[j]) === "string") {
                                photoPosts[i].hashtags.push(photoPostChange.hashtags[j]);
                                flag = true;
                            }
                        }
                    }
                }
                if (photoPostChange.likes !== undefined) {
                    if (Array.isArray(photoPostChange.likes)) {
                        photoPosts[i].likes.length = 0;
                        for (j = 0; j < photoPostChange.likes.length; j++) {
                            if (typeof(photoPostChange.likes[j]) === "string") {
                                photoPosts[i].likes.push(photoPostChange.likes[j]);
                                flag = true;
                            }
                        }
                    }
                }
                break;
            }
        }
        return flag;
    }

    function removePhotoPost(id) {
        var i;
        for (i = 0; i < photoPosts.length; i++) {
            if (photoPosts[i].id === id) {
                photoPosts.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    console.log("\n\n\nget photoposts true");
    var ob0_1 = new Photopost("101", "description51", new Date("2018-03-14T16:20:00"), "Dima", "link", ["Vasia"], ["#cool", "#2017"]);
    console.log(addPhotoPost(ob0_1));
    console.log("Author\n");
    console.log(getPhotoPosts(0, 10, {author: "Dima"}));
    console.log("Date\n");
    console.log(getPhotoPosts(0, 2, {createdAt: new Date("2018-03-14T16:20:00")}));
    console.log("Hashtags\n");
    console.log(getPhotoPosts(0, 10, {hashtags: ["#2017", "soocool"]}));
    console.log("Hashtags and date\n");
    console.log(getPhotoPosts(0, 10, {hashtags: ["#2017", "soocool"], createdAt: new Date("2018-03-14T16:20:00")}));
    console.log(removePhotoPost("101"));

    console.log("\nget photoposts false");
    var ob0_2 = new Photopost("102", "description52", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
    console.log(addPhotoPost(ob0_2));
    console.log(getPhotoPosts(0, 5, {author: "Wrong"}));

    console.log("\n\n\nget photopost true");
    var ob_1 = getPhotoPost("4");
    console.log(ob_1);

    console.log("\nget photopost false");
    var ob_2 = getPhotoPost("546");
    console.log(ob_2);

    console.log("\n\n\nvalidate photopost true");
    var ob1_1 = new Photopost("31", "description26", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
    console.log(validatePhotoPost(ob1_1));

    console.log("\nvalidate photopost true");
    var ob1_2 = new Photopost("32", new Date("2018-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
    console.log(validatePhotoPost(ob1_2));

    console.log("\n\n\nadd photopost true");
    var ob2_1 = new Photopost("41", "description22", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
    console.log(addPhotoPost(ob2_1));
    console.log(getPhotoPost("41"));

    console.log("\nadd photopost false");
    var ob2_2 = new Photopost("42", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
    console.log(addPhotoPost(ob2_2));
    console.log(getPhotoPost("42"));

    console.log("\n\n\nedit photopost true");
    var ob3_1 = new Photopost("51", "description51", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
    console.log(addPhotoPost(ob3_1));
    console.log(ob3_1);
    console.log(editPhotoPost("51", {
        photolink: 'update photolink',
        description: 'update description',
        hashtags: ["#soocool", "#2010", "#2015"],
        likes: ["Mike", "Phil"]
    }));
    console.log(getPhotoPost("51"));
    console.log(removePhotoPost("51"));

    console.log("\nedit photopost false");
    var ob3_2 = new Photopost("52", "description52", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
    console.log(addPhotoPost(ob3_2));
    console.log(editPhotoPost("52", {}));
    console.log(getPhotoPost("52"));

    console.log("\n\n\nremove photopost true");
    var ob4 = new Photopost("61", "description22", new Date("2014-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
    console.log(addPhotoPost(ob4));
    console.log(getPhotoPosts(0, 10));
    console.log(removePhotoPost("61"));
    console.log(getPhotoPosts(0, 10));

    console.log("\nremove photopost false");
    console.log(removePhotoPost("1250"));
}());
