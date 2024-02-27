import './Table.css';

interface Props {
    children: React.ReactNode[],
}
export default function Table({ children }: Props) {
    return (
        <div className="table-container">
            <table cellSpacing={0} cellPadding={0} border={0}>
                <thead>
                    {children[0]}
                </thead>
                <tbody>
                    {children[1]}
                </tbody>
            </table>
        </div>
    );
}