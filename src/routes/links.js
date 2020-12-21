const express = require('express');
const router = express.Router();

const pool = require('../database');

let multer = require('multer');
let upload = multer();

router.post('/add', upload.fields([]), async (req, res) => {
    let valid = false;
    try {
        const { nombre, cuerpo, iduser, tipo } = req.body;
        const newArchive = {
            nombre,
            cuerpo,
            iduser
        };
        if (tipo == 'css'){
            await pool.query('INSERT INTO heroku_ac61479f38e9e23.css set ?', [newArchive]);
            valid=true;
        }
        else if (tipo == 'html'){
            await pool.query('INSERT INTO heroku_ac61479f38e9e23.html set ?', [newArchive]);
            valid=true;
        }
        else{
            await pool.query('INSERT INTO heroku_ac61479f38e9e23. set ?', [newArchive]);
            valid=true;
        }
        res.status(201).json({
            data: valid,
            message: 'file created'
        });
    }catch(err){
        next(err);
    }
});

router.get('/',  async (req, res) => {
    const links = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.css');
    console.log(links)
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM heroku_ac61479f38e9e23.css WHERE ID = ?', [id]);
    req.flash('success', 'Link Removed Successfully');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const links = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.css WHERE id = ?', [id]);
    res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url} = req.body;
    const newLink = {
        title,
        description,
        url
    };
    console.log(newLink);
    await pool.query('UPDATE heroku_ac61479f38e9e23.css set ? WHERE id = ?', [newLink, id]);
    req.flash('success', 'Link Updated Successfully');
    res.redirect('/links');
});



module.exports = router;