import './button.css';

interface Props {
    text: string,
    onClick?: () => void,
    width?: string,
    variant?: 'outline' | 'solid',
    style?: 'danger' | 'normal',
    loading?: boolean
}

export default function Button({ loading = false, style = 'normal', variant = 'solid', width = '100%', text, onClick }: Props) {
    return (
        <button className={`${loading ? 'disabled' : ''} ${variant} ${style}`} disabled={loading} style={{ width: width }} onClick={onClick}>
            {loading ? 'Carregando...' : text}
        </button>
    );
}