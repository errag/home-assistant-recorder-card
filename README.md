# home-assistant audio-recorder-card (Beta)

![audio-recorder-card](https://raw.githubusercontent.com/spifitu/images/main/audio-recorder-card.PNG)

You can use this card to record your voice and send a wav file via http to a server (e.g. rhasspy). 

The card uses [recorder.js by addpipe](https://github.com/addpipe/simple-recorderjs-demo)

<a href="https://www.buymeacoffee.com/spifitu" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

# Installation

Download the repositiory and extract it to your `home-assistant config directory`. The filestructure should be like this:

```
<hass-config-folder>
    ├── custom_components                   
        ├──  recorder_service
            ├── __init__.py  
            ├── manifest.json 
    ├── www
        ├── audio-recorder-card
            ├── images
                ├── ...
            ├── audio-recorder-card.js
```

Add to your `configuration.yaml`:

```
recorder_service:
```

Add the `resource` to your home-assistant:

```
url: /local/audio-recorder-card/audio-recorder-card.js?v=0.1
type: module
```

###### RESTART HOME-ASSISTANT

# How to use the card

Goto your Dashboard and add a new card. At the bottom you will find the `audio-recorder-card`. 

![Add the audio-recorder-card](https://raw.githubusercontent.com/spifitu/images/main/find-audio-recorder-card.PNG)

Or you write into the yaml directly `type:'custom:audio-recorder-card'`.

##### Card settings:

attribute | description | example
------------ | ------------- | -------------
target **(required)**  | the url of the http server you want to send the wav file | `http://<your-rhasspi-url>:12101/api/speech-to-intent`
header **(optional)** | add a header to your recorder card | `My awesome recorder`
color **(optional)** | change the css color attribute of the recorder | `ligthgreen`
size **(optional)** | change the size of the recorder (default=50px) | `100px`

##### Simple example:

```
type: 'custom:audio-recorder-card'
target: 'http://localhost:12101/api/speech-to-intent'
```

Then the audio recorder card should appear:

![audio-recorder-card](https://raw.githubusercontent.com/spifitu/images/main/audio-recorder-card.PNG)

to start the recording click once on the record button:

![audio-recorder-card](https://raw.githubusercontent.com/spifitu/images/main/audio-recorder-card-recording.PNG)

to stop the recording click once again on the recorder button. Now the recording_service will send the wav file to your defined target http server.

# Problems

At the moment the card is only available in browsers. This function will be added in the next version.

# Thanks to

recorder.js:
[addpipe/simple-recorderjs-demo](https://github.com/addpipe/simple-recorderjs-demo)

css-styling:
[u_conor](https://codepen.io/u_conor/pen/xrbNeK)
