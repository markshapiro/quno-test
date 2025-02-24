import { useState,useEffect } from 'react'
import ProgressBar from './components/ProgressBar.tsx'
import { getState, setValueAnGoNext, goBack, reset, getResult } from './api.tsx'

import './App.css'

function App() {
  const [state, setState] = useState({})
  const [value, setValue] = useState(null)
  const [result, setResult] = useState(null)

  useEffect(() => {
    getState().then(s=>{
      if(s.finished){
        getResult().then(r=>{
          setResult(r)
        })
        return
      }
      setState(s)
    })

  }, []);

  return (
    <div>
      <h3 className="title">{state?.screen?.title}</h3>
      <button className="button reset" onClick={()=>{
        setResult(null)
        reset(value).then(s=>{
          setState(s)
          setValue(null)
        })
      }}>reset</button>
      <hr/>

      {!result
        ? <div className="input">
          {state?.screen?.input.createComponent((value: string | number | string[] | number[])=>{
            setValue(value)
          })}
        </div>
        : <div className="result">
            {Object.keys(result).map(key=><div>{key} : {Array.isArray(result[key])?result[key].join(", "):result[key]}</div>)}
          </div>}

      <hr/>
      <button className="button left" onClick={()=>{
        setResult(null)
        goBack().then(s=>{
          setState(s)
          setValue(null)
        })
      }}>back</button>
      <div className="progress">
        <ProgressBar value={state?.progress?.finished} max={state?.progress?.remaining+state?.progress?.finished}/>
      </div>
      <button className="button right" onClick={()=>{
        if(!value){
          alert("please enter value")
          return
        }
        setValueAnGoNext(value).then(s=>{
          if(s.finished){
            getResult().then(r=>{
              setResult(r)
            })
            return
          }
          setState(s)
          setValue(null)
        })
      }}>next</button>
    </div>
  )
}

export default App
