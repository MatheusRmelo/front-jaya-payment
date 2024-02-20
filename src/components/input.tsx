import './input.css';
interface Props {
    placeholder?: string,
    type?: React.HTMLInputTypeAttribute | undefined,
    id?: string,
    name?: string,
    value?: string,
    onChanged?: (value: string) => void
}
export default function Input({
    placeholder = "",
    type = "text",
    id,
    name,
    value,
    onChanged = (value) => { }
}: Props) {
    return (
        <input placeholder={placeholder} name={name} id={id} type={type} value={value} onChange={(e) => onChanged(e.target.value)} />
    );
}