import { useRef } from "react";
import './modal.css';
import Button from "./button";

interface Props {
    title: string,
    description: string,
    visible: boolean,
    setVisible: (value: boolean) => void,
    loading?: boolean,
    onConfirm?: () => void,
    style?: 'danger' | 'normal',
    confirmText?: string
}
export default function Modal({ style = 'normal', title, description, loading = false, confirmText = 'Confirmar', visible, setVisible, onConfirm }: Props) {
    const modalRef = useRef<any>(null);

    return (
        <>
            {visible ? (
                <div
                    className="overlay"
                    onClick={(e) => {
                        console.log(modalRef.current);
                        console.log(e.target);
                        if (modalRef.current!.contains(e.target)) {
                            return;
                        }
                        setVisible(false);
                    }}
                >
                    <div className="modal" ref={modalRef}>
                        <h4>{title}</h4>
                        <p>{description}</p>
                        <div className="actions">
                            <Button style={style} variant="outline" text="Voltar" onClick={() => { setVisible(false); }} />
                            <Button style={style} loading={loading} text={confirmText} onClick={onConfirm} />
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </>
    );
}