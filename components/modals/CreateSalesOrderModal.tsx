
import React from 'react';
import { Drawer, DrawerContent } from '../ui/Drawer';
import CreateSalesOrder from '../../modules/commerce/orders/components/CreateSalesOrder';
import type { SalesOrder } from '../../types';

interface CreateSalesOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (order: SalesOrder) => void;
}

const CreateSalesOrderModal: React.FC<CreateSalesOrderModalProps> = ({ isOpen, onClose, onSave }) => {
    return (
        <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DrawerContent 
                resizable={true}
                className="w-full md:w-[900px] p-0 bg-white dark:bg-zinc-900 rounded-l-3xl border-l border-gray-200 dark:border-zinc-800 overflow-hidden" 
                showCloseButton={false}
            >
               <CreateSalesOrder onClose={onClose} onSave={onSave} />
            </DrawerContent>
        </Drawer>
    );
};

export default CreateSalesOrderModal;
