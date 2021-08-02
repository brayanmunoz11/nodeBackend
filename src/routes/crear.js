const express = require('express');
const router = express.Router();

const pool = require('../database');

let multer = require('multer');
let upload = multer();

router.post('/crearDoctor', upload.fields([]), async (req, res, next) => {
  try {
    console.log(req.body)
    const { nombre, apellido, dni, sexo, especialidad, turno, correo, contrasena } = req.body;

    res.status(201).json({
      msg: 'Doctor creado'
    });
  } catch (err) {
    next(err);
  }
});
router.post('/crearPaciente', upload.fields([]), async (req, res, next) => {
  try {
    console.log(req.body)
    // const { nombre, apellido, dni, sexo, especialidad, turno, correo, contrasena } = req.body;

    res.status(201).json({
      msg: 'Paciente creado'
    });
  } catch (err) {
    next(err);
  }
});
router.post('/crearCama', upload.fields([]), async (req, res, next) => {
  try {
    console.log(req.body)
    // const { nombre, apellido, dni, sexo, especialidad, turno, correo, contrasena } = req.body;

    res.status(201).json({
      msg: 'Cama creado'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router