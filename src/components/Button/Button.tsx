import './Button.css';

interface Props {
    text: string,
    onClick?: () => void,
    width?: string,
    height?: string,
    variant?: 'outline' | 'solid',
    style?: 'danger' | 'normal',
    loading?: boolean
}

export default function Button({ loading = false, style = 'normal', variant = 'solid', width = '100%', height = '48px', text, onClick }: Props) {
    return (
        <button className={`${loading ? 'disabled' : ''} ${variant} ${style}`} disabled={loading} style={{ width: width, height: height }} onClick={onClick}>
            {loading ? 'Carregando...' : text}
        </button>
    );
}