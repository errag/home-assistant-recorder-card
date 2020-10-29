function loadScript(type, url)
{
  if(type.toUpperCase() == "CSS")
  {
    const link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  }
  else if (type.toUpperCase() == "JS")
  {
    const link = document.createElement("script");
    link.src = url;
    document.head.appendChild(link);
  }
}

function loadRecorderJS()
{
  loadScript("JS", "https://cdn.rawgit.com/mattdiamond/Recorderjs/08e7abd9/dist/recorder.js");
}

function isNull(test, value)
{
    if(test != undefined && test != null)
        value = test;

    return value;
}

function toggleRecording(button, hass, config)
{
    if(config.cardRec != null && config.cardRec.recording)
        stopRecording(button, hass, config);
    else
        startRecording(button, hass, config);
}

function startRecording(button, hass, config)
{
    try
    {
        var constraints = { audio: true, video: false };

	if(typeof Recorder == "undefined")
            loadRecorderJS();

        var AudioContext = window.AudioContext || window.webkitAudioContext;

	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
	    var audioContext = new AudioContext();
	    config.gumStream = stream;
	    var cardInput = audioContext.createMediaStreamSource(stream);

	    config.cardRec = new Recorder(cardInput,{ numChannels: 1 });
	    config.cardRec.record();

            var icon = button.getElementsByTagName("img")[0];
            icon.src = icon.getAttribute('data-icon-rec');

	    button.getElementsByClassName("isRecording")[0].classList.remove('hide');
	}).catch(function(err) {
	    showMessage(err.toString(), err.message, config);
	});
    }
    catch(err)
    {
	showMessage("Error", "Unknown - " + err.message, config);
    }
}

function stopRecording(button, hass, config)
{
    config.cardRec.stop();
    config.gumStream.getAudioTracks()[0].stop();

    var icon = button.getElementsByTagName("img")[0];
    icon.src = icon.getAttribute('data-icon-img');

    button.getElementsByClassName("isRecording")[0].classList.add('hide');

    config.cardRec.exportWAV(function(blob) {
        blob.arrayBuffer().then(buffer => {
             hass.callService("recorder_service", "process", {
                 wav: Array.from(new Uint8Array(buffer)),
                 target: config.TARGET
             });
         });
    });
}

function showMessage(type, message, config)
{
    config.info.classList.remove("hide");
    config.info.innerHTML = type + ": " + message;

    if(config.timeout != null)
        clearTimeout(config.timeout);

    config.timeout = window.setTimeout(function() {
        hideMessage(config);
    }, 5000);
}

function hideMessage(config)
{
    config.info.classList.add("hide");
    config.info.innerHTML = "";

    config.timeout = null;
}


class AudioRecorderCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      // set variables
      this.vars = {};
      this.vars.TARGET = isNull(this.config.target, '');
      this.gumStream = null;
      this.cardRec = null;
      this.info = null;
      this.timeout = null;
      this.TARGET = null;

      // create card
      var card = document.createElement('ha-card');

      // header if exists
      const header = isNull(this.config.header, '')

      if(header.length > 0)
          card.header = header;

      // record button
      this.content = document.createElement('div');
      this.content.id = "container";

      const params = this.vars;
      var recorder = document.createElement('button');
      recorder.onclick = function() {
        toggleRecording(this, hass, params);
      };
      recorder.id = "buttonRecord";

      var iconImg = isNull(this.config.icon, '/local/audio-recorder-card/images/microphone.svg');
      var iconRec = isNull(this.config.icon_rec, '/local/audio-recorder-card/images/microphone_rec.svg');
      var icon = document.createElement('img');
      icon.src = iconImg;
      icon.setAttribute('data-icon-img', iconImg);
      icon.setAttribute('data-icon-rec', iconRec);

      var pulse = document.createElement('div');
      pulse.classList.add('isRecording');
      pulse.classList.add('hide');

      this.vars.info = document.createElement('span');
      this.vars.info.id = 'spanInfo';
      this.vars.info.classList.add('hide');

      recorder.appendChild(icon);
      recorder.appendChild(pulse);
      this.content.appendChild(recorder);
      this.content.appendChild(this.vars.info);
      card.appendChild(this.content);

      this.styles = document.createElement('style');
      card.appendChild(this.styles);
      this.initStyle(this.config.size, this.config.color);

      this.appendChild(card);
    }
  }

  initStyle(size, color) {
    var style = `

.hide {
  display: none;
}

#buttonRecord {
  cursor: pointer;
  border: none;
  border-radius: 100%;
  width: $size;
  height: $size;
  color: #fff;
  margin: 0;
  background: $color;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  ms-touch-action: manipulation;
  touch-action: manipulation;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
}

#spanInfo {
  margin-left: 10px;
}

#buttonRecord:focus {
  border: none;
}

#buttonRecord:hover {
  opacity: 0.75;
}

#buttonRecord img {
  width: $image_size;
  height: $image_size;
}

.isRecording {
  border: none;
  content: '';
  width: $size;
  height: $size;
  border: 5px solid $color;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  left: -5px;
  animation: pulsate infinite 2s;
}

@-webkit-keyframes pulsate {
  0% {
    -webkit-transform: scale(1, 1);
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1.2, 1.2);
    opacity: 0;
  }
}

#container {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 15px;
  padding-bottom: 15px;
}
    `;

     style = style.split('$size').join(isNull(size, '50') + 'px');
     style = style.split('$color').join( isNull(color, '#03A9F4'));
     style = style.split('$image_size').join((parseInt(isNull(size, '50')) / 2) + 'px');

     this.styles.innerHTML = style;
  }

  setConfig(config) {
    if(!config.target)
        throw new Error('Please define a target url for your record');

    this.config = config;
  }
}

customElements.define('audio-recorder-card', AudioRecorderCard);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "audio-recorder-card",
  name: "Audio Recorder Card",
  preview: true,
  description: "Audio-Recorder to send your voice to a server."
});
