function Photopost (id, description, createdAt, author, photolink, likes, likesamount, hashtags)
{
    this.id = id;
    this.description = description;
    this.createdAt = createdAt;
    this.author = author;
    this.photolink = photolink;
    this.likes = likes || [];
	//this.likesamount = likesamount;
    this.hashtags = hashtags || [];
}
var photoPosts = [
    new Photopost("1", "description1", new Date("2018-02-26T23:00:00"), "Dima", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
	new Photopost("2", "description2", new Date("2017-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("3", "description3", new Date("2016-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("4", "description4", new Date("2019-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("5", "description5", new Date("2015-02-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("6", "description6", new Date("2018-03-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("7", "description7", new Date("2018-01-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("8", "description8", new Date("2018-04-26T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("9", "description9", new Date("2018-02-22T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("10", "description10", new Date("2018-02-23T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("11", "description11", new Date("2018-02-21T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("12", "description12", new Date("2018-02-20T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("13", "description13", new Date("2018-02-19T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("14", "description14", new Date("2018-02-27T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("15", "description15", new Date("2018-02-18T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("16", "description16", new Date("2018-02-28T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("17", "description17", new Date("2018-02-17T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("18", "description18", new Date("2018-02-16T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("19", "description19", new Date("2018-02-15T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
    new Photopost("20", "description20", new Date("2018-02-14T23:00:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]),
]
function datesort(a, b)
{
    var dif = a.createdAt - b.createdAt;
    if (dif > 0) {
        return 1;
    }
    if (dif < 0) {
        return -1;
    }
    return 0;
}
function getPhotoPosts(skip, top, filterConfig)//: Array<Object>
{
    skip = skip || 0;
    if (typeof(skip) !== "number") {
        skip = 0;
    }
    top = top || 10;
    if (typeof(top) !== "number") {
        top = 0;
    }
    photoPosts.sort(datesort);
    //Тут ещё будет фильтр
    if (typeof(filterConfig) !== "undefined") {
        function filtfunc(param) {
            if (filterConfig.author !== undefined) {
                if (typeof(filterConfig.author) === "string") {
                    if (filterConfig.author !== param.author) {
                        return false;
                    }
                }
            }
            if (filterConfig.createdAt !== undefined) {
                if (typeof(filterConfig.createdAt) === "object") {
                    if (filterConfig.createdAt.getFullYear() !== param.createdAt.getFullYear() || filterConfig.createdAt.getMonth() !== param.createdAt.getMonth() || filterConfig.createdAt.getDate() !== param.createdAt.getDate()) {
                        return false;
                    }
                }
            }
            function haveHashtag(value) {
                for (var j = 0; j < param.hashtags.length; j++)
                    if (param.hashtags[j] === value)
                        return true;
                return false;
            }
            if (filterConfig.hashtags !== undefined) {
                if (Array.isArray(filterConfig.hashtags)) {//typeof(filterConfig.hashtags) === "object"
                    if(filterConfig.hashtags.some(haveHashtag))
                        return true;
                    else
                        return false;
                    // for (var i = 0; i < filterConfig.hashtags.length; i++) {
                    //     var flag = false;
                    //     for (var j = 0; j < param.hashtags.length; j++) {
                    //         if (param.hashtags[j] === filterConfig.hashtags[i]) {
                    //             flag = true;
                    //             break;
                    //         }
                    //     }
                    //     if (!flag) {
                    //         return false;
                    //     }
                    // }
                }
                else
                    return false;
            }

            return true;
        }

        var buffmass1 = photoPosts.filter(filtfunc);//фильтрация
    }
    else {
        var buffmass1 = photoPosts;
    }
    var buffmass2 = buffmass1.slice(skip, skip + top);//отбрасывание первых skip элементов массива и взятие последующих top элементов
    return buffmass2;
}
function getPhotoPost(id) {
    for(var i = 0; i < photoPosts.length; i++)
        if(photoPosts[i].id === id)
            return photoPosts[i];
}
function validatePhotoPost(photoPost) {
    if(typeof(photoPost.id) !== "string" || typeof(photoPost.description) !== "string"
        || photoPost.createdAt == "Invalid Date" || typeof(photoPost.author) !== "string"
        || typeof(photoPost.photolink) !== "string")
        return false;

    function isString(val) {
        return (typeof(val) === "string")
    }
    function correctHashtag(val) {
        if(val.charAt(0) === "#") {
            for (var i = 0; i < val.length; i++)
                if (val.charAt(i) === " ")
                    return false;
            return true;
        }
        return false;
    }

    if(Array.isArray(photoPost.likes)) {
        if (!photoPost.likes.every(isString))
            return false;
    }
    else return false;

    if(Array.isArray(photoPost.hashtags)) {
        if (!photoPost.hashtags.every(correctHashtag))
            return false;
    }
    else return false;

    return true;
}
function addPhotoPost(photoPost)//: boolean
{

}
function editPhotoPost(id, photoPost)//: boolean
{

}
function removePhotoPost(id)//: boolean
{

}
var ob = getPhotoPost("4");
console.log(ob);
var ob1 = new Photopost("21", "description21", new Date("2018-03-14T16:20:00"), "Vasia", "link", ["Vasia", "Petia"], ["#cool", "#2018"]);
console.log(ob1);
console.log(validatePhotoPost(ob1));
console.log(getPhotoPosts(0, 10));
console.log(getPhotoPosts(0, 10, {author: "Dima"}));