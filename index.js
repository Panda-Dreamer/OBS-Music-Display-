const express = require("express")
const uuidP = require('uuid');
const cors = require('cors');
const os = require('os-utils');

const utilities = require("./utilities.js")
const themes = require("./themes.js")
const Instance = require("./instance.js")


const app = express()
app.use(express.json())

app.use(cors());
app.options('*', cors());

const port = 80

const instances = {}

app.get('/', (req, res) => {
  res.send("e")
})

app.options('/create', cors()) 
app.post('/create', (req, res) => {

  if(instances[req.body.token]){
    res.status(403)
    res.send("Instance already exists")
  }
   let instance = createInstance(req.body.senderVersion, req.body.language, req.body.token)
    res.send(instance)
})

function createInstance(version, language, token){
  let uuid = token || uuidP.v4()
  let instance =  new Instance(uuid, version, language)
  instances[uuid] = instance
  return instance
}

function answer(instance, res){
  res.status(200)
  res.send(instance)
}


app.options('/update', cors()) // enable pre-flight request for POST request
app.post('/update', (req, res) => {
  let data = req.body
  let instance
  if(data.config){
    instance =  instances[data.token] || instances[data.config.token] || createInstance(data.version, data.language, req.body.config.token)
  }else{
    instance =  instances[data.token] || createInstance(data.version, data.language, req.body.token)
  }
  instance.resetLastUpdate()
  if(data.type == "full"){
    instance.updateInfo(data.title, data.chapter, data.url, data.version, data.paused)
    answer(instance, res)
  }else if(data.type == "partial"){
    instance.updatePartial(data.list)
    answer(instance, res)
  }else if(data.type == "settings"){
    instance.updateSettings(data.config)
    answer(instance, res)
  }else if(data.type == "pause"){
    instance.updatePause(data.paused)
    answer(instance, res)
  }else{
    res.status(403);
    res.send("type forbidden")
  }
})

app.get('/get', (req, res) => {

  let instance = instances[req.query.token]
  if(!instance){res.status(404); res.send("Instance not found"); return}
  instance.resetLastUpdate()
  if(req.query.format == "json"){
    answer()
  }else if(req.query.format =="cfg"){
    res.send(instance.getConfig())
  }else{
    res.send(instance.getHtml())
  }
})

app.get('/view', (req, res) => {

  str = ""
  Object.keys(instances).forEach(key=>{
    let i = instances[key]
    str = str + i.getOverview() + "<br>"
  })
  
  res.send(`
<!DOCTYPE html><html>
    <head></head>
    <body>${str}</body>
    </html>
`)
})

    
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)

  
})