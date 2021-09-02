
const handleWhisperTask = (payload) => {
    const { task } = payload;

    if (task.attributes.callType === 'whisper') {
        const workerSid = flex.Manager.getInstance().workerClient.sid;
        console.log(workerSid)
        console.log(task)
        fetch(`https://a129-191-183-199-152.ngrok.io/taskAccepted?callSid=${task.attributes.callSid}&workerSid=${workerSid}&taskSid=${task.taskSid}`, { mode: 'cors' })
            .then(res => res.text())
            .then(body => console.log(body))
    }
}

const registerActions = (flex) => {

    flex.Actions.addListener("beforeAcceptTask", handleWhisperTask)

}

module.exports = { registerActions }