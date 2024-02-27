import './Layout.css';

interface Props {
    children: React.ReactNode
}
export default function Layout({ children }: Props) {
    return (
        <div className="layout">
            {children}
        </div>
    );
}