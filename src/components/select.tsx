import './select.css';
interface Props {
    options: Option[],
    placeholder?: string,
    value?: string,
    onChanged?: (value: string) => void
}

export interface Option {
    key: string,
    value: string,
}
export default function Select({ value = "", onChanged = (value) => { }, options = [], placeholder }: Props) {
    return (
        <select value={value} onChange={(e) => onChanged(e.target.value)}>
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {
                options.map((option) => <option key={option.key} value={option.key}>{option.value}</option>)
            }
        </select>
    );
}