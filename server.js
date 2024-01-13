const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json())

const db = mysql.createConnection({
    user: 'codeigniter',
    host: 'localhost',
    password: 'codeigniter2019',
    database: 'SISIII2024_76230034'
})

app.post('/signup', (req, res) => {
    const { name, surname, nickname, password } = req.body;
  
    const sql = 'INSERT INTO Registered_users (name, surname, nickname, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, surname, nickname, password], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);

        if (!err.sqlMessage) {
            throw err;
        }

        res.status(500).json({ message: 'Error registering user', error: err.message });
      } else {
        res.status(200).json({ message: 'Registration successful' });
      }
    });
  });


  app.post('/login', (req, res) => {
    const { nickname, password } = req.body;

    const sql = 'SELECT * FROM Registered_users WHERE nickname = ? AND password = ?';
    db.query(sql, [nickname, password], (err, result) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'Error during login', error: err.message });
        } else {
            if (result.length > 0) {
                res.json({ message: 'Success' });
            } else {
                res.json({ message: 'Invalid credentials' });
            }
        }
    });
});

app.get('/attractions', (req, res) => {
    const sql = 'SELECT * FROM `Attractions`';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching attractions:', err);
            res.status(500).json({ message: 'Error fetching attractions', error: err.message });
        } else {
            res.json(result);
        }
    });
});

app.get(`/attractions/:id`, (req, res) => {
    const attractionId = req.params.id;
    const sql = 'SELECT * FROM `Attractions` WHERE Aid = ?';

    db.query(sql, [attractionId], (err, result) => {
        if (err) {
            console.error('Error fetching attraction details:', err);
            res.status(500).json({ message: 'Error fetching attraction details', error: err.message });
        } else {
            if (result.length > 0) {
                res.json(result[0]); // Assuming there's only one attraction with the given ID
            } else {
                res.status(404).json({ message: 'Attraction not found' });
            }
        }
    });
});

app.get(`/comments/:id`, (req, res) => {
    const attractionId = req.params.id;
    const sql = 'SELECT c.*, r.Nickname FROM Comments c, Registered_users r WHERE Attractions = ? AND r.RGid = c.Users';

    db.query(sql, [attractionId], (err, result) => {
        if (err) {
            console.error('Error fetching attraction details:', err);
            res.status(500).json({ message: 'Error fetching attraction details', error: err.message });
        } else {
            if (result.length > 0) {
                res.json(result); 
            } else {
                res.status(404).json({ message: 'Attraction not found' });
            }
        }
    });
});

app.get(`/review/:id`, (req, res) => {
    const reviewid = req.params.id;
    const sql = 'SELECT * FROM Review r, Attractions a WHERE a.Aid = ? AND a.Reviews=r.Rid';

    db.query(sql, [reviewid], (err, result) => {
        if (err) {
            console.error('Error fetching Review details:', err);
            res.status(500).json({ message: 'Error fetching Review details', error: err.message });
        } else {
            if (result.length > 0) {
                res.json(result); 
            } else {
                res.status(404).json({ message: 'Review not found' });
            }
        }
    });
});

app.get(`/attractions/:id`, (req, res) => {
    const attractionId = req.params.id;
    const sql = 'SELECT * FROM `Attractions` WHERE Aid = ?';

    db.query(sql, [attractionId], (err, result) => {
        if (err) {
            console.error('Error fetching attraction details:', err);
            res.status(500).json({ message: 'Error fetching attraction details', error: err.message });
        } else {
            if (result.length > 0) {
                res.json(result[0]); // Assuming there's only one attraction with the given ID
            } else {
                res.status(404).json({ message: 'Attraction not found' });
            }
        }
    });

});

app.post('/addcomment', (req, res) => {
    const { Content, Nickname, Attractions_id } = req.body;

    console.log(Content, Nickname, Attractions_id);

    const sql = 'INSERT INTO Comments (Content, Date, Users, Attractions) VALUES (?, NOW(), (Select RGid FROM Registered_users WHERE Nickname = ?), ?)';
    db.query(sql, [Content, Nickname, Attractions_id], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);

        if (!err.sqlMessage) {
            throw err;
        }

        res.status(500).json({ message: 'Error adding comment', error: err.message });
      } else {
        res.status(200).json({ message: 'Comment added' });
      }
      }
    );
  });

app.get('/home', (req, res) => {
    const sql = 'SELECT * FROM `Attractions`';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching attractions:', err);
            res.status(500).json({ message: 'Error fetching attractions', error: err.message });
        } else {
            res.json(result);
        }
    });
});

app.get('/volunteer', (req, res) => {
    const sql = 'SELECT * FROM `Volunteer`';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching attractions:', err);
            res.status(500).json({ message: 'Error fetching attractions', error: err.message });
        } else {
            res.json(result);
        }
    });
});

app.get('/eco_offers', (req, res) => {
    const sql = 'SELECT * FROM `Eco_offers`';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching attractions:', err);
            res.status(500).json({ message: 'Error fetching attractions', error: err.message });
        } else {
            res.json(result);
        }
    });
});


app.listen(8081, () => {
    console.log('Server running on port 8081');
})