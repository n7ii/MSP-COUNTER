import { ReactNode } from "react";
import * as React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

interface ModalProps {
    isOpen: boolean;
    onOpenChange: () => void;
    title: any;
    size:
        | "xs"
        | "sm"
        | "md"
        | "lg"
        | "xl"
        | "2xl"
        | "3xl"
        | "4xl"
        | "5xl"
        | "full"
        | undefined;
    scrollBehavior?: "inside" | "outside" | "normal" | undefined;
    classNames?: string;
    children: ReactNode;
}

const ModalProvider: React.FC<ModalProps> = ({
                                                 isOpen,
                                                 onOpenChange,
                                                 title,
                                                 size,
                                                 scrollBehavior,
                                                 children,
                                             }) => {
    return (
        <Modal
            isOpen={isOpen}
            size={size}
            onOpenChange={onOpenChange}
            scrollBehavior={scrollBehavior}
            placement="auto"
        >
            <ModalContent className="z-50 ">
                <>
                    <ModalHeader className="flex flex-col gap-1 text-2xl   rounded-t-xl  lao-font">
                        {title}
                    </ModalHeader>
                    <ModalBody >{children}</ModalBody>
                </>
            </ModalContent>
        </Modal>
    );
};

export default ModalProvider;
