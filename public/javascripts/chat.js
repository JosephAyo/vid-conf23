let client = io.connect('https://vid-conf23.herokuapp.com/');
//||io.connect('http://localhost:3000/')

document.forms[0].onsubmit = function(e){
    let input = document.getElementById('message');
    // emits a 'chat' event which is then listened for on the backend
    client.emit('chat', input.value);
    input.value = '';
    return false;
};

client.on('message',(message)=>{
    let li = document.createElement('li');
    li.innerText = message;
    document.querySelector("ul#messages").appendChild(li);
});