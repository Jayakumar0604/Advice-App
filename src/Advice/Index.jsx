import React, { useEffect, useState } from 'react'

const Index = () => {
const [advice, setAdvice] = useState("Click the button and get the Advice");
const [count, setCount]= useState(0);

async function Advice(){
    var adv = await fetch("https://api.adviceslip.com/advice");
    var data = await adv.json();
    setAdvice(data.slip.advice)
    setCount((c) => c + 1 )
}

useEffect(function(){
    Advice();
}, []);
  return (
    <div className='w-full h-screen bg-pink-400 text-white place-items-center text-center place-content-center'>
        <h1 className='text-lg m-5'>{advice}</h1>
        <button onClick={Advice} className='px-10 py-2 mb-5 bg-blue-600 font-semibold hover:bg-blue-800'>Get Advice</button>
        <Counting count={count}/>
        
    </div>
  )
}

function Counting(props){
    return (
        <h2>You have read <span className='text-fuchsia-700 p-1  bg-white rounded-lg'>{props.count}</span> pieces of advices</h2>
    )
    
}

export default Index