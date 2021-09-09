
const handleWhisperTask = (payload) => {
    const { task } = payload;

    if (task.attributes.callType === 'whisper') {
        const workerSid = flex.Manager.getInstance().workerClient.sid;
        fetch(`https://twilio-function-6735-dev.twil.io/taskAccepted?callSid=${task.attributes.callSid}&workerSid=${workerSid}&taskSid=${task.taskSid}`, { mode: 'cors' })
            .then(res => res.text())
            .then(body => console.log(body))
    }
}

const registerActions = (flex) => {
    flex.Actions.addListener("beforeAcceptTask", handleWhisperTask)
}

module.exports = { registerActions }