const express = require('express');
const router = express.Router()
module.exports = router;
const modeloTarefa = require('../models/tarefa');
const userModel = require('../models/user')

const backupid = "64262567b6b3a1d705294dac";

let backupAll = {
    acao: "vazio",
    edit: {}
}

   /***********
    * Tarefas *
    ***********/

router.post('/post', verificaJWT, async (req, res) => {
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

router.get('/getParteDaDescricao/:teste',verificaJWT,async (req, res) => {
    try {
    const abc = req.params.teste;
    const resultados = await modeloTarefa.find({descricao: { $regex: abc }});
    res.json(resultados)
    }
    catch (error) {
    res.status(500).json({ message: error.message })
    }
   })
 
router.delete('/delete/:id',verificaJWT,async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id)
        res.json(resultado)
    }
    catch (error) {
    res.status(400).json({ message: error.message })
    }
   })

router.delete('/deleteAll',verificaJWT,async (req, res) =>{
    try{
        const resultado = await modeloTarefa.deleteMany();
    res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
        }
   })

   router.delete('/deleteAllDone',verificaJWT,async (req, res) =>{
    try{
        const resultado = await modeloTarefa.deleteMany({statusRealizada: true})
    res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
        }
   })
   
router.patch('/update/:id', verificaJWT, async (req, res) => {
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

   /***********
    *  Admin  *
    ***********/

   router.delete('/deleteUser/:id',verificaJWT,async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await userModel.findByIdAndDelete(req.params.id)
        res.json(resultado)
    }
    catch (error) {
    res.status(400).json({ message: error.message })
    }
   })


   router.patch('/updateUser/:id', verificaJWT, async (req, res) => {
    try {
    const id = req.params.id;
    const novoUser = req.body;
    const options = { new: true };
    const result = await userModel.findByIdAndUpdate(
    id, novoUser, options
    )
    res.json(result)
    }
    catch (error) {
    res.status(400).json({ message: error.message })
    }
   })

   router.post('/postUser', verificaJWT, async (req, res) => {
    const objetoUser = new userModel({
    nome: req.body.nome,
    hash: generateHash(req.body.senha, "$AB%G6"),
    salt:"$AB%G6",
    admLogado: req.body.admLogado
    })
    try {
    const userSalvo = await objetoUser.save();
    res.status(200).json(userSalvo)
    }
    catch (error) {
    res.status(400).json({ message: error.message })
    }
   })

   router.get('/getAllUsers', verificaJWT, async (req, res) => {
    try {
        const resultados = await userModel.find();
        res.json(resultados)
        }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


    /****************
    *  Requisicoes  *
    *****************/

   
   //Autenticacao
   var jwt = require('jsonwebtoken');
   router.post('/login', async (req, res) => {
    try {
    const data = await userModel.findOne({ 'nome': req.body.nome });
   
    if (data!=null && validPassword(req.body.senha, data.hash, data.salt)) {
    const token = jwt.sign({ id: req.body.user }, 'segredo',
    { expiresIn: 300 });
    return res.json({ token: token , admLogado: data.admLogado});
    }
   
    res.status(500).json({ message: 'Login invalido!' });
    } catch (error) {
    res.status(500).json({ message: error.message })
}
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

   var { createHash } = require('crypto');
function validPassword (senha, hashBD, saltBD) {
hashCalculado=createHash('sha256').update(senha+saltBD).digest('hex');
return hashCalculado === hashBD;
};

function generateHash(senha, saltBD){
    const hashCalculado=createHash('sha256').update(senha+saltBD).digest('hex');
    return hashCalculado;
}
