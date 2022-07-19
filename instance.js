var method = Instance.prototype;
const themes = require("./themes")

function Instance(token,senderVersion,language) {
  this.senderVersion = senderVersion

  this.created = new Date()
  this.lastRequested = new Date()

  this.chapter = ""
  this.title = ""
  this.language = language || "en"
  
  this.config = {
    token: token, 
    serverLink: "http://129.151.84.152:3000",
    youtube:{
      pausedText:"The music is currently paused",
      displayTitle:true,
      displayChapter:true,
      themeId: "default",
      displayPause: false,
      detectPause: true
    }
  },

  this.url = "",
  this.paused = false
  
}

method.getConfig = function() {
    return this.config
};

method.updatePause =  function(newState){
  this.paused = newState
  return this
}

method.updateInfo =  function(title, chapter, url,  version, paused){
  this.chapter = chapter
  this.title = title
  this.url = url
  this.senderVersion = version
  this.paused = paused
}

method.updatePartial = function(data){
  data.forEach(setting=>{
    this[setting.key] = setting.value
  })

  return this
}

method.updateSettings = function(cfg){

  let token = this.config.token
  let surl = this.config.serverLink
  
  this.config = cfg

  this.config.serverLink = surl
  this.config.token = token
}

method.save = function(){
  return JSON.stringify(this)
}

method.load = function(string){
  data = JSON.parse(string)
  Object.keys(data).forEach(key=>{
    this[key] = data[key]
  })
  this.lastRequested = new Date(this.lastRequested)

  return this
}
function multiIndex(obj,is) {  // obj,['1','2','3'] -> ((obj['1'])['2'])['3']
    return is.length ? multiIndex(obj[is[0]],is.slice(1)) : obj
}
function pathIndex(obj,is) {   // obj,'1.2.3' -> multiIndex(obj,['1','2','3'])
    return multiIndex(obj,is.split('.'))
}

method.getHtml = function(){
 const instance = this
  if(instance.paused == false){
   theme = themes.getTheme(this.config.youtube.themeId)
  }else{
    theme = themes.getTheme(this.config.youtube.themeId + "-paused")
  }
  function replaceString(_, str) {
    let data = pathIndex(instance, str)
      txt = data ? data : "";
    return txt;
  }

  function replaceVisibility(_, str){
     data = pathIndex(instance, str)
     return "visibility: " + ((data==true) ? "visible" : "hidden") + ";"
  }
    
  var messageRegex = /__DATA_(\S+)__/g;
  theme = theme.replace(
    messageRegex,
    replaceString
  ); 

  var messageRegex = /__EXT_(\S+)__/g;
  theme = theme.replace(
    messageRegex,
    replaceVisibility
  ); 
  return theme
  
  
}

method.resetLastUpdate = function(){
  this.lastRequested = new Date()
}

method.getOverview = function(){
  return `<a href=${this.url}>${this.title}</a>: ${this.chapter}; (${this.senderVersion}, ${this.language})`
}
  
module.exports = Instance;  