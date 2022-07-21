m = {}

const themes = {
  "default":{
    "style":`body { margin: 0px auto; overflow: hidden; }
h1 {color: rgba(247, 251, 255, 0.9); font-size:60px; background-color: rgba(0, 0, 0, 0.8);  border-radius: 20px;  text-align: left; padding-left: 35px; width: fit-content; padding-right: 35px; padding-top: 10px; padding-bottom: 10px;}
h2 {color: rgba(247, 251, 255, 0.9); font-size:55px; background-color: rgba(0, 0, 0, 0.8);  border-radius: 20px;  text-align: left; padding-left: 35px; width: fit-content; padding-right: 35px; padding-top: 10px; padding-bottom: 10px;}
a {color: rgba(211, 224, 237,0.9)};`,

    "body":`<div>
<h1 style="__EXT_config.youtube.displayTitle__" id="title">__DATA_title__</h1>
<h2 style="__EXT_config.youtube.displayChapter__" id="chapter">__DATA_chapter__</h2>
</div>`
  },
  
"default-paused":{
    "style":`body { margin: 0px auto; overflow: hidden; }
h1 {color: rgba(247, 251, 255, 0.9); font-size:60px; background-color: rgba(0, 0, 0, 0.8);  border-radius: 20px;  text-align: left; padding-left: 35px; width: fit-content; padding-right: 35px; padding-top: 10px; padding-bottom: 10px;}
h2 {color: rgba(247, 251, 255, 0.9); font-size:55px; background-color: rgba(0, 0, 0, 0.8);  border-radius: 20px;  text-align: left; padding-left: 35px; width: fit-content; padding-right: 35px; padding-top: 10px; padding-bottom: 10px;}
a {color: rgba(211, 224, 237,0.9)};`,

    "body":`<div>
<h2 style="__EXT_config.youtube.displayPause__">__DATA_config.youtube.pausedText__</h2>
</div>`
  },
}

function getTheme(id,serverLink){
    const theme =  (themes[id]) ? themes[id] : themes["default"]
    scriptText = `
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.5.1/socket.io.js"></script>
    <script>
      let params = (new URL(document.location)).searchParams;
      let token = params.get("token");
      var socket = io("${serverLink}?token="+token);

      socket.on("data", (data) => {
        console.log("Data received:",data)
        const cfg = data.config.youtube
        if(data.paused == false){
        if(data.title == "" || cfg.displayTitle == false){
          document.getElementById("title").style = "visibility: hidden"
        }else{
          document.getElementById("title").innerHTML = data.title
          document.getElementById("title").style = "visibility: visible"
        }


        if(data.chapter == "" || cfg.displayChapter == false){
          document.getElementById("chapter").style = "visibility: hidden"
        }else{
          document.getElementById("chapter").innerHTML = data.chapter
          document.getElementById("chapter").style = "visibility: visible"
        }
        }else{
          if(cfg.displayPause == true){
            document.getElementById("title").innerHTML = cfg.pausedText
            document.getElementById("chapter").style = "visibility: hidden"
          }else{
            document.getElementById("chapter").style = "visibility: hidden"
            document.getElementById("title").style = "visibility: hidden"
          }
        }
        
      });
    </script>`
  
    const html = `<!DOCTYPE html><html>
    <head><style>${theme.style}</style></head>
    <body>${theme.body}
    ${scriptText}
    </body>
    </html>`

    return html
}

m.getTheme = getTheme

module.exports = m