
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setBreadcrumb, setSidebarOpen } from '../../store/uiSlice';
import type { RootState } from '../../store/store';
import { Icon } from '../shared/Icon';

const navGroups = [
  {
    title: '360° Overview',
    icon: 'analytics',
    defaultOpen: true,
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', breadcrumb: ['360° Overview', 'Dashboard'] },
      { label: 'Customer Directory', path: '/customers', icon: 'users', breadcrumb: ['360° Overview', 'Customer Directory'] },
      { label: 'Abandoned Carts', path: '/abandoned-carts', icon: 'shoppingCart', breadcrumb: ['360° Overview', 'Abandoned Carts'] },
    ],
  },
  {
    title: 'Marketing',
    icon: 'megaphone',
    defaultOpen: true,
    items: [
      { label: 'Campaigns Management', path: '/marketing/campaigns', icon: 'megaphone', breadcrumb: ['Marketing', 'Campaigns Management'] },
      { label: 'Email Marketing', path: '/marketing/email', icon: 'mail', breadcrumb: ['Marketing', 'Email Marketing'] },
      { label: 'Social Content', path: '/marketing/social', icon: 'share', breadcrumb: ['Marketing', 'Social Content'] },
      { label: 'A/B Testing', path: '/marketing/ab-testing', icon: 'zap', breadcrumb: ['Marketing', 'A/B Testing'] },
      { label: 'Coupon Management', path: '/marketing/coupons', icon: 'ticket', breadcrumb: ['Marketing', 'Coupon Management'] },
    ],
  },
  {
    title: 'Sales',
    icon: 'dollarSign',
    defaultOpen: true,
    items: [
      { label: 'Leads Pipeline', path: '/sales/pipeline', icon: 'pipeline', breadcrumb: ['Sales', 'Leads Pipeline'] },
      { label: 'Performance & Activity', path: '/sales/analytics', icon: 'analytics', breadcrumb: ['Sales', 'Performance & Activity'] },
    ],
  },
  {
    title: 'Commerce',
    icon: 'shoppingCart',
    defaultOpen: true,
    items: [
      { label: 'Products & Inventory', path: '/commerce/products', icon: 'package', breadcrumb: ['Commerce', 'Products & Inventory'] },
      { label: 'Orders Management', path: '/commerce/orders', icon: 'shoppingCart', breadcrumb: ['Commerce', 'Orders Management'] },
      { label: 'Financial Hub', path: '/commerce/financials', icon: 'dollarSign', breadcrumb: ['Commerce', 'Financial Hub'] },
    ],
  },
  {
    title: 'Support',
    icon: 'lifeBuoy',
    defaultOpen: true,
    items: [
      { label: 'Ticket Management', path: '/support/tickets', icon: 'ticket', breadcrumb: ['Support', 'Ticket Management'] },
      { label: 'Returns & Refunds', path: '/support/returns', icon: 'lifeBuoy', breadcrumb: ['Support', 'Returns & Refunds'] },
      { label: 'Multi-Channel Support', path: '/support/multi-channel', icon: 'messageSquare', breadcrumb: ['Support', 'Multi-Channel Support'] },
    ],
  },
  {
    title: 'Automation',
    icon: 'zap',
    defaultOpen: true,
    items: [
      { label: 'Workflow Builder', path: '/automation/workflows', icon: 'workflow', breadcrumb: ['Automation', 'Workflow Builder'] },
      { label: 'Marketing Automation', path: '/automation/marketing', icon: 'megaphone', breadcrumb: ['Automation', 'Marketing Automation'] },
      { label: 'Service Automation', path: '/automation/service', icon: 'lifeBuoy', breadcrumb: ['Automation', 'Service Automation'] },
    ],
  },
  {
    title: 'Settings',
    icon: 'settings',
    defaultOpen: true,
    items: [
      { label: 'Integrations', path: '/settings/integrations', icon: 'settings', breadcrumb: ['Settings', 'Integrations'] },
      { label: 'Admin & Security', path: '/settings/admin', icon: 'settings', breadcrumb: ['Settings', 'Admin & Security'] },
      { label: 'APIs & Webhooks', path: '/settings/api', icon: 'settings', breadcrumb: ['Settings', 'APIs & Webhooks'] },
    ],
  },
];

const MIN_WIDTH = 180;
const MAX_WIDTH = 230; // Reduced max width
const DEFAULT_WIDTH = 220;
const COLLAPSED_WIDTH = 64;
const COLLAPSE_THRESHOLD = 50; // Slightly reduced threshold for easier opening

