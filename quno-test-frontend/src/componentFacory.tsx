
import RadioButton from './components/RadioButton.tsx'
import MultiSelect from './components/MultiSelect.tsx'
import SelectDropdown from './components/SelectDropdown.tsx'
import TextInput from './components/TextInput.tsx'

import {
    SelectOption,
} from './models.tsx'

export default class ComponentFactory {
    public static createRadio(options: SelectOption[], onChange: (value: string | number |string[] | number[]) => void): any {
        return <RadioButton
            options={options}
            onChange={onChange}
        />
    }
    public static createSelectOptions(options: SelectOption[], onChange: (value: string | number | string[] | number[]) => void): any {
        return <SelectDropdown
            options={options}
            onChange={onChange}
        />
    }
    public static createMultiSelectOptions(options: SelectOption[], onChange: (value: string | number |string[] | number[]) => void): any {
        return <MultiSelect
            options={options}
            onChange={onChange}
        />
    }
    public static createTextInput(onChange: (value: string | number | string[] | number[]) => void): any {
        return <TextInput onChange={onChange} />
    }
}
