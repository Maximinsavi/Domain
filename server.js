const path = require('path');

// ...

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email=?", [email], (err, user) => {
        if(err) return res.send(err.message);
        if(user && bcrypt.compareSync(password, user.password)){
            req.session.userId = user.id;
            res.sendFile(path.join(__dirname, 'dashboard.html')); // redirige correctement
        } else {
            res.send("Email ou mot de passe incorrect");
        }
    });
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    stmt.run(username, email, hash, function(err){
        if(err) return res.send("Erreur inscription : " + err.message);
        res.sendFile(path.join(__dirname, 'login.html')); // redirige vers login correctement
    });
});