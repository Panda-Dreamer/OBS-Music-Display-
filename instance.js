var method = Instance.prototype;
const themes = require("./themes")
const fs = require("fs")

const default_theme = {
  spacing: 35,
  containerBackgroundColor: {
    R: 0,
    G: 0,
    B: 0,
    A: "0",
  },
  containerPadding: "0",
  containerBorderRadius: "0",
  titleBackgroundColor: {
    R: 0,
    G: 0,
    B: 0,
    A: "0.7",
  },
  titlePadding: "10",
  titleBorderRadius: "15",
  titleColor: {
    R: 255,
    G: 255,
    B: 255,
    A: "1",
  },
  titleSize: "60",
  titleFont: "Arial, Helvetica, sans-serif",
  subtitleBackgroundColor: {
    R: 0,
    G: 0,
    B: 0,
    A: "0.7",
  },
  subtitlePadding: "10",
  subtitleBorderRadius: "15",
  subtitleColor: {
    R: 255,
    G: 255,
    B: 255,
    A: "1",
  },
  subtitleSize: "40",
  subtitleFont: "Arial, Helvetica, sans-serif",
}

function Instance(token, senderVersion, language) {
  this.senderVersion = senderVersion

  this.created = new Date()
  this.lastRequested = new Date()

  this.chapter = ""
  this.title = ""
  this.language = language || "en"
  this.theme = default_theme,
    this.config = {
      token: token,
      //serverLink: "http://129.151.84.152:3000",
      serverLink: "https://OBS-Music-Display.omega77073.repl.co",
      youtube: {
        pausedText: "The music is currently paused",
        displayTitle: true,
        displayChapter: true,
        themeId: "default",
        displayPause: true,
        detectPause: true
      },
      spotify: {
        themeId: "default",
        displayPause: true,
        displayTitle: true,
        displayAuthor: true,
        pausedText: "The music is currently paused",
      },
      ytmusic: {
        themeId: "default",
        displayPause: true,
        displayTitle: true,
        displayAuthor: true,
        pausedText: "The music is currently paused",
      },
      pretzel: {
        themeId: "default",
        displayPause: true,
        displayTitle: true,
        displayAuthor: true,
        pausedText: "The music is currently paused",
      },
      soundcloud: {
        themeId: "default",
        displayPause: true,
        displayTitle: true,
        displayAuthor: true,
        pausedText: "The music is currently paused",
      },
    },

    this.url = "",
    this.paused = false
  this.platform = "STOPPED"

}

method.getConfig = function() {
  return this.config
};

method.updatePause = function(newState) {
  this.paused = newState
  return this
}

method.updateInfo = function(title, chapter, url, version, paused, theme, platform, imageUrl, usedPreset) {
  this.chapter = chapter
  this.title = title
  this.url = url
  this.senderVersion = version
  this.paused = paused
  this.theme = theme || default_theme
  this.platform = platform
  this.imageUrl =  imageUrl
  this.usedPreset = usedPreset
}

method.updatePartial = function(data) {
  data.forEach(setting => {
    this[setting.key] = setting.value
  })

  return this
}

method.updateSettings = function(cfg) {

  let token = this.config.token
  let surl = this.config.serverLink

  this.config = cfg

  this.config.serverLink = surl
  this.config.token = token
}

method.save = function() {
  return JSON.stringify(this)
}

method.load = function(string) {
  data = JSON.parse(string)
  Object.keys(data).forEach(key => {
    this[key] = data[key]
  })
  this.lastRequested = new Date(this.lastRequested)

  return this
}
function multiIndex(obj, is) {  // obj,['1','2','3'] -> ((obj['1'])['2'])['3']
  return is.length ? multiIndex(obj[is[0]], is.slice(1)) : obj
}
function pathIndex(obj, is) {   // obj,'1.2.3' -> multiIndex(obj,['1','2','3'])
  return multiIndex(obj, is.split('.'))
}

