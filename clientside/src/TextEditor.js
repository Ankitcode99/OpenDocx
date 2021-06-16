import React, { useCallback,useEffect, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { io } from 'socket.io-client'
import './styles.css';
import { useParams } from 'react-router-dom'

const TOOLBAR_OPTIONS = [
['bold', 'italic', 'underline', 'strike'],        // toggled buttons
['blockquote', 'code-block'],
[{ 'list': 'ordered'}, { 'list': 'bullet' }],
[{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
[{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
[{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
[{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
[{ 'font': [] }],
[{ 'align': [] }],
['image','link']
 ]

export default function TextEditor() {
    const {id:documentID} = useParams()
    const [socket,setSocket]=useState()
    const [quill,setQuill]=useState()

    useEffect(()=>{
        const s = io("https://opendocx.herokuapp.com/")
        setSocket(s)

        return ()=>{
            s.disconnect()
        }
    },[])

    useEffect(()=>{
        if(socket==null || quill==null) return

        socket.once('load-document',document=>{
            quill.setContents(document)
            quill.enable()
        })

        socket.emit('get-document',documentID)
    },[socket,quill,documentID])

    useEffect(()=>{
        if(socket==null || quill==null) return
        
        const handler = (delta)=>{
            quill.updateContents(delta)
        }
        socket.on('receive-changes',handler)

        return ()=>{
            socket.off('receive-changes',handler)
        }
    },[socket,quill])

    useEffect(()=>{
        if(socket==null || quill==null) return

        const handler = (delta,oldDelta,source)=>{
            if(source!=='user') return
            socket.emit('send-changes',delta)
        }
        quill.on('text-change',handler)

        return ()=>{
            quill.off('text-change',handler)
        }
    },[socket,quill])

    useEffect(()=>{
        if(socket==null || quill==null) return

        const interval = setInterval(()=>{
            socket.emit('save-document',quill.getContents())
        },1500)//save interval

        return ()=>{
            clearInterval(interval)
        }
    },[socket,quill])

    const wrapperRef = useCallback((wrapper)=>{
        if(wrapper==null) return       
        wrapper.innerHTML = ''

        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor,{theme:'snow', modules:{toolbar:TOOLBAR_OPTIONS}})
        q.disable()
        q.setText('Fetching latest version....')
        setQuill(q)
    },[])//loads only once
    
    return <div className='container' ref={wrapperRef}></div>
}
