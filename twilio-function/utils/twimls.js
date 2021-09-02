const Twilio = require("twilio")

const domain = process.env.FUNCTION_DOMAIN

const pauseAndRedirectIncomingCallTwiml = (() => {
    let twiml = new Twilio.twiml.VoiceResponse();

    twiml.pause({ length: 1 });
    twiml.redirect({
        method: 'POST'
    }, `${domain}/updateCall`)

    return twiml.toString()
})()

const enqueueIncomingCallTwiml = (workflowSid, agent) => {
    let twiml = new Twilio.twiml.VoiceResponse();

    twiml.enqueue({ workflowSid })
        .task(
            {
                priority: 1000,
                workerSid: agent,
            },
            JSON.stringify({
                autoAccept: true
            })
        );

    return twiml.toString()
}


module.exports = { pauseAndRedirectIncomingCallTwiml, enqueueIncomingCallTwiml }