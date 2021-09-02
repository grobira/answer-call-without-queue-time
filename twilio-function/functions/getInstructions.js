const { default: axios } = require('axios');
const { pauseAndRedirectIncomingCallTwiml } = require('../utils/twimls')

const { WORKSPACE_SID, WORKFLOW_SID, BACKEND_DOMAIN } = process.env;

exports.handler = async function (context, event, callback) {

  const { CallSid: callSid, To: to, From: from, CallStatus: callStatus } = event;

  const client = context.getTwilioClient();

  const task = await client.taskrouter.workspaces(WORKSPACE_SID).tasks.create(
    {
      attributes: JSON.stringify({
        type: 'voice',
        callSid,
        callType: 'whisper'
      }),
      workflowSid: WORKFLOW_SID
    })

  const call = await axios.post(`${BACKEND_DOMAIN}/incomingCall`, {
    to,
    from,
    callSid,
    callStatus,
    agent: null
  })

  const response = new Twilio.Response();
  response.appendHeader('Content-Type', 'text/xml');
  response.setBody(pauseAndRedirectIncomingCallTwiml);
  return callback(null, response);
};