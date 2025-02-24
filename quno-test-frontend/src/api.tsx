
import {
    TextInput,
    RadioInput,
    SelectOption,
    MultiSelectOptionsInput,
    SelectOptionsInput,
    StepScreen,
} from './models.tsx'

const url = "http://localhost:8080"

function convertScreen(screenRaw: object): StepScreen{
    let input: Input

    let options: SelectOption[] = []

    if(screenRaw.input.options){
        for(let option of screenRaw.input.options){
            options.push(new SelectOption(option.key, option.label))
        }
    }

    if(screenRaw.input.type === "radio"){
        input = new RadioInput(options)
    }
    if(screenRaw.input.type === "text"){
        input = new TextInput(options)
    }
    if(screenRaw.input.type === "multi_select"){
        input = new MultiSelectOptionsInput(options)
    }
    if(screenRaw.input.type === "select_dropdown"){
        input = new SelectOptionsInput(options)
    }
    
    return new StepScreen(screenRaw.id, screenRaw.title, input)
}

async function getState(): object{
    try {
        const state = await fetch(`${url}/getState`)
            .then(x=>x.json())

        return {
            ...state,
            screen: state.screen?convertScreen(state.screen):null,
        }
    } catch(e){
        console.log("error",e)
    }
}

async function setValueAnGoNext(value: string | number | string[] | number[]): object {
    try {
        const state = await fetch(`${url}/setValueAnGoNext`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "value":value
            }),
        })
            .then(x=>x.json())
        return{
            ...state,
            screen: state.screen?convertScreen(state.screen):null,
        }
    } catch(e){
        console.log("error",e)
    }
}

async function goBack(): object {
    try {
        const state = await fetch(`${url}/goBack`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(x=>x.json())
        return{
            ...state,
            screen: convertScreen(state.screen),
        }
    } catch(e){
        console.log("error",e)
    }
}

async function reset(): object {
    try {
        const state = await fetch(`${url}/reset`,{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(x=>x.json())
        return{
            ...state,
            screen: convertScreen(state.screen),
        }
    } catch(e){
        console.log("error",e)
    }
}

async function getResult(): object {
    try {
        const result = await fetch(`${url}/getResult`)
            .then(x=>x.json())
        return result
    } catch(e){
        console.log("error",e)
    }
}

export{
    getState,
    setValueAnGoNext,
    goBack,
    reset,
    getResult,
}