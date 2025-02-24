
import ComponentFactory from './componentFacory.tsx'

interface Input{
    createComponent(onChange: (value: string | number | string[] | number[]) => void): React.FC
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
  
class RadioInput implements Input{
    options: SelectOption[]
    constructor(options: SelectOption[]) {
        this.options = options
    }
    createComponent(onChange: (value: string | number | string[] | number[]) => void): React.FC {
        return ComponentFactory.createRadio(this.options, onChange)
    }
}

class SelectOptionsInput implements Input{
    options: SelectOption[]
    constructor(options: SelectOption[]) {
        this.options = options
    }
    createComponent(onChange: (value: string | number | string[] | number[]) => void): React.FC {
        return ComponentFactory.createSelectOptions(this.options, onChange)
    }
}

class MultiSelectOptionsInput implements Input{
    options: SelectOption[]
    constructor(options: SelectOption[]) {
        this.options = options
    }
    createComponent(onChange: (value: string | number | string[] | number[]) => void): React.FC {
        return ComponentFactory.createMultiSelectOptions(this.options, onChange)
    }
}

class TextInput implements Input{
    createComponent(onChange: (value: string | number | string[] | number[]) => void): React.FC {
        return ComponentFactory.createTextInput(onChange)
    }
}
  
export {
    Input,
    StepScreen,
    SelectOption,
    RadioInput,
    MultiSelectOptionsInput,
    SelectOptionsInput,
    TextInput,
}