// Route pour la page de connexion
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Route pour la page d'inscription
app.get('/register.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

// Route pour traiter l'inscription
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    // Code pour enregistrer l'utilisateur dans la base de données
    res.redirect('/login.html');
});

// Route pour traiter la connexion
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Code pour vérifier les identifiants de l'utilisateur
    req.session.userId = user.id; // Exemple de stockage de l'ID utilisateur dans la session
    res.redirect('/dashboard.html');
});