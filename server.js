const connectDB = require('./db')
const Document = require('./Document')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const PORT = process.env.PORT || 5000

if(process.env.NODE_ENV==='production')
{
    app.use(express.static('clientside/build'))
}

connectDB();
const io = require('socket.io')(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ['GET','POST']
    },
})

const defaultValue = ""

io.on('connection', socket=>{
    socket.on('get-document',async documentId=>{
        const document=await findOrCreateDoc(documentId)
        socket.join(documentId)
        socket.emit('load-document',document.data)

        socket.on('send-changes',delta=>{
            socket.broadcast.to(documentId).emit('receive-changes',delta)// display the changes to everyone else too
        })
        
        socket.on('save-document',async data=>{
            await Document.findByIdAndUpdate(documentId,{data})
        })
    })
})

async function findOrCreateDoc(id){
    if(id==null) return

    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({ _id:id,data:defaultValue })
}


server.listen(PORT,()=>{console.log(`Server Running on PORT - ${PORT}`)})
