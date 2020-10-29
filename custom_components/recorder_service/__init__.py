import requests

DOMAIN = "recorder_service"

WAV_ATTR_NAME = "wav"
URL_ATTR_NAME = "target"

def setup(hass, config):
    def handle_recorder(call):
        wav = call.data.get(WAV_ATTR_NAME, '')
        target = call.data.get(URL_ATTR_NAME, '')

        # send wav to server
        url = target
        payload = bytearray(wav)
        headers = {'content-type': 'audio/wav', 'Accept': 'application/json'}
        request = requests.post(url, data=payload, headers=headers)

    hass.services.register(DOMAIN, "process", handle_recorder)

    return True
