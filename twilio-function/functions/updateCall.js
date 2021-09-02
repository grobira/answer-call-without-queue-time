const { default: axios } = require('axios');
const { pauseAndRedirectIncomingCallTwiml, enqueueIncomingCallTwiml } = require('../utils/twimls')

const { BACKEND_DOMAIN, WORKFLOW_SID } = process.env

exports.handler = async function (context, event, callback) {

    let twiml = new Twilio.twiml.VoiceResponse();
    const response = new Twilio.Response();

    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { CallSid: callSid } = event;

    const call = await axios.get(`${BACKEND_DOMAIN}/incomingCall?callSid=${callSid}`)

    if (!call.data.agent) {
        console.log(`Call ${callSid} has no agent`)
        response.appendHeader('Content-Type', 'text/xml');
        response.setBody(pauseAndRedirectIncomingCallTwiml)
        return callback(null,
            response
        )
    } else {
        console.log('agent ready to receive call')
        response.setBody(enqueueIncomingCallTwiml(WORKFLOW_SID, call.data.agent))
    }


    return callback(null,
        response
    );
}