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
    serverLink: "https://OBS-Music-Display.omega77073.repl.co",
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

method.getHtml = function(){
 const instance = this
  let theme = themes.getTheme(this.config.themeId)
  
  function replaceString(_, str) {
    let txt
      txt = str ? instance[str] : "";
    return txt;
  }

  function replaceVisibility(_, str){
     return "visibility: " + ((instance[str]) ? "visible" : "hidden") + ";"
  }
  var messageRegex = /__DATA_(\w+)__/g;
  theme = theme.replace(
    messageRegex,
    replaceString
  ); 

  var messageRegex = /__EXT_(\w+)__/g;
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