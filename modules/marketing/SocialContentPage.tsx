
import React, { useState } from "react";
import { Icon } from "../../components/shared/Icon";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "../../components/ui/Drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Textarea } from "../../components/ui/Textarea";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Checkbox } from "../../components/ui/Checkbox";

const SocialContentPage = () => {
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    facebook: true,
    instagram: true,
    twitter: true,
    linkedin: true,
  });

  const posts = [
    { id: 1, date: "2024-11-05", time: "10:00 AM", platform: "facebook", status: "published", caption: "New product launch! Check out our latest collection.", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
    { id: 2, date: "2024-11-06", time: "2:30 PM", platform: "instagram", status: "scheduled", caption: "Behind the scenes at our studio 📸", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop" },
    { id: 3, date: "2024-11-07", time: "9:00 AM", platform: "twitter", status: "scheduled", caption: "Flash sale alert! 50% off today only", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop" },
    { id: 4, date: "2024-11-08", time: "11:00 AM", platform: "linkedin", status: "scheduled", caption: "Industry insights and trends", image: "https://images.unsplash.com/photo-1579586337278-35d18b57713d?w=100&h=100&fit=crop" },
    { id: 5, date: "2024-11-10", time: "3:00 PM", platform: "instagram", status: "draft", caption: "Customer testimonial feature", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=100&h=100&fit=crop" },
  ];

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook": return <Icon name="facebook" className="h-4 w-4" />;
      case "instagram": return <Icon name="instagram" className="h-4 w-4" />;
      case "twitter": return <Icon name="twitter" className="h-4 w-4" />;
      case "linkedin": return <Icon name="linkedin" className="h-4 w-4" />;
      default: return null;
    }
  };
  
  const getStatusBadgeVariant = (status: string): "green" | "blue" | "gray" | "red" => {
    switch (status) {
        case "published": return "green";
        case "scheduled": return "blue";
        case "draft": return "gray";
        case "failed": return "red";
        default: return "gray";
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500";
      case "scheduled": return "bg-blue-500";
      case "draft": return "bg-gray-400";
      case "failed": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const getPostsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(post => post.date === dateStr);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Content Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Schedule and manage your social media posts</p>
        </div>
        <Drawer>
          <DrawerTrigger>
            <Button className="gap-2">
              <Icon name="plus" className="h-4 w-4" />
              Create Post
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-xl">
            <DrawerHeader>
              <DrawerTitle>Create New Post</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {[
                    { id: "facebook", icon: 'facebook' as const, label: "Facebook", color: "text-[#1877F2]" },
                    { id: "instagram", icon: 'instagram' as const, label: "Instagram", color: "text-[#E4405F]" },
                    { id: "twitter", icon: 'twitter' as const, label: "Twitter", color: "text-[#1DA1F2]" },
                    { id: "linkedin", icon: 'linkedin' as const, label: "LinkedIn", color: "text-[#0A66C2]" },
                  ].map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer">
                      <Checkbox id={platform.id} />
                      <Icon name={platform.icon} className={`h-5 w-5 ${platform.color}`} />
                      <Label htmlFor={platform.id} className="cursor-pointer flex-1">{platform.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Upload Media</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-8 text-center hover:border-green-500 transition-all duration-200 cursor-pointer">
                  <Icon name="image" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop images or videos</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG, MP4, GIF (Max 10MB)</p>
                </div>
              </div>

              <div>
                <Label htmlFor="caption">Caption</Label>
                <Textarea 
                  id="caption" 
                  placeholder="Write your post caption..."
                  className="mt-2 min-h-[120px]"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">280 characters</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Schedule Date</Label>
                  <Input id="date" type="date" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="time">Schedule Time</Label>
                  <Input id="time" type="time" className="mt-2" />
                </div>
              </div>
            </div>
            <DrawerFooter className="flex-row justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Schedule Post</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar" className="gap-2">
            <Icon name="calendar" className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <Icon name="messageSquare" className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => {
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}>◀</Button>
              <h2 className="text-xl font-semibold">{monthNames[currentMonth]} {currentYear}</h2>
              <Button variant="outline" size="sm" onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}>▶</Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="facebook_filter" checked={selectedPlatforms.facebook} onCheckedChange={(checked) => setSelectedPlatforms({...selectedPlatforms, facebook: !!checked})} />
                <Label htmlFor="facebook_filter" className="flex items-center gap-1 cursor-pointer">
                  <Icon name="facebook" className="h-4 w-4 text-[#1877F2]" />
                  Facebook
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="instagram_filter" checked={selectedPlatforms.instagram} onCheckedChange={(checked) => setSelectedPlatforms({...selectedPlatforms, instagram: !!checked})} />
                <Label htmlFor="instagram_filter" className="flex items-center gap-1 cursor-pointer">
                  <Icon name="instagram" className="h-4 w-4 text-[#E4405F]" />
                  Instagram
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="twitter_filter" checked={selectedPlatforms.twitter} onCheckedChange={(checked) => setSelectedPlatforms({...selectedPlatforms, twitter: !!checked})} />
                <Label htmlFor="twitter_filter" className="flex items-center gap-1 cursor-pointer">
                  <Icon name="twitter" className="h-4 w-4 text-[#1DA1F2]" />
                  Twitter
                </Label>
              </div>
               <div className="flex items-center gap-2">
                <Checkbox id="linkedin_filter" checked={selectedPlatforms.linkedin} onCheckedChange={(checked) => setSelectedPlatforms({...selectedPlatforms, linkedin: !!checked})} />
                <Label htmlFor="linkedin_filter" className="flex items-center gap-1 cursor-pointer">
                  <Icon name="linkedin" className="h-4 w-4 text-[#0A66C2]" />
                  LinkedIn
                </Label>
              </div>
            </div>
          </div>

          <Card className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-medium text-sm text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="border rounded-lg p-2 bg-gray-100/50 dark:bg-gray-800/20 min-h-[100px]" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayPosts = getPostsForDay(day);
                const isToday = day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear();
                
                return (
                  <div 
                    key={day} 
                    className={`border rounded-lg p-2 min-h-[100px] hover:border-green-500 transition-all duration-200 ${isToday ? 'border-green-500 bg-green-50/50 dark:bg-green-900/10' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${isToday ? 'text-green-600' : ''}`}>{day}</span>
                    </div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 2).map((post) => (
                        <div key={post.id} className="text-xs p-1 bg-gray-100 dark:bg-gray-700/50 rounded flex items-center gap-1">
                          {getPlatformIcon(post.platform)}
                          <span className="truncate flex-1">{post.time}</span>
                          <span className={`w-2 h-2 rounded-full ${getStatusColorClass(post.status)}`} />
                        </div>
                      ))}
                      {dayPosts.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">+{dayPosts.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="grid gap-4">
            {posts.map((post) => (
              <Card key={post.id} className="p-4 hover:shadow-md transition-all duration-200">
                <div className="flex gap-4">
                  <img src={post.image} alt="Post" className="w-24 h-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(post.platform)}
                        <Badge variant={getStatusBadgeVariant(post.status)}>
                          {post.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {post.date} at {post.time}
                      </div>
                    </div>
                    <p className="text-sm mb-3">{post.caption}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Duplicate</Button>
                      <Button size="sm" variant="outline">View Analytics</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialContentPage;