method.getHtml = function() {
  const instance = this
  if(instance.usedPreset == "platformDefined"){
    return fs.readFileSync(`./files/one.html`,'utf8').toString()
  }
  const data = instance.theme || default_theme
  
  let html = `
  <html>
  <head>
  <style id="style">
  h1,a {
    color: rgba(${data.titleColor.R}, ${data.titleColor.G}, ${data.titleColor.B}, ${data.titleColor.A}); 
    font-size:${data.titleSize}px; 
    background-color: rgba(${data.titleBackgroundColor.R}, ${data.titleBackgroundColor.G}, ${data.titleBackgroundColor.B}, ${data.titleBackgroundColor.A});   
    border-radius: ${data.titleBorderRadius}px;  
    padding: ${data.titlePadding}px;
    font-family: ${data.titleFont};
    width: fit-content;
    margin-bottom: 0px;
  }
  h2 {
    color: rgba(${data.subtitleColor.R}, ${data.subtitleColor.G}, ${data.subtitleColor.B}, ${data.subtitleColor.A}); 
    font-size:${data.subtitleSize}px; 
    background-color: rgba(${data.subtitleBackgroundColor.R}, ${data.subtitleBackgroundColor.G}, ${data.subtitleBackgroundColor.B}, ${data.subtitleBackgroundColor.A});   
    border-radius: ${data.subtitleBorderRadius}px;  
    padding: ${data.subtitlePadding}px;
    font-family: ${data.subtitleFont};
    width: fit-content;
    margin-top: ${data.spacing}px;
  }
  .container {
    background-color: rgba(${data.containerBackgroundColor.R}, ${data.containerBackgroundColor.G}, ${data.containerBackgroundColor.B}, ${data.containerBackgroundColor.A});
	  width: fit-content;
	  padding: ${data.containerPadding}px;
    border-radius: ${data.containerBorderRadius}px;
  }
  </style>
  </head>
  <body>
  <div class="container" id="container">
  <h1 style="visibility: hidden" id="title">My title</h1>
  <h2 style="visibility: hidden" id="chapter">The author of this song</h2>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.js"></script>
    <script>
      let params = (new URL(document.location)).searchParams;
      let token = params.get("token");
      let usedPreset = undefined
      var socket = io("${instance.config.serverLink}?token="+token);
      socket.emit("refresh", token);
      socket.on("data", (data) => {
        console.log("Data received:",data)
        if((data.usedPreset != usedPreset) && usedPreset!=undefined){location.reload();}
        usedPreset = data.usedPreset
        const cfg = data.config[data.platform.toLowerCase()] || {displayTitle:true, displayChapter:true, displayPause:false}
        if(data.paused == false){
        document.getElementById("container").style = "display: block"
        if(data.title == "" || cfg.displayTitle == false){
          document.getElementById("title").style = "display: none"
        }else{
          document.getElementById("title").innerHTML = data.title
          document.getElementById("title").style = "display: block"
        }


        if(data.chapter == "" || cfg.displayChapter == false){
          document.getElementById("chapter").style = "display: none"
        }else{
          document.getElementById("chapter").innerHTML = data.chapter
          document.getElementById("chapter").style = "display: block"
        }
        }else{
          if(cfg.displayPause == true){
            document.getElementById("title").innerHTML = cfg.pausedText
            document.getElementById("chapter").style = "display: none"
            document.getElementById("container").style = "display: block"
          }else{
            document.getElementById("chapter").style = "display: none"
            document.getElementById("title").style = "display: none"
            document.getElementById("container").style = "display: none"
          }
        }
        data = data.theme 
        let newStyle = \`h1 {
    color: rgba(\${data.titleColor.R}, \${data.titleColor.G}, \${data.titleColor.B}, \${data.titleColor.A}); 
    font-size:\${data.titleSize}px; 
    background-color: rgba(\${data.titleBackgroundColor.R}, \${data.titleBackgroundColor.G}, \${data.titleBackgroundColor.B}, \${data.titleBackgroundColor.A});   
    border-radius: \${data.titleBorderRadius}px;  
    padding: \${data.titlePadding}px;
    font-family: \${data.titleFont};
    width: fit-content; 
     margin-bottom: 0px;
  }
  h2 {
    color: rgba(\${data.subtitleColor.R}, \${data.subtitleColor.G}, \${data.subtitleColor.B}, \${data.subtitleColor.A}); 
    font-size:\${data.subtitleSize}px; 
    background-color: rgba(\${data.subtitleBackgroundColor.R}, \${data.subtitleBackgroundColor.G}, \${data.subtitleBackgroundColor.B}, \${data.subtitleBackgroundColor.A});   
    border-radius: \${data.subtitleBorderRadius}px;  
    padding: \${data.subtitlePadding}px;
    font-family: \${data.subtitleFont};
    width: fit-content; 
     margin-top: \${data.spacing}px;
  }
  .container {
    background-color: rgba(\${data.containerBackgroundColor.R}, \${data.containerBackgroundColor.G}, \${data.containerBackgroundColor.B}, \${data.containerBackgroundColor.A});
	  width: fit-content;
	  padding: \${data.containerPadding}px;
    border-radius: \${data.containerBorderRadius}px;
  }\`
        document.getElementById("style").innerHTML = newStyle
      });
    </script>
  </body>
  </html>
  `
  return html
}

method.resetLastUpdate = function() {
  this.lastRequested = new Date()
}

method.getOverview = function() {
  return `<a href=${this.url}>${this.title}</a>: ${this.chapter}; (${this.senderVersion}, ${this.language})`
}

module.exports = Instance;