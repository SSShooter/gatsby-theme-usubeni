function forVar (){
    for(var i = 0;i<10;i++){
        setTimeout(()=>{
            console.log(i)
        },10)
    }
}
function forLet (){
    for(let i = 0;i<10;i++){
        setTimeout(()=>{
            console.log(i)
        },10)
    }
}
forVar()
forLet()