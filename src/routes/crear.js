const express = require('express');
const router = express.Router();

const pool = require('../database');

const helpers = require('../lib/helpers');
let multer = require('multer');
let upload = multer();

router.post('/crearDoctor', upload.fields([]), async (req, res, next) => {
  try {
    const { nombre, apellido, usuario, sexo, especialidad, turno, correo, contrasena } = req.body;
    const passwordencriptado = await helpers.encryptPassword(contrasena);
    const newDoctor = {
      nombre,
      apellido,
      usuario,
      sexo,
      especialidad,
      turno,
      correo,
      contrasena: passwordencriptado,
      tipoUsuario: 'doctor'
    }
    await pool.query('CALL heroku_ac61479f38e9e23.crearDoctor(?)', [Object.values(newDoctor)]);
    const doctores = await pool.query('CALL heroku_ac61479f38e9e23.listarDoctores()');
    res.status(201).json({
      doctores: doctores[0],
      msg: 'Doctor creado'
    });
  } catch (err) {
    next(err);
  }
});
router.post('/crearPaciente', upload.fields([]), async (req, res, next) => {
  try {
    console.log(req.body)
    const { nombre, apellidoP, apellidoM, dni, sexo, vigencia, tipoSeguro, correo, contrasena, centro } = req.body;
    const passwordencriptado = await helpers.encryptPassword(contrasena);
    const newPaciente = {
      nombre,
      apellidoP,
      apellidoM,
      dni,
      sexo,
      vigencia,
      tipoSeguro,
      correo,
      contrasena: passwordencriptado,
      tipoUsuario: 'paciente',
      centro
    }
    await pool.query('CALL heroku_ac61479f38e9e23.crearPaciente(?)', [Object.values(newPaciente)]);
    const pacientes = await pool.query('CALL heroku_ac61479f38e9e23.listarPacientes()');

    res.status(201).json({
      paciente: pacientes[0],
      msg: 'Paciente creado'
    });
  } catch (err) {
    next(err);
  }
});
router.post('/crearCama', upload.fields([]), async (req, res, next) => {
  try {
    console.log(req.body)
    const { sala, ocupada, paciente } = req.body

    const newCama = {
      sala,
      estado: ocupada,
      idUsuario: paciente
    }
    await pool.query('CALL heroku_ac61479f38e9e23.crearCama(?)', [Object.values(newCama)]);
    const camas = await pool.query('CALL heroku_ac61479f38e9e23.listarCamas()');

    res.status(201).json({
      camas: camas[0],
      msg: 'Cama creado'
    });
  } catch (err) {
    next(err);
  }
});

router.post('/editarCama', upload.fields([]), async (req, res, next) => {
  try {
    console.log(req.body)
    const { idCama, sala, estado, idUsuario } = req.body
    const newCama = {
      sala,
      estado,
      idUsuario
    }
    await pool.query('UPDATE heroku_ac61479f38e9e23.camas set ? where idcamas = ?', [newCama, idCama]);
    const camas = await pool.query('CALL heroku_ac61479f38e9e23.listarCamas()');

    res.status(201).json({
      camas: camas[0],
      msg: 'Cama editada'
    });
  } catch (err) {
    next(err);
  }
});

router.post('/editarPaciente', upload.fields([]), async (req, res, next) => {
  try {
    const { id, correo, centro, fecha } = req.body
    const userEdit = {
      email: correo,
    }
    const pacienteEdit = {
      vigencia: fecha,
      centro: centro
    }

    await pool.query('UPDATE user set ? where id = ?', [userEdit, id]);
    await pool.query('UPDATE pacientes set ? where idUsuario = ?', [pacienteEdit, id]);

    res.status(201).json({
      msg: 'Paciente editada'
    });
  } catch (err) {
    next(err);
  }
});


module.exports = router