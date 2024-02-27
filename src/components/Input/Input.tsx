import InputMask from 'react-input-mask';
import './Input.css';
interface Props {
    placeholder?: string,
    type?: React.HTMLInputTypeAttribute | undefined,
    id?: string,
    name?: string,
    value?: string,
    onChanged?: (value: string) => void,
    withMask?: boolean,
    mask?: string | null,
    disabled?: boolean,
    error?: string | null,
}
export default function Input({
    placeholder = "",
    type = "text",
    id,
    name,
    value,
    onChanged,
    disabled = false,
    withMask = false,
    mask,
    error
}: Props) {
    return (
        <div className='input-container'>
            {
                withMask && mask ? <InputMask className={error ? 'error' : ''} disabled={disabled} data-testid={id} mask={mask} placeholder={placeholder} name={name} id={id} type={type} value={value}
                    onChange={(e) => onChanged == null ? null : onChanged(e.target.value)} maskChar=" " /> :
                    <input className={error ? 'error' : ''} disabled={disabled} data-testid={id} placeholder={placeholder} name={name} id={id} type={type} value={value}
                        onChange={(e) => onChanged == null ? null : onChanged(e.target.value)}
                    />
            }
            {
                error &&
                <div className="error-container">
                    <small className='error'>{error}</small>
                </div>
            }

        </div>
    );
}