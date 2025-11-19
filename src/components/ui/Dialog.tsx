import React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../icons/Icon';
import { cn } from '../../lib/utils';

const DialogContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

const useDialogContext = () => {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error('useDialogContext must be used within a Dialog');
    }
    return context;
};

// Fix: Made children optional to handle type inference issues.
const Dialog = ({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children?: React.ReactNode }) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    
    const contextValue = {
        open: open ?? internalOpen,
        setOpen: onOpenChange ?? setInternalOpen
    };

    return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
};

// Fix: Changed children type to React.ReactElement<any> to fix cloneElement errors
const DialogTrigger = ({ children }: { children: React.ReactElement<any> }) => {
    const { setOpen } = useDialogContext();
    return React.cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
            children.props.onClick?.(e);
            setOpen(true);
        },
    });
};

const DialogPortal = ({ children }: { children?: React.ReactNode }) => {
    const { open } = useDialogContext();
    const [portalNode, setPortalNode] = React.useState<Element | null>(null);

    React.useEffect(() => {
        const node = document.getElementById('portal-root');
        if (node) {
            setPortalNode(node);
        }
    }, []);

    if (!portalNode || !open) {
        return null;
    }
    
    return createPortal(children, portalNode);
};

const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
    const { open } = useDialogContext();
    if (!open) return null;
    return (
        <div
            ref={ref}
            className={cn('fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
            {...props}
        />
    );
});
DialogOverlay.displayName = 'DialogOverlay';


const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const { setOpen } = useDialogContext();
    return (
        <DialogPortal>
            <DialogOverlay onClick={() => setOpen(false)} />
            <div 
                className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4"
            >
                <div
                    ref={ref}
                    className={cn(
                        'relative z-50 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
                        className
                    )}
                    onClick={(e) => e.stopPropagation()}
                    {...props}
                >
                    {children}
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                    >
                        <Icon name="close" className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </div>
            </div>
        </DialogPortal>
    );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col space-y-1.5 p-6 border-b dark:border-gray-700', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 border-t dark:border-gray-700', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
));
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-gray-500 dark:text-gray-400', className)} {...props} />
));
DialogDescription.displayName = 'DialogDescription';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };