import './Error.css';

interface Props {
    error: string,
}
export default function Error({ error }: Props) {
    return (
        <div className='error'>
            {error}
        </div>
    );
}