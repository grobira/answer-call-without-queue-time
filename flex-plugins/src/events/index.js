

const handleReservetion = (payload) => {
    console.log("Reservation Created", payload)
    const taskAttributes = payload.task.attributes;
    if (taskAttributes.autoAccept == true) {
        payload.dequeue()
    }
}


const registerEvents = (flex) => {
    flex.Manager.getInstance().workerClient.on("reservationCreated", handleReservetion)
}


module.exports = { registerEvents }