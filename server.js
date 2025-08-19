const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'maxchat_secret',
    resave: false,
    saveUninitialized: true
}));

function isAuthenticated(req, res, next) {
    if(req.session.userId) return next();
    res.redirect('/login.html');
}

// Inscription
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    stmt.run(username, email, hash, function(err){
        if(err) return res.send("Erreur inscription : " + err.message);
        res.redirect('/login.html');
    });
});

// Connexion
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email=?", [email], (err, user) => {
        if(err) return res.send(err.message);
        if(user && bcrypt.compareSync(password, user.password)){
            req.session.userId = user.id;
            res.redirect('/dashboard.html');
        } else {
            res.send("Email ou mot de passe incorrect");
        }
    });
});

// Déconnexion
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/index.html');
});

// Ajouter domaine
app.post('/add_domain', isAuthenticated, (req, res) => {
    const { domain_name, extension, registration_date, expiration_date, notes } = req.body;
    const stmt = db.prepare("INSERT INTO domains (user_id, domain_name, extension, registration_date, expiration_date, notes) VALUES (?, ?, ?, ?, ?, ?)");
    stmt.run(req.session.userId, domain_name, extension, registration_date, expiration_date, notes, function(err){
        if(err) return res.send(err.message);
        res.redirect('/dashboard.html');
    });
});

// Récupérer domaines utilisateur (JSON)
app.get('/domains', isAuthenticated, (req, res) => {
    db.all("SELECT * FROM domains WHERE user_id=?", [req.session.userId], (err, rows) => {
        if(err) return res.send(err.message);
        res.json(rows);
    });
});

app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));