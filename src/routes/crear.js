const express = require('express');
const router = express.Router();

const pool = require('../database');

const helpers = require('../lib/helpers');
let multer = require('multer');
let upload = multer();

router.post('/crearDoctor', upload.fields([]), async (req, res, next) => {
  try {
    const { nombre, apellidoP, apellidoM, dni, sexo, direccion, fechanac, especialidad, turno, correo, password } = req.body;
    const passwordencriptado = await helpers.encryptPassword(password);
    const newDoctor = {
      nombre,
      apellidoP,
      apellidoM,
      dni,
      sexo,
      especialidad,
      turno,
      correo,
      contrasena: passwordencriptado,
      tipoUsuario: 'doctor',
      direccion,
      fechanac
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
    const { nombre, apellidoP, apellidoM, dni, sexo, direccion, fechanac, vigencia, tipoSeguro, correo, password, centro } = req.body;
    const passwordencriptado = await helpers.encryptPassword(password);
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
      centro,
      direccion,
      fechanac
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
    const { sala, paciente } = req.body

    const newCama = {
      sala,
      estado: 'Ocupada',
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
  console.log(req.body)
  try {
    const { id, sala, paciente: idUsuario } = req.body
    const newCama = {
      sala,
      estado: (idUsuario === 'Sin Paciente') ? 'Desocupada' : 'Ocupada',
      idUsuario: (idUsuario === 'Sin Paciente') ? null : idUsuario
    }
    // console.log({ idCama, sala, idUsuario })
    await pool.query('UPDATE camas set ? where idcamas = ?', [newCama, id]);
    const camas = await pool.query('CALL heroku_ac61479f38e9e23.listarCamas()');

    res.status(201).json({
      data: camas[0],
      msg: 'Cama editada'
    });
  } catch (err) {
    next(err);
  }
});

router.post('/editarPaciente', upload.fields([]), async (req, res, next) => {
  try {
    const { id, correo, centro, vigencia } = req.body
    const userEdit = {
      email: correo,
    }
    const pacienteEdit = {
      vigencia: vigencia,
      centro: centro
    }

    await pool.query('UPDATE user set ? where id = ?', [userEdit, id]);
    await pool.query('UPDATE pacientes set ? where idUsuario = ?', [pacienteEdit, id]);
    const data = await pool.query('CALL heroku_ac61479f38e9e23.listarPacientes()');

    res.status(201).json({
      data: data[0],
      msg: 'Paciente editada'
    });
  } catch (err) {
    next(err);
  }
});

router.post('/editarPersonal', upload.fields([]), async (req, res, next) => {
  try {
    const { id, correo, turno } = req.body
    const userEdit = {
      email: correo,
    }
    const personalEdit = {
      turno: turno
    }

    await pool.query('UPDATE user set ? where id = ?', [userEdit, id]);
    await pool.query('UPDATE doctores set ? where idUsuario = ?', [personalEdit, id]);
    const data = await pool.query('CALL heroku_ac61479f38e9e23.listarDoctores()');

    console.log(req.body)
    res.status(201).json({
      data: data[0],
      msg: 'Paciente editada'
    });
  } catch (err) {
    next(err);
  }
});
router.get('/deletecama/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    console.log(id)
    await pool.query('DELETE FROM camas WHERE idcamas = ?', [id]);

    res.status(201).json({
      msg: 'cama eliminada'
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router