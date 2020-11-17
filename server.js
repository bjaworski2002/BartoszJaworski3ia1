var express = require("express");
var app = express()
var PORT = process.env.PORT || 3000;
var path = require("path")
var bodyParser = require("body-parser")

app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));

var login = false;
var badlogin = false;
let users = [
    { id: "1", login: "111", password: "111", student: true, gender: "m", wiek: "10" },
    { id: "2", login: "222", password: "222", student: false, gender: "k", wiek: "10" },
    { id: "3", login: "333", password: "333", student: false, gender: "m", wiek: "10" }
]

app.post("/formLogin", function (req, res) {
    if (users.findIndex(users => users.login === req.body.login) != "-1" && users[users.findIndex(users => users.login === req.body.login)].password == req.body.password) {
        login = true;
        badlogin = false;
        res.redirect("/main")
    }
    else {
        badlogin = true;
        res.redirect("/login")
    }
})

app.post("/register", function (req, res) {
    if (users.findIndex(users => users.login === req.body.login) == "-1") {
        users.push(req.body)
        users[users.length - 1].id = users.length;
        res.send("Witaj " + users.login + ", zostałeś zarejestrowany. <br /> <a href='main'>KLIKNIJ TUTAJ</a>, żeby wrócić na stronę główną")
    }
    else {
        badlogin = true;
        res.redirect("/register")
    }
})


app.get("/:id", function (req, res) {
    switch (req.params.id) {
        case 'main':
            if (login)
                res.sendFile(path.join(__dirname + "/static/pages/mainlogged.html"))
            else
                res.sendFile(path.join(__dirname + "/static/pages/main.html"))
            break;
        case 'register':
            res.sendFile(path.join(__dirname + "/static/pages/register.html"))
            break;
        case 'login':
            if (badlogin) {
                res.sendFile(path.join(__dirname + "/static/pages/badlogin.html"))
                badlogin = false;
            }
            else
                res.sendFile(path.join(__dirname + "/static/pages/login.html"))
            break;
        case 'admin':
            if (login)
                res.sendFile(path.join(__dirname + "/static/pages/admin.html"))
            else
                res.sendFile(path.join(__dirname + "/static/pages/403.html"))
            break;
        case 'logout':
            login = false;
            res.redirect("/main")
            break;
        case 'sort':
            let tabelasort = '<a href="main">powrot </a> <a href="gender">gender </a><a href="show">show </a><br />'
            tabelasort += '<form id="sortuj"><input name="sort" type="radio" value="rosnaco">Rosnaco <input name="sort" type="radio" value="malejaco"> Malejaco</form>'
            res.send(tabelasort);
            break;
        case 'gender':
            let tabela = '<a href="main">powrot </a> <a href="sort">sort </a><a href="show">show </a><br /><table>'
            for (let i = 0; i < users.length; i++) {
                if (users[i].gender == 'm') tabela += '<tr><td style="width: 250px;">id: ' + users[i].id + '</td><td style="width: 250px;">plec: ' + users[i].gender + '</td></tr>'
            }
            tabela += '</table><br /><table>'
            for (let i = 0; i < users.length; i++) {
                if (users[i].gender == 'k') tabela += '<tr><td style="width: 250px;">id: ' + users[i].id + '</td><td style="width: 250px;">plec: ' + users[i].gender + '</td></tr>'
            }
            tabela += '</table>'
            res.send(tabela);
            break;
        case 'show':
            if (login) {
                let tabelaLogin = '<a href="main">powrot </a> <a href="sort">sort </a><a href="gender">gender </a><br /><table>'
                for (let i = 0; i < users.length; i++) {
                    tabelaLogin += '<tr style="height: 50px; border: 2px solid yellow;"> <td style="width: 50px;"> id:' + users[i].id + '</td> <td style="width: 100px;"> login:' + users[i].login + '</td> <td style="width: 100px;"> password:' + users[i].password + '</td> <td style="width: 50px;"> wiek:' + users[i].wiek + '</td>'
                    if (users[i].student) tabelaLogin += '<td style="width: 50px;">uczen</td>'
                    else tabelaLogin += '<td style="width: 100px;">nie uczen</td>'
                    tabelaLogin += '<td style="width: 100px;">plec: ' + users[i].gender + '</td><td style="width: 100px;">wiek: ' + users[i].wiek + '</td> </tr>'
                }
                tabelaLogin += '</table>'
                res.send(tabelaLogin);
            }
            else
                res.sendFile(path.join(__dirname + "/static/pages/404.html"))
        default:
            res.sendFile(path.join(__dirname + "/static/pages/404.html"))
            break;
    }
})
app.get("", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/main.html"))
})
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + "/static/pages/404.html"))
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})