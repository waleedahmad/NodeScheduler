const CronJob = require('cron').CronJob,
    Post = require('../database/Schema').Post,
    User = require('../database/Schema').User,
    FB = require('fb'),
    fs = require('fs'),
    path = require('path'),
    config = require('config');


module.exports = () => {
    new CronJob('* * * * * *', function() {

        let now = Math.floor(new Date().getTime() / 1000);

        let post_query = Post.find({published: false, schedule_time : now});

        post_query.then(posts => {
            publishPosts(posts);
        }).catch(err => {
            console.log(err);
        });
    }, null, true, config.get('scheduler_timezone'));
};

const publishPosts = (posts) => {
    posts.map(post => {
        let user_query = User.findOne({facebookID: post.user_id});

        user_query.then(user => {
            let options = {};

            if(post.type_of === 'photo'){
                options = Object.assign(options, {
                    source: fs.createReadStream(path.join(__dirname, '../', post.media)),
                    caption: post.message,
                    api_endpoint : post.page_id+'/photos'
                }, options);
            }else{
                options = Object.assign(options, {
                    message : post.message,
                    api_endpoint : post.page_id+'/feed'
                }, options);
            }

            FB.setAccessToken(user.accessToken);
            FB.api('/me/accounts', (pages) => {

                let page = pages.data.filter((page) => {
                    return page.id === post.page_id
                })[0];

                options = Object.assign(options, {
                    access_token : page.access_token,
                }, options);
                publishPost(options, post);
            });
        })
    });
};

const publishPost = (options, post) => {
    FB.api(options.api_endpoint, 'post', options , (res) => {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        let update = {published : true, publish_id : res.id},
            options = {new: true};
        Post.findByIdAndUpdate(post._id, update, options, (error, result) => {
            if (error) return;
            console.log(result);
        });

    });
};