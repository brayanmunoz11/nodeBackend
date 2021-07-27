const express = require('express');
const router = express.Router();

const pool = require('../database');
const helpers = require('../lib/helpers');

let multer = require('multer');
let upload = multer();

router.post('/createCita', async (req, res, next) => {
  const { idDoctor, idPaciente, fecha, turno, especialidad } = req.body
  console.log(req.body)
  const newCita = {
    idDoctor,
    idPaciente,
    fecha,
    turno,
    especialidad
  }

  try {
    const citas = await pool.query('INSERT INTO heroku_ac61479f38e9e23.citas SET ?', [newCita]);
    res.status(200).json({
      msg: 'cita creada'
    });
  }
  catch (err) {
    next(err);
  }
});

router.get('/citaDoctor/:iddoc', async (req, res, next) => {
  const {iddoc} = req.params

  try {
    const citas = await pool.query('CALL heroku_ac61479f38e9e23.todasCitas(?)', [iddoc]);
    res.status(200).json({
      citas: citas[0]
    });
  }
  catch (err) {
    next(err);
  }
});

module.exports = router