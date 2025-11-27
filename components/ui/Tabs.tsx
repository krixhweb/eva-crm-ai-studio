
import * as React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  groupId: string;
}>({
  value: '',
  onValueChange: () => {},
  groupId: '',
});

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ defaultValue, value, onValueChange, children, className }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const groupId = React.useId();

  const handleValueChange = (newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue || '', onValueChange: handleValueChange, groupId }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }>(({ className, value: triggerValue, children, ...props }, ref) => {
  const { value, onValueChange, groupId } = React.useContext(TabsContext);
  const isActive = value === triggerValue;

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onValueChange(triggerValue)}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative z-10',
        isActive ? 'text-green-700 dark:text-green-400' : 'hover:text-gray-700 dark:hover:text-gray-200',
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          {...({ layoutId: `${groupId}-activeTab` } as any)}
          className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md shadow-sm -z-10"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {children}
    </button>
  );
});
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(({ value: tabValue, className, children, ...props }, ref) => {
  const { value: contextValue } = React.useContext(TabsContext);
  if (contextValue !== tabValue) return null;
  
  return (
    <motion.div
      ref={ref}
      {...({
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2 }
      } as any)}
      className={cn('mt-2', className)}
      {...(props as unknown as HTMLMotionProps<"div">)}
    >
        {children}
    </motion.div>
  );
});
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
