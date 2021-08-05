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

router.get('/terminarCita/:idCita', async (req, res, next) => {
  const {idCita} = req.params

  try {
    await pool.query('UPDATE heroku_ac61479f38e9e23.citas set ? WHERE idCita = ?', [{estado: 'terminada'}, idCita]);
    res.status(200).json({
      msg: 'cita terminada'
    });
  }
  catch (err) {
    next(err);
  }
});

router.get('/listarDoctores/:especialidad/:turno', async (req, res, next) => {
  const {especialidad, turno} = req.params
  console.log({especialidad, turno})
  try {
    const doctores = await pool.query('SELECT u.id as idDoc, u.nombre, u.apellido, d.turno from heroku_ac61479f38e9e23.doctores as d JOIN heroku_ac61479f38e9e23.user as u on d.idUsuario = u.id WHERE d.especialidad = ? and d.turno = ?', [especialidad, turno]);
    res.status(200).json({
      doctores
    });
  }
  catch (err) {
    next(err);
  }
});

router.get('/citasUserPro/:iduser/:estado', async (req, res, next) => {
  const {iduser, estado} = req.params

  try {
    const citas = await pool.query('CALL heroku_ac61479f38e9e23.listarCitasUsuario(?,?)', [iduser, estado]);
    res.status(200).json({
      citas: citas[0]
    });
  }
  catch (err) {
    next(err);
  }
});


router.get('/listarPacientes', async (req, res, next) => {
  try {
    const pacientes = await pool.query('CALL heroku_ac61479f38e9e23.listarPacientes()');
    res.status(200).json({
      pacientes: pacientes[0]
    });
  }
  catch (err) {
    next(err);
  }
});
router.get('/listarCamas', async (req, res, next) => {
  try {
    const camas = await pool.query('CALL heroku_ac61479f38e9e23.listarCamas()');
    res.status(200).json({
      camas: camas[0]
    });
  }
  catch (err) {
    next(err);
  }
});

router.get('/listarDoctores', async (req, res, next) => {
  try {
    const doctores = await pool.query('CALL heroku_ac61479f38e9e23.listarDoctores()');
    res.status(200).json({
      doctores: doctores[0]
    });
  }
  catch (err) {
    next(err);
  }
});

module.exports = router