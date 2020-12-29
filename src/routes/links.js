const express = require('express');
const router = express.Router();

const pool = require('../database');

let multer = require('multer');
let upload = multer();

router.post('/add', upload.fields([]), async (req, res, next) => {
    // console.log(req.body)
    try {
        let valid = false;
        const { nombre, cuerpo, iduser, tipo } = req.body;
        const newArchive = {
            nombre,
            cuerpo
        };
        if (tipo == 'css'){
            newArchive.iduser = iduser
            await pool.query('INSERT INTO heroku_ac61479f38e9e23.css set ?', [newArchive]);
            valid=true;
        }
        else if (tipo == 'html'){
            newArchive.iduser2 = iduser
            await pool.query('INSERT INTO heroku_ac61479f38e9e23.html set ?', [newArchive]);
            valid=true;
        }
        else if (tipo == 'js'){
            newArchive.iduser1 = iduser
            await pool.query('INSERT INTO heroku_ac61479f38e9e23.js set ?', [newArchive]);
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

router.post('/list',  async (req, res, next) => {
    const {tipo, id} = req.body;
    console.log(req.body)
    try {
        let list
        if (tipo == 'css'){
            list = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.css WHERE iduser = ?', [id]);
        }
        else if (tipo == 'html'){
            list = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.html WHERE iduser2 = ?', [id]);
        }
        else if (tipo == 'js'){
            list = await pool.query('SELECT * FROM heroku_ac61479f38e9e23.js WHERE iduser1 = ?', [id]);
        }
        res.status(201).json({
            data: list,
            message: 'file listed'
        });
    }catch(err){
        next(err);
    }
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