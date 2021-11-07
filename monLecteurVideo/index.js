const template = document.createElement("template");

template.innerHTML = /*html*/`
  <style> 
  </style>

  <video id="player" controls
         src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4">
      <br>
  </video>
  <br>
  <button id="play">PLAY</button>
  <button id="pause">PAUSE</button>
  <button id="info">GET INFO</button>
  <button id="avance10">+10s</button>
  <button id="vitesse4" >Vitesse 4x</button>
 `;

class MyVideoPlayer extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }
  
    connectedCallback() {
     // Appelée avant affichage du composant
     this.shadowRoot.appendChild(template.content.cloneNode(true));

     this.player = this.shadowRoot.querySelector("#player");

     // déclarer les écouteurs sur les boutons
     this.definitEcouteurs();
    }

    definitEcouteurs() {
        console.log("ecouteurs définis")
        this.shadowRoot.querySelector("#play").onclick = () => {
            this.play();
        }
        this.shadowRoot.querySelector("#pause").onclick = () => {
            this.pause();
        }
    }
  
    // API de mon composant
    play() {
        this.player.play();
    }

    pause() {
        this.player.pause();
    }
  }
  
  customElements.define("my-player", MyVideoPlayer);
  