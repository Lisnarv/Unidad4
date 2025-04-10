exports.login = (req, res) => {
    const { username, password } = req.body;
    // Credenciales de ejemplo: admin / admin
    if (username === 'admin' && password === 'admin') {
        req.session.admin = true;
        return res.json({ message: 'Inicio de sesión como administrador exitoso.' });
    } else {
        return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error al cerrar sesión.' });
        } else {
            return res.json({ message: 'Sesión cerrada exitosamente.' });
        }
    });
};
