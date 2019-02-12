// 像geocode一样创建自己的api！
// 刷新时，partial更改的地方页面也会一起更新 nodemon server.js -e js,hbs  -e后面的参数是要监视的文件扩展名
const express = require('express');
//hbs 是express.js的一个view engine
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
// app.use用来注册中间件，接受一个函数作为参数
// next 告诉程序我们是否已经完成,中间件不会继续执行，除非我们调用了next.也就是说，app.use里的next没有调用的话，下面的app.get不会被执行
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server log.');
        }
    })
    next();
});

// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// })
// 上面的app.use会阻止下面的代码执行，所有页面都会渲染成maintenance.hbs

app.use(express.static(__dirname + '/public'));  // __dirname保存了目录的路径，也就是node-web-server的路径


// 下面这个方法可以直接在hbs文件里调用这个函数，来取得年份,如果有同名的数据的话，会优先用helper
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
})

// get的第一个参数是url，在这个app里，使用的是根路径，所以直接用'/'，第二个参数是要执行的函数，决定要将什么发回给发送请求的用户。
// req参数保存了许多关于请求的信息
// res参数可以定义你要发送回去的信息
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>');// 如果用户发送请求的话，他们将看到这条信息,在浏览器的响应中，会看到content type 是text/html
    // 发送JSON,这里的content-type是application/json
    // res.send({
    //     name: 'Andrew',
    //     likes: [
    //         'Biking',
    //         'Cities'
    //     ]
    // })
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website',
        // currentYear: new Date().getFullYear() // 已经用上面的helper替代
    });
});

app.get('/about', (req, res) => {
    //res.send('About Page');
    res.render('about.hbs', {
        pageTitle: 'About Page',
        // currentYear: new Date().getFullYear()
    }) // 会渲染你提供的模板，并把你提供的数据传给about.hbs // 已经用上面的helper替代
});

app.get('/bad', (req,res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
})
// listen将应用和机器的端口绑定在一起,接受两个参数，第一个是端口号，第二个位可选参数，是一个函数，当服务器启动后要做的事情
app.listen(3000, () => { // 用端口号3000，也是一个开发经常用的端口号
    console.log('Server is up on port 3000')
});

