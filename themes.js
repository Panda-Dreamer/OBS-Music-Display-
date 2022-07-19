m = {}

const themes = {
  "default":{
    "style":`body { margin: 0px auto; overflow: hidden; }
h1 {color: rgba(247, 251, 255, 0.9); font-size:60px; background-color: rgba(0, 0, 0, 0.8);  border-radius: 20px;  text-align: left; padding-left: 35px; width: fit-content; padding-right: 35px; padding-top: 10px; padding-bottom: 10px;}
h2 {color: rgba(247, 251, 255, 0.9); font-size:55px; background-color: rgba(0, 0, 0, 0.8);  border-radius: 20px;  text-align: left; padding-left: 35px; width: fit-content; padding-right: 35px; padding-top: 10px; padding-bottom: 10px;}
a {color: rgba(211, 224, 237,0.9)};`,

    "body":`<div>
<h1 style="__EXT_title__">__DATA_title__</h1>
<h2 style="__EXT_chapter__">__DATA_chapter__</h2>
</div>`
  }

}

function getTheme(id){
    const theme =  (themes[id]) ? themes[id] : themes["default"]
    const html = `<!DOCTYPE html><html>
    <head><style>${theme.style}</style><meta http-equiv="refresh" content="4" ></head>
    <body>${theme.body}</body>
    </html>`

    return html
}

m.getTheme = getTheme

module.exports = m