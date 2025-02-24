
enum Operator {
    EQUALS = "equals",
    NOT_EQUALS = "not_equals",
    LESS_THAN = "less_than",
    GREATER_THAN = "greater_than",
}

interface Valuator {
    evaluate(state: any): any;
}

class Param implements Valuator{
    path:string
    constructor(path: string){
        this.path=path
    }
    evaluate(state: QuestionnaireState): any{
        return state.extract(this.path)
    }
}

class Scalar implements Valuator{
    value: any
    constructor(value: any){
        this.value=value
    }
    evaluate(state: QuestionnaireState): any {
        return this.value
    }
}

class Condition {
    left: Valuator
    right: Valuator
    operator:Operator
    constructor(left: Valuator,right: Valuator,operator: Operator) {
        this.left = left;
        this.right = right;
        this.operator = operator;
    }
    satisfied(state: QuestionnaireState): boolean {

        const left = this.left.evaluate(state)
        const right = this.right.evaluate(state)

        if(this.operator===Operator.EQUALS){
            return left === right
        }
        if(this.operator===Operator.NOT_EQUALS){
            return left !== right
        }
        if(this.operator===Operator.LESS_THAN){
            return left < right
        }
        if(this.operator===Operator.GREATER_THAN){
            return left > right
        }

        return true
    }
}

class QuestionnaireState {
    state: any
    currentStep: string = ""
    constructor(state: any) {
        this.state = state
    }
    extract(path: string){
        return path
        .replace(/^\$\./, '')
        .split('.')
        .reduce((acc, key) => acc?.[key], this.state);
    }
    set(path: string, value: any) {
        const keys: string[] = path.replace(/^\$\./, '').split('.');
        const lastKey = keys.pop();

        let curr = this.state

        for(const key of keys){
            if(!curr[key]){
                curr[key]={}
            }
            curr = curr[key]
        }
        if(lastKey){
            curr[lastKey] = value;
        }
    }
    copy(): QuestionnaireState{
        const stateCopy = JSON.parse(JSON.stringify(this.state))
        return new QuestionnaireState(stateCopy)
    }
}

class Step {
    id: string
    screen: string
    assignPath: string
    nextSteps: NextStep[]
    constructor(id: string, screen: string, assignPath: string, nextSteps: NextStep[]) {
        this.id = id
        this.screen = screen
        this.assignPath = assignPath
        this.nextSteps = nextSteps
    }
}

class NextStep{
    step: string
    condition: Condition | undefined
    constructor(step: string, condition: Condition | undefined) {
        this.step = step
        this.condition = condition
    }
}

class StepScreen {
    id: string
    title: string
    input: Input
    constructor(id: string, title: string, input: Input) {
        this.id = id
        this.title = title
        this.input = input
    }
}

class SelectOption{
    key: string
    label: string
    constructor(key: string, label: string) {
        this.key = key
        this.label = label
    }
}

interface Input{
    toJSON(): object
}

class RadioInput implements Input{
    options: SelectOption[]
    constructor(options: SelectOption[]) {
        this.options = options
    }
    toJSON(): object {
        return {
            type:"radio",
            ...this,
        };
    }
}

class SelectOptionsInput implements Input{
    options: SelectOption[]
    constructor(options: SelectOption[]) {
        this.options = options
    }
    toJSON(): object {
        return {
            type:"select_dropdown",
            ...this,
        };
    }
}

class MultiSelectOptionsInput implements Input{
    options: SelectOption[]
    constructor(options: SelectOption[]) {
        this.options = options
    }
    toJSON(): object {
        return {
            type:"multi_select",
            ...this,
        };
    }
}

class TextInput implements Input{
    toJSON(): object {
        return {
            type:"text",
            ...this,
        };
    }
}

class QuestionnaireSession {
    states: QuestionnaireState[]

    screens: StepScreen[]
    steps: Step[]