const Sidebar: React.FC = () => {
  const isSidebarOpen = useSelector((state: RootState) => state.ui.isSidebarOpen);
  const dispatch = useDispatch();
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);
  
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  const [openGroups, setOpenGroups] = useState(() => 
    navGroups.reduce((acc: Record<string, boolean>, group) => {
        acc[group.title] = group.defaultOpen || false;
        return acc;
    }, {})
  );

  useEffect(() => {
    let activeItem;
    
    for (const group of navGroups) {
      const foundItem = group.items.find(item => item.path === location.pathname);
      if (foundItem) {
        activeItem = foundItem;
        break;
      }
    }

    if (activeItem) {
      dispatch(setBreadcrumb(activeItem.breadcrumb));
    }
  }, [location.pathname, dispatch]);

  const handleGroupToggle = (title: string) => {
    if (!isSidebarOpen) {
      dispatch(toggleSidebar());
      setOpenGroups(prev => ({ ...prev, [title]: true }));
    } else {
      setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
    }
  };

  // Resizing Logic
  const startResizing = useCallback(() => {
    setIsResizing(true);
    // If starting drag from collapsed state, set width to collapsed width 
    // to prevent visual jumping to previous expanded width
    if (!isSidebarOpen) {
        setSidebarWidth(COLLAPSED_WIDTH);
    }
  }, [isSidebarOpen]);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    // If left in an "in-between" state (open but too narrow), snap to min width
    if (isSidebarOpen && sidebarWidth < MIN_WIDTH) {
        setSidebarWidth(MIN_WIDTH);
    }
  }, [isSidebarOpen, sidebarWidth]);

  const resize = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isResizing && sidebarRef.current) {
        let clientX;
        if ('touches' in event) {
           clientX = event.touches[0].clientX;
        } else {
           clientX = (event as MouseEvent).clientX;
        }

        const newWidth = clientX - sidebarRef.current.getBoundingClientRect().left;
        
        // Logic to toggle Open/Closed based on dragging threshold
        if (newWidth < COLLAPSE_THRESHOLD) {
            if (isSidebarOpen) dispatch(setSidebarOpen(false));
        } else {
            if (!isSidebarOpen) dispatch(setSidebarOpen(true));
        }

        // Update visual width clamped between bounds
        // Allow it to go down to COLLAPSED_WIDTH during drag for smoothness
        const clampedWidth = Math.max(COLLAPSED_WIDTH, Math.min(newWidth, MAX_WIDTH));
        setSidebarWidth(clampedWidth);
      }
    },
    [isResizing, dispatch, isSidebarOpen]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    window.addEventListener("touchmove", resize);
    window.addEventListener("touchend", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
      window.removeEventListener("touchmove", resize);
      window.removeEventListener("touchend", stopResizing);
    };
  }, [resize, stopResizing]);


  return (
    <>
      {/* Overlay for mobile when expanded */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => dispatch(toggleSidebar())}
      ></div>
      
      <aside
        ref={sidebarRef}
        // Use dynamic width if open OR if resizing (allows dragging out from collapsed state)
        style={{ width: isSidebarOpen || isResizing ? sidebarWidth : COLLAPSED_WIDTH }}
        className={`flex flex-col z-40 fixed md:relative h-full bg-white dark:bg-[#09090b] flex-shrink-0 relative group border-r border-gray-200 dark:border-gray-800
        ${isResizing ? 'transition-none select-none' : 'transition-all duration-300 ease-in-out'}
        translate-x-0
        `}
      >
        {/* Resizer Handle - Always rendered to allow drag-to-open */}
        <div
            className="absolute right-0 top-0 w-1.5 h-full cursor-col-resize z-50 bg-transparent hover:bg-green-500/10 transition-colors"
            onMouseDown={startResizing}
            onTouchStart={startResizing}
        />

        <div className={`p-4 flex items-center h-16 ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <Icon name="sparkles" className="w-8 h-8 text-green-500 flex-shrink-0" />
            <span className={`text-2xl font-extrabold text-green-500 ml-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>EVA CRM</span>
        </div>
        
        <nav className="flex-1 p-2 overflow-y-auto overflow-x-hidden space-y-2 scrollbar-hide">
          {navGroups.map(group => (
            <div key={group.title}>
              <button
                onClick={() => handleGroupToggle(group.title)}
                title={isSidebarOpen ? '' : group.title}
                className={`w-full flex items-center p-2 rounded-lg text-sm font-semibold text-gray-500 dark:text-dark-muted hover:bg-black/5 dark:hover:bg-dark-surfaceHover transition-colors ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}
                aria-expanded={openGroups[group.title]}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Icon name={group.icon as keyof typeof Icon.icons} className="w-5 h-5 flex-shrink-0" />
                  <span className={`whitespace-nowrap transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>{group.title}</span>
                </div>
                {isSidebarOpen && <Icon name="chevronDown" className={`w-4 h-4 transition-transform duration-200 ${openGroups[group.title] ? 'rotate-180' : ''}`} />}
              </button>
              {isSidebarOpen && openGroups[group.title] && (
                <div className="pl-5 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {group.items.map(item => (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={({isActive}) => `flex items-center gap-3 p-2 rounded-lg text-sm transition-colors duration-200 ${
                        isActive
                          ? 'bg-green-50 text-green-600 dark:bg-green-500/20 dark:text-green-300 font-semibold'
                          : 'text-gray-600 dark:text-dark-text hover:bg-black/5 dark:hover:bg-dark-surfaceHover'
                      }`}
                    >
                      <Icon name={item.icon as keyof typeof Icon.icons} className="w-5 h-5 flex-shrink-0"/>
                      <span className="flex-grow whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
                      {(item as any).new && <span className="text-xs font-bold bg-green-500 text-white rounded-full px-2 py-0.5">New</span>}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className={`w-full flex items-center justify-center gap-3 p-2 rounded-lg text-sm font-semibold transition-colors duration-200
                bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-300
                hover:bg-green-100 dark:hover:bg-green-500/20`}
                title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
                <Icon name={isSidebarOpen ? "arrowLeft" : "chevronRight"} className="w-5 h-5 flex-shrink-0" />
            </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
