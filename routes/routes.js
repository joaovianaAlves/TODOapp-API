const express = require('express');
const router = express.Router()
module.exports = router;
const modeloTarefa = require('../models/tarefa');

const backupid = "64262567b6b3a1d705294dac";

let backupAll = {
    acao: "vazio",
    edit: {}
}

router.post('/post', verificaJWT,async (req, res) => {
    const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada
    })
    try {
    const tarefaSalva = await objetoTarefa.save();
    res.status(200).json(tarefaSalva)
    }
    catch (error) {
    res.status(400).json({ message: error.message })
    }
   })

   
router.get('/getAll', verificaJWT, async (req, res) => {
    try {
    const resultados = await modeloTarefa.find();
    res.json(resultados)
    }
    catch (error) {
    res.status(500).json({ message: error.message })
    }
   })

router.get('/getParteDaDescricao/:teste', async (req, res) => {
    try {
    const abc = req.params.teste;
    const resultados = await modeloTarefa.find({descricao: { $regex: abc }});
    res.json(resultados)
    }
    catch (error) {
    res.status(500).json({ message: error.message })
    }
   })
 
router.delete('/delete/:id',async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id)
        res.json(resultado)
    }
    catch (error) {
    res.status(400).json({ message: error.message })
    }
   })

router.delete('/deleteAll',async (req, res) =>{
    try{
        const resultado = await modeloTarefa.deleteMany();
    res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
        }
   })

   router.delete('/deleteAllDone',async (req, res) =>{
    try{
        const resultado = await modeloTarefa.deleteMany({statusRealizada: true})
    res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
        }
   })

router.patch('/undo', async (req, res) =>{
    try {
        const id = backupid;
        const backupObj = await modeloTarefa.findById(id);
        const desc = backupObj.descricao;
        const status = backupObj.statusRealizada
        const newObj = new modeloTarefa({
            descricao: desc,
            statusRealizada : status
        })
        const backup = await modeloTarefa.findByIdAndUpdate(backupid, {descricao: 'BACKUP'}, {statusRealizada: false})
        const result = await newObj.save()
        res.json(result)
        }
        catch (error) {
        res.status(400).json({ message: error.message })
        }
})
   
router.patch('/update/:id',async (req, res) => {
    try {
    const id = req.params.id;
    const novaTarefa = req.body;
    const options = { new: true };
    const result = await modeloTarefa.findByIdAndUpdate(
    id, novaTarefa, options
    )
    res.json(result)
    }
    catch (error) {
    res.status(400).json({ message: error.message })
    }
   })
   
   //Autenticacao
var jwt = require('jsonwebtoken');
router.post('/login', (req, res, next) => {
 if (req.body.nome === 'branqs' && req.body.senha === '1234') {
 const token = jwt.sign({ id: req.body.nome }, 'segredo', { expiresIn: 300 });
 return res.json({ auth: true, token: token });
 }
 res.status(500).json({ message: 'Login invalido!' });
})

//Nova forma de Autorizacao
function verificaJWT(req, res, next) {
    const token = req.headers['id-token'];
    if (!token) return res.status(401).json({
    auth: false, message: 'Token nao fornecido'
    });
    jwt.verify(token,'segredo', function (err, decoded) {
    if (err) return res.status(500).json({ auth: false, message: 'Falha !' });
    next();
    });
   }
   
    