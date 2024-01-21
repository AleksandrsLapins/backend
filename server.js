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

app.post('/signup2', (req, res) => {
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


  app.post('/login2', (req, res) => {
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

app.post('/updateUser', (req, res) => {
    const [ name, surname,  password, nickname ] = req.body;

    console.log(name, surname,  password, nickname);

    const sql = 'UPDATE Registered_users SET name=?, surname=?,  password=? WHERE Nickname=?';

    db.query(sql, [name, surname, password, nickname], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ message: 'Error updating user', error: err.message });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'User updated successfully' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    });
});

app.get('/attractions2', (req, res) => {
    const sql = 'SELECT A.*, (SELECT AVG(R.Ratings) FROM Ratings R WHERE R.Attractions = A.Aid) AS average_rating, (SELECT COUNT(*) FROM Ratings R WHERE R.Attractions = A.Aid) AS total_ratings FROM Attractions A;';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching attractions:', err);
            res.status(500).json({ message: 'Error fetching attractions', error: err.message });
        } else {
            res.json(result);
        }
    });
});

app.get(`/attractions2/:id`, (req, res) => {
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

app.get(`/attractions2/:id`, (req, res) => {
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


app.get(`/AttractionsRatings/:id`, (req, res) => {
    const attractionId = req.params.id;
    const attractionId2 = req.params.id;
    const attractionId3 = req.params.id;
    const sql = 'SELECT *, (SELECT AVG(Ratings) FROM Ratings WHERE Attractions = ?) AS average_rating, (SELECT COUNT(*) FROM Ratings WHERE Attractions = ?) AS total_ratings FROM Ratings WHERE Attractions = ?';

    db.query(sql, [attractionId, attractionId2, attractionId3], (err, result) => {
        if (err) {
            console.error('Error fetching attraction ratings details:', err);
            res.status(500).json({ message: 'Error fetching attraction ratings details', error: err.message });
        } else {
            if (result.length > 0) {
                res.json(result); 
            } else {
                res.status(404).json({ message: 'Attraction ratings not found' });
            }
        }
    });
});

app.get(`/VolunteerRatings/:id`, (req, res) => {
    const volunteerId = req.params.id;
    const volunteerId2 = req.params.id;
    const volunteerId3 = req.params.id;
    const sql = 'SELECT *, (SELECT AVG(Ratings) FROM Ratings WHERE Volunteer= ?) AS average_rating, (SELECT COUNT(*) FROM Ratings WHERE Volunteer = ?) AS total_ratings FROM Ratings WHERE Volunteer = ?';

    db.query(sql, [volunteerId, volunteerId2, volunteerId3], (err, result) => {
        if (err) {
            console.error('Error fetching volunteer ratings details:', err);
            res.status(500).json({ message: 'Error fetching volunteer ratings details', error: err.message });
        } else {
            if (result.length > 0) {
                res.json(result); 
            } else {
                res.status(404).json({ message: 'Volunteer ratings not found' });
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

  app.delete('/comments/:commentId', (req, res) => {
    const commentId = req.params.commentId;

    const sql = 'DELETE FROM Comments WHERE Cid = ?';

    db.query(sql, [commentId], (err, result) => {
        if (err) {
            console.error('Error deleting comment:', err);
            res.status(500).json({ message: 'Error deleting comment', error: err.message });
        } else {
            if (result.affectedRows > 0) {
                res.json({ message: 'Comment deleted successfully' });
            } else {
                res.status(404).json({ message: 'Comment not found' });
            }
        }
    });
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

app.get('/volunteer2', (req, res) => {
    const sql = 'SELECT V.*, (SELECT AVG(R.Ratings) FROM Ratings R WHERE R.Volunteer = V.Vid) AS average_rating, (SELECT COUNT(*) FROM Ratings R WHERE R.Volunteer = V.Vid) AS total_ratings FROM Volunteer_work V';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching volunteer:', err);
            res.status(500).json({ message: 'Error fetching volungeer', error: err.message });
        } else {
            res.json(result);
        }
    });
});

app.get(`/volunteer2/:id`, (req, res) => {
    const volunteerID = req.params.id;
    const sql = 'SELECT * FROM `Volunteer_work` WHERE Vid = ?';

    db.query(sql, [volunteerID], (err, result) => {
        if (err) {
            console.error('Error fetching volunteer details:', err);
            res.status(500).json({ message: 'Error fetching volunteer details', error: err.message });
        } else {
            if (result.length > 0) {
                res.json(result[0]); // Assuming there's only one attraction with the given ID
            } else {
                res.status(404).json({ message: 'Volunteer not found' });
            }
        }
    });

});


app.get('/eco_offers2', (req, res) => {
    const sql = 'SELECT e.*, r.Nickname, (SELECT AVG(rat.Ratings) FROM Ratings rat WHERE rat.Eco_offers = e.EOid) AS average_rating, (SELECT COUNT(*) FROM Ratings rat WHERE rat.Eco_offers = e.EOid) AS total_ratings FROM `Eco_offers` e, Registered_users r WHERE e.Users_id = r.RGid';


    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching eco_offers:', err);
            res.status(500).json({ message: 'Error fetching ec_offers', error: err.message });
        } else {
            res.json(result);
        }
    });
});

app.post('/addeco', (req, res) => {
    const { Content, Nickname, City } = req.body;

    console.log(Content, Nickname, City);

    const sql = 'INSERT INTO Eco_offers (Content, City, Users_id) VALUES (?,  ?,  (Select RGid FROM Registered_users WHERE Nickname = ?))';
    db.query(sql, [Content , City , Nickname], (err, result) => {
      if (err) {
        console.error('Error inserting eco offers:', err);

        if (!err.sqlMessage) {
            throw err;
        }

        res.status(500).json({ message: 'Error adding eco offers', error: err.message });
      } else {
        res.status(200).json({ message: 'Eco offers adding' });
      }
      }
    );
  });


app.post('/ecoratings', (req, res) => {
    const [ nickname, EOid, rating] = req.body;

    console.log( nickname, EOid, rating);

    const sql = 'INSERT INTO Ratings (Ratings,  Users, Eco_offers) VALUES (?, (Select RGid FROM Registered_users WHERE Nickname = ?), ?)';
    db.query(sql, [rating, nickname, EOid], (err, result) => {
      if (err) {
        console.error('Error inserting ratings eco_offers:', err);

        if (!err.sqlMessage) {
            throw err;
        }

        res.status(500).json({ message: 'Error adding ratingst', error: err.message });
      } else {
        res.status(200).json({ message: 'Comment ratings' });
      }
      }
    );
  });

  app.post('/attractionsratings', (req, res) => {
    const [ nickname, Aid, rating] = req.body;

    console.log( nickname, Aid, rating);

    const sql = 'INSERT INTO Ratings (Ratings,  Users, Attractions) VALUES (?, (Select RGid FROM Registered_users WHERE Nickname = ?), ?)';
    db.query(sql, [rating, nickname, Aid], (err, result) => {
      if (err) {
        console.error('Error inserting ratings attractions:', err);

        if (!err.sqlMessage) {
            throw err;
        }

        res.status(500).json({ message: 'Error adding ratings', error: err.message });
      } else {
        res.status(200).json({ message: 'Comment ratings' });
      }
      }
    );
  });

  app.post('/volunteerratings', (req, res) => {
    const [ nickname, Vid, rating] = req.body;

    console.log( nickname, Vid, rating);

    const sql = 'INSERT INTO Ratings (Ratings,  Users, Volunteer) VALUES (?, (Select RGid FROM Registered_users WHERE Nickname = ?), ?)';
    db.query(sql, [rating, nickname, Vid], (err, result) => {
      if (err) {
        console.error('Error inserting ratings attractions:', err);

        if (!err.sqlMessage) {
            throw err;
        }

        res.status(500).json({ message: 'Error adding ratings', error: err.message });
      } else {
        res.status(200).json({ message: 'Comment ratings' });
      }
      }
    );
  });



const path = require('path')
console.log(__dirname)
app.use(express.static(path.join(__dirname, "build")))
app.use(express.static(path.join(__dirname, "uploads")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html")) 
})




app.listen(8081, () => {
    console.log('Server running on port 8081');
})