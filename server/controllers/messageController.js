const Message = require ("../models/messageModel");
const addMessage = async(req, res) => {
    try {
        const{ from, to, message } = req.body
        const data = await Message.create({
            message: {
                text: message,
                users: [from, to],
                sender: from
            }

        })
        if(data) {
            return res.json({msg: "Message added to database successfully"})
        } else {
            return res.json({ msg: "Failed to add message to database"})
        }
    } catch (error) {
        console.error(error);
        
    }
}
const getAllMessages = async (req, res) => {
   try {
    const { from, to } = req.body


    
    
    const messages = await Message.find({
        "message.users": { $all: [from, to] }
      }).sort({ updatedAt: 1 });
      
      
    
    
    const projectedMsgs = messages.map( (msg)  => {
          return {
            fromSelf: msg.message.sender.toString() === from,
            message: msg.message.text
          }
    })
    res.json(projectedMsgs)
    
    

   } catch (error) {
    console.error(error);
    
   }
}
module.exports = {
    addMessage,
    getAllMessages
}