    constructor(states: QuestionnaireState[], config: any){
        this.states=states
        this.screens=[]
        this.steps=[]

        for(const screenRaw of config.screens){
            const options: SelectOption[] = []
            if(screenRaw.input.options){
                for(const x of screenRaw.input.options){
                    options.push(new SelectOption(x.key, x.label))
                }
            }

            let input: Input

            if(screenRaw.input.type==="text"){
                input = new TextInput()
            }
            else if(screenRaw.input.type==="radio"){
                input = new RadioInput(options)
            }
            else if(screenRaw.input.type==="select_dropdown"){
                input = new SelectOptionsInput(options)
            }
            else if(screenRaw.input.type==="multi_select"){
                input = new MultiSelectOptionsInput(options)
            } else{
                throw new Error(`wrong input type ${screenRaw.input.type}`)
            }

            this.screens.push(new StepScreen(screenRaw.id,screenRaw.title,input))
        }

        for(const stepRaw of config.steps){

            const nextSteps: NextStep[] = []
            if(stepRaw.nextSteps){
                for(const nextStepRaw of stepRaw.nextSteps){

                    let condition: Condition | undefined

                    if(nextStepRaw.condition){
                        let op: Operator = Operator.EQUALS
                        if(nextStepRaw.condition.operator==="equals"){
                            op = Operator.EQUALS
                        }
                        if(nextStepRaw.condition.operator==="not_equals"){
                            op = Operator.NOT_EQUALS
                        }
                        if(nextStepRaw.condition.operator==="less_than"){
                            op = Operator.LESS_THAN
                        }
                        if(nextStepRaw.condition.operator==="greater_than"){
                            op = Operator.GREATER_THAN
                        }
        
                        condition = new Condition(
                            makeValuator(nextStepRaw.condition.left),
                            makeValuator(nextStepRaw.condition.right),
                            op)
                    }
                    nextSteps.push(new NextStep(nextStepRaw.step, condition))
                }
            }
            
            this.steps.push(new Step(stepRaw.step, stepRaw.screen, stepRaw.assignPath, nextSteps))
        }

        if(!this.states.length){
            const firstState = new QuestionnaireState({})
            firstState.currentStep = this.steps[0].id
            this.states.push(firstState)
        }
    }

    getResult(){
        return this.states[this.states.length-1].state
    }

    getCurrentScreen(): StepScreen | undefined {
        const currentStep = this.states[this.states.length-1].currentStep
        const currentStepObj = this.steps.find(x=>x.id===currentStep)
        if(currentStepObj){
            return this.screens.find(s=>{
                return currentStepObj.screen == s.id
            })
        }

        throw new Error("no step found")
    }

    setValue(value: any){
        const currentStep = this.states[this.states.length-1].currentStep
        const currentStepObj = this.steps.find(x=>x.id===currentStep)
        if(currentStepObj){
            const current = this.states[this.states.length-1]
            current.set(currentStepObj.assignPath, value)
        }
    }

    goNext(): boolean {
        const currentStep = this.states[this.states.length-1].currentStep
        const currentStepObj = this.steps.find(x=>x.id===currentStep)

        if(currentStepObj){
            const copy = this.states[this.states.length-1].copy()
            
            for(const nextStep of currentStepObj.nextSteps){
                if(!nextStep.condition || nextStep.condition.satisfied(copy)){
                    this.states.push(copy)
                    copy.currentStep = nextStep.step
                    return true
                }
            }
        }
        return false
    }

    goBack(){
        this.states.pop()
    }

    reset(){
        const firstState = new QuestionnaireState({})
        firstState.currentStep = this.steps[0].id
        this.states = [firstState]
    }

    getProgress(): object{
        let currentStep = this.states[this.states.length-1].currentStep
        var nextCount = 0

        while(true){
            const step = this.steps.find(x=>x.id===currentStep)
            if(step?.nextSteps.length){
                currentStep = step.nextSteps[0].step
                nextCount++
            } else{
                break
            }
        }

        return {
            finished: this.states.length-1,
            remaining: nextCount,
        }
    }
}

function makeValuator(obj: any): Valuator{
    if(obj.type === "param"){
        return new Param(obj.path)
    }
    if(obj.type === "scalar"){
        return new Scalar(obj.value)
    }
    throw new Error("wrong type")
}

export {
    QuestionnaireSession
}


