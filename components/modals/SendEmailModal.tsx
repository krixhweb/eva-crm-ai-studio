
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerDescription } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';

interface SendEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: () => void;
    documentId: string;
    customerName: string;
}

const SendEmailModal: React.FC<SendEmailModalProps> = ({ isOpen, onClose, onSend, documentId, customerName }) => {
    const isQuote = documentId.startsWith('QT');
    const documentType = isQuote ? 'Quote' : 'Invoice';

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="max-w-lg">
                <DrawerHeader>
                    <DrawerTitle>Send {documentType} {documentId}</DrawerTitle>
                    <DrawerDescription>To: {customerName}</DrawerDescription>
                </DrawerHeader>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input defaultValue={`${documentType} ${documentId} from Your Company`} />
                    </div>
                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea rows={12} defaultValue={`Hi ${customerName},\n\nPlease find your ${documentType.toLowerCase()} attached.\n\nBest regards,\nYour Company`} />
                    </div>
                </div>

                <DrawerFooter className="flex-row justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={onSend}>Send</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};

export default SendEmailModal;
