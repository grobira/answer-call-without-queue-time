const { default: axios } = require("axios");

const { WORKSPACE_SID, BACKEND_DOMAIN } = process.env

exports.handler = async function (context, event, callback) {

    const response = new Twilio.Response();

    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    const { callSid, workerSid, taskSid } = event;

    const call = await axios.put(`${BACKEND_DOMAIN}/incomingCall`, {
        callSid,
        agent: workerSid
    })

    const client = context.getTwilioClient();
    await await client.taskrouter.workspaces(WORKSPACE_SID).tasks(taskSid).update({
        assignmentStatus: 'completed'
    })
    response.setBody(call)

    callback(null, response)
}