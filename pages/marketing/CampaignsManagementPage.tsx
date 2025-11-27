
import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Icon } from '../../components/icons/Icon';
import type { Campaign } from '../../types';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '../../components/ui/Drawer';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/utils';
import { mockCampaigns } from '../../data/mockData';

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const getRoiColor = (roi: number) => {
    if (roi > 200) return 'text-green-500';
    if (roi > 100) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStatusBadgeColor = (status: Campaign['status']): 'green' | 'blue' | 'gray' | 'yellow' => {
    switch (status) {
      case 'Active': return 'green';
      case 'Scheduled': return 'blue';
      case 'Completed': return 'gray';
      case 'Paused': return 'yellow';
    }
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative">
        <img src={campaign.image} alt={campaign.name} className="w-full h-40 object-cover" />
        <div className="absolute top-2 right-2 flex gap-1">
          {campaign.platforms.map(p => {
              const platformIcons: Record<string, keyof typeof Icon.icons> = { 'Facebook': 'facebook', 'Instagram': 'instagram', 'TikTok': 'tiktok', 'Twitter': 'twitter' };
              return <div key={p} className="bg-white rounded-full p-1 shadow"><Icon name={platformIcons[p]} className="w-4 h-4 text-gray-700"/></div>
          })}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold truncate pr-2 flex-grow">{campaign.name}</h3>
            <Badge variant={getStatusBadgeColor(campaign.status)} className="flex-shrink-0">
                {campaign.status}
            </Badge>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div>👁️ Impressions: {campaign.metrics.impressions.toLocaleString()}K</div>
          <div>🖱️ Clicks: {campaign.metrics.clicks.toLocaleString()}</div>
          <div>💰 Conversions: {campaign.metrics.conversions}</div>
          <div>💵 Spend: {formatCurrency(campaign.metrics.spend)}</div>
          <div className={`font-semibold ${getRoiColor(campaign.metrics.roi)}`}>📈 ROI: {campaign.metrics.roi}%</div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t dark:border-gray-700">
          <label className="flex items-center cursor-pointer">
              <div className="relative">
                  <input type="checkbox" className="sr-only" checked={campaign.status === 'Active'} readOnly/>
                  <div className="w-10 h-4 bg-gray-300 rounded-full shadow-inner dark:bg-gray-600"></div>
                  <div className={`dot absolute w-6 h-6 bg-white rounded-full shadow -top-1 transition-transform ${campaign.status === 'Active' ? 'transform translate-x-full bg-green-500' : 'bg-gray-400'}`}></div>
              </div>
          </label>
           <div className="flex gap-2">
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-500"><Icon name="edit2" className="w-4 h-4"/></button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-purple-500"><Icon name="analytics" className="w-4 h-4"/></button>
                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><Icon name="copy" className="w-4 h-4"/></button>
            </div>
        </div>
      </div>
    </Card>
  );
};

const CreateCampaignDrawer: React.FC<{onClose: () => void}> = ({onClose}) => {
    return (
        <Drawer open={true} onOpenChange={onClose}>
            <DrawerContent className="max-w-2xl">
                <DrawerHeader>
                    <DrawerTitle>Create New Campaign</DrawerTitle>
                </DrawerHeader>
                <div className="flex-1 p-6 overflow-y-auto">
                    <p>This is a placeholder for the multi-step campaign creation flow.</p>
                </div>
                <DrawerFooter className="flex-row justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button>Continue</Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const CampaignsManagementPage: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Social Media Campaigns</h1>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Icon name="zap" className="w-4 h-4"/> Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4"><p className="text-sm text-gray-500">Total Campaigns</p><p className="text-2xl font-bold">24</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold">8</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Total Reach</p><p className="text-2xl font-bold">145K</p></Card>
        <Card className="p-4"><p className="text-sm text-gray-500">Average ROI</p><p className="text-2xl font-bold text-green-500">325%</p></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCampaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
      {isModalOpen && <CreateCampaignDrawer onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default CampaignsManagementPage;
