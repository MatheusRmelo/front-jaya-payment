import './Select.css';
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
export default function Select({ value = "", onChanged, options = [], placeholder }: Props) {
    return (
        <select value={value} onChange={(e) => onChanged == null ? null : onChanged!(e.target.value)}>
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {
                options.map((option) => <option key={option.key} value={option.key}>{option.value}</option>)
            }
        </select>
    );
}