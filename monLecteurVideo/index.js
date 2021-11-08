
import './lib/webaudio-controls.js';

const getBaseURL = () => {
    return new URL('.', import.meta.url);
};

let style = `
figure {
    max-width:80%;
    width:100%;
    max-height:80%;
    height:100%;
    margin:1.25rem auto;
    padding:1.051%;
 }

 #player {
     width: 50%;
     display: block;
     margin: 0 auto;

 }
 
.controls {
    width:100%;
    height:8.0971659919028340080971659919028%;
    position:relative;
 }

.controls > * {
    float:left;
    width:3.90625%;
    height:100%;
    margin-left:0.1953125%;
    display:block;
 }
 

 .controls .progress {
    cursor:pointer;
    width: 70%;
 }

 progress[value] {
    appearance: none;
    border: none;
    color: #f59842;
  }

 .controls button {
    border:none;
    cursor:pointer;
    background:transparent;
    background-size:contain;
    background-repeat:no-repeat;
 }

 .controls button:hover, .controls button:focus {
    opacity:0.5;
 }

 .controls progress {
    display:block;
    width:100%;
    height:10%;
    margin-top:1.6rem;
    border:none;
    border-radius:2px;
 }

 .controls progress span {
    width:0%;
    height:100%;
    display:inline-block;
    background-color:#558055;
 }

 .controls progress[data-state="fake"] {
    background:#e6e6e6;
    height:65%;
 }

 #volume {
     padding: 1% 0;
 }

 .fas {
     color: #ff5752;
 }

 #vitesse4x {
    font-family: 'Fredoka One', cursive;
    font-size: 24px;
    color: #ff5752;
 }

 .infoControls {
    margin: 0 auto;
    width: 100%;
    border-radius: 3px;
    color: #ff5752;
    font-family: 'Fredoka One';
}
`;
let template = /*html*/`
<body>
    <video id="player" crossorigin="anonymous">
    </video>
    <br><button id="play" onclick="play()"><img src="./assets/play1.png"></img></button>
    <button id="pause" onclick="pause()"><img src="./assets/pause.png"></img></button>
    <button id="info" onclick="getInfo()"><img src="./assets/info.png"></img></button>
    <button id="avance" onclick="avance10s()"></img><img src="./assets/avance.png"></button>
    <button id="recule" onclick="recule10s()"></img><img src="./assets/recule.png"></button>
    <button id="vitesse4x" onclick="vitesse4x()"></img><img src="./assets/x4.jpg"></button>
    <button id="vitesse" onclick="vitesseNormale()">Vitesse Normale</button>
    <button id="fullscreen" onclick="fullscreen()">Plein écran</button>
    <webaudio-knob oninput="setVolume(value)" id="volume" src="./assets/lineshadow2.png" value=0.5 min=0 max=1
        step=0.01 diameter="64" tooltip="Volume: %s">
    </webaudio-knob>

    <div class="infoControls">
    <label for="pannerSlider">Balance</label>
    <input type="range" min="-1" max="1" step="0.1" value="0" id="pannerSlider" />
    </div>
    
</body>
   `;

class MyVideoPlayer extends HTMLElement {
    constructor() {
        super();
        console.log("BaseURL = " + getBaseURL());
        this.attachShadow({ mode: "open" });
    }

    fixRelativeURLs() {
        // pour les knobs
        let knobs = this.shadowRoot.querySelectorAll('webaudio-knob, webaudio-switch, webaudio-slider');
        knobs.forEach((e) => {
            let path = e.getAttribute('src');
            e.src = getBaseURL() + '/' + path;
        });
    }
    connectedCallback() {
        // Appelée avant affichage du composant
        //this.shadowRoot.appendChild(template.content.cloneNode(true));
		this.shadowRoot.innerHTML = `<style>${style}</style>${template}`;
        
        this.fixRelativeURLs();

        this.player = this.shadowRoot.querySelector("#player");
        // récupération de l'attribut HTML
        this.player.src = this.getAttribute("src");
        this.ctx = window.AudioContext || window.webkitAudioContext;
        //let volume = document.querySelector("#volume");

        // déclarer les écouteurs sur les boutons
        this.definitEcouteurs();
    }

    definitEcouteurs() {
        console.log("ecouteurs définis")
        let i = 0;
        this.shadowRoot.querySelector("#play").onclick = () => {
            this.play();
            this.context = new this.ctx();
            if (i==0) this.buildAudioGraphPanner();
         }
        this.shadowRoot.querySelector("#pause").onclick = () => {
            this.pause();
        }
        this.shadowRoot.querySelector("#avance").onclick = () => {
            this.avance10s();
        }
        this.shadowRoot.querySelector("#recule").onclick = () => {
            this.recule10s();
        }
        this.shadowRoot.querySelector("#vitesse4x").onclick = () => {
            this.vitesse4x();
        }
        this.shadowRoot.querySelector("#vitesse").onclick = () => {
            this.vitesseNormale();
        }
        this.shadowRoot.querySelector("#vitesse").onclick = () => {
            this.vitesseNormale();
        }
        this.shadowRoot.querySelector("#info").onclick = () => {
            this.getInfo();
        }
        this.shadowRoot.querySelector("#fullscreen").onclick = () => {
            this.fullscreen();
        }

        this.shadowRoot.querySelector("#volume").oninput = (event) => {
            const vol = parseFloat(event.target.value);
            this.player.volume = vol;
        }
        player.ontimeupdate = () => {
            console.log("Temps courant = " + player.currentTime)
        }
    
        player.onended = () => {
            console.log("video terminée");
        }
        this.shadowRoot.querySelector("#pannerSlider").oninput = (evt) => {
            this.pannerNode.pan.value = evt.target.value;
        }
    }

    // API de mon composant
    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }
    avance10s() {
        this.player.currentTime += 10;
    }
	
    recule10s() {
        this.player.currentTime -= 10;
    }

    vitesse4x() {
        this.player.playbackRate = 4;
    }

    vitesseNormale() {
        this.player.playbackRate = 1;
    }

    setVolume(value) {
        this.player.volume = value
        console.log(value)
    }
	
    getInfo() {
        console.log("Durée de la vidéo : " + this.player.duration);
        console.log("Temps courant : " + this.player.currentTime);
    }
	
    fullscreen(){
        this.player.requestFullscreen()
    }
	
    buildAudioGraphPanner() {
        // create source and gain node
         this.source = this.context.createMediaElementSource(this.player);
        this.pannerNode = this.context.createStereoPanner();

        // connect nodes together
        this.source.connect(this.pannerNode);
        this.pannerNode.connect(this.context.destination);
    }
}
customElements.define("my-player", MyVideoPlayer);
