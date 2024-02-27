import './Input.css';
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
    onChanged
}: Props) {
    return (
        <input data-testid={id} placeholder={placeholder} name={name} id={id} type={type} value={value}
            onChange={(e) => onChanged == null ? null : onChanged(e.target.value)}
        />
    );
}