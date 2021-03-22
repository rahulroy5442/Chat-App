const socket =io()
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('#message-Field')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const displayname=document.querySelector("#Display-name").innerHTML
//
const message_temp=document.querySelector('#message-template').innerHTML
const Location_temp=document.querySelector("#location-message-template").innerHTML
const sideTemplate=document.querySelector("#side-template").innerHTML
const { user, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
//console.log("fk")
//console.log(user,room)
function scrollFunction()
{
    
    const $newMessage = $messages.lastElementChild

    
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    
    const visibleHeight = $messages.offsetHeight

    
    const containerHeight = $messages.scrollHeight

    
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}
socket.on('message',(message)=>
{
    
  //  console.log(message)
    const html=Mustache.render(message_temp,{
        username:message.name,
        Text:message.text,
        CreatedAt: moment(message.createdAt).format('h:mm a')
    })
// console.log(html)

    $messages.insertAdjacentHTML('beforeend',html) 
    scrollFunction()
})

socket.on('SendLocation',(message)=>
{
    //console.log(url)
    const html=Mustache.render(Location_temp,{
        username:message.name,
        url:message.url,
        CreatedAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    scrollFunction()
})
socket.on('display-name',({userroom,name})=>
{
    console.log(name)
    const html = Mustache.render(displayname, {
        room:userroom,
        name
    })
    document.querySelector("#side").innerHTML=html 
})

socket.on('roomData', ({userList }) => {
    //console.log("jhdhjd")
   
    const html = Mustache.render(sideTemplate, {
        users:userList
    })
    document.querySelector("#side-bar").innerHTML=html 
})

$messageForm.addEventListener('submit',(e)=>
{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value;
    socket.emit('newmessage',message,(Nmessage)=>
    {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=""
        $messageFormInput.focus()
        console.log("Message deliverd "+Nmessage)
    })
})

$sendLocationButton.addEventListener('click',()=>
{
    if(!navigator.geolocation)
    {
        return alert('Location Does not exit')
    }
    
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
       // console.log(position.coords)
        socket.emit('Location',{latitude:position.coords.latitude,longitude:position.coords.longitude},()=>
        {
            $sendLocationButton.removeAttribute('disabled')
        })
    })
  
})
socket.emit('join',{user,room},(error)=>{
  //  console.log("cjfj ",user,room)
    if(error)
    {
        alert(error)
        location.href = '/'
    }
})