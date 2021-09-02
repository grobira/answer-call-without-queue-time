const app = require('express')()
const bodyParser = require('body-parser')
const loki = require('lokijs')


app.use(bodyParser.json())

const db = new loki('data.json', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 1000
})
function databaseInitialize() {
    if (!db.getCollection("calls")) {
        db.addCollection('calls', { indices: ['callSid'] });
    }
}


app.post('/incomingCall', (req, res) => {

    const { to, from, callSid, callStatus, agent } = req.body;

    const calls = db.getCollection("calls")
    const call = calls.insert({ to, from, callSid, callStatus, agent })
    console.log(`Call ${call.callSid} inserted`)

    res.send(call)
})

app.get('/incomingCall', (req, res) => {

    const { to, from, callSid, callStatus, agent } = req.query;

    const calls = db.getCollection("calls")
    const call = findCall({ to, from, callSid }, calls)
    console.log(`Call ${call.callSid} has agent ${call.agent}`)
    res.send(call)
})

app.put('/incomingCall', (req, res) => {

    const { to, from, callSid, callStatus, agent } = req.body;

    const calls = db.getCollection("calls")
    let call = findCall({ callSid }, calls);
    if (call) {
        call.agent = agent;
        call = calls.update(call);

        console.log(`Call ${call.callSid} updated to agent ${agent}`)

        res.send(call)
    } else
        res.send(call)
})

const findCall = ({ to, from, callSid }, calls) => {
    if (callSid) {
        const [call] = calls.find({ callSid })
        console.log(call)
        if (call) {
            console.log(`Call ${call.callSid} found`)
        }
        return call
    } else {
        const [call] = calls.find({ to, from })
        return call
    }
}

app.listen(3003, () => {
    db.loadDatabase()
    console.log('Listenning to 3003');
})