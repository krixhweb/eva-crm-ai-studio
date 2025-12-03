
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/Dialog";

import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/Textarea";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/Select";

import MultiSelect from "../ui/MultiSelect"; 
import { Icon } from "../icons/Icon";
import { useToast } from "../../hooks/use-toast";

export interface LeadFormData {
  templateType: "company" | "individual";
  companyName: string;
  firstName: string;
  lastName: string;
  contactPerson: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  tags: string[];
  leadOwner: string;
  budget: string;
  stage: string;
  rating: "Hot" | "Warm" | "Cold";
  leadSource: string;
  description: string;
  preferredContact: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: LeadFormData) => void;
}

const owners = ["Priya Patel", "Rohan Kumar", "Ananya Singh", "Jane Smith", "John Doe"];
const stages = ["Lead Gen", "Qualification", "Proposal", "Demo", "Negotiation"];
const ratings = ["Hot", "Warm", "Cold"];
const sources = ["Website", "Email", "Cold Call", "Event", "Referral", "Social Media"];
const contactChannels = ["Phone", "Email", "WhatsApp", "SMS"];

const defaultTags = [
  "Premium",
  "Negotiation",
  "Repeat Buyer",
  "High Budget",
  "Furniture",
  "Interior",
  "Urgent",
];

const CreateLeadModal: React.FC<Props> = ({ isOpen, onClose, onCreate }) => {
  const { toast } = useToast();

  const [tagsList, setTagsList] = useState<string[]>(defaultTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagText, setNewTagText] = useState("");

  const [form, setForm] = useState<LeadFormData>({
    templateType: "company",
    companyName: "",
    firstName: "",
    lastName: "",
    contactPerson: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    tags: [],
    leadOwner: owners[0],
    budget: "",
    stage: stages[0],
    rating: "Warm",
    leadSource: sources[0],
    description: "",
    preferredContact: contactChannels[0],
  });

  const update = (key: keyof LeadFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (form.templateType === "individual") {
      update("contactPerson", `${form.firstName} ${form.lastName}`.trim());
    }
  }, [form.templateType, form.firstName, form.lastName]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedTags([]);
      setForm((prev) => ({ ...prev, tags: [] }));
    }
  }, [isOpen]);

  const validate = (): string | null => {
    if (form.templateType === "company" && !form.companyName.trim()) return "Company name is required.";
    if (form.templateType === "individual") {
      if (!form.firstName.trim() || !form.lastName.trim()) return "First & Last name required.";
    }
    if (!form.contactPerson.trim()) return "Contact person required.";
    if (!form.phone && !form.email) return "Phone or Email required."; 
    return null;
  };

  const addNewTag = () => {
    const t = newTagText.trim();
    if (!t) return;
    if (!tagsList.includes(t)) setTagsList((prev) => [...prev, t]);
    if (!selectedTags.includes(t)) setSelectedTags((prev) => [...prev, t]);
    setNewTagText("");
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      toast({ title: "Validation Error", description: err, variant: "destructive" });
      return;
    }
    onCreate({ ...form, tags: selectedTags });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0 border-0 shadow-2xl">
        
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Icon name="plus" className="h-4 w-4 text-green-600" />
            Create Lead
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            Add a new lead to your pipeline.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="space-y-5 max-h-[70vh] overflow-y-auto px-6 py-6 bg-white dark:bg-zinc-900/50">

          {/* Type & Owner */}
          <div className="grid grid-cols-2 gap-5">
             <div className="space-y-3">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Type</Label>
                <Select
                  value={form.templateType}
                  onValueChange={(v) => update("templateType", v as any)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             
             <div className="space-y-3">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Owner</Label>
                <Select
                  value={form.leadOwner}
                  onValueChange={(v) => update("leadOwner", v)}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
             </div>
          </div>

          {/* Name Fields */}
          {form.templateType === "company" ? (
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Company Name *</Label>
              <Input className="h-9 text-sm" placeholder="e.g. Acme Corp" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">First Name *</Label>
                <Input className="h-9 text-sm" placeholder="John" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Last Name *</Label>
                <Input className="h-9 text-sm" placeholder="Doe" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Contact Person</Label>
              <Input className="h-9 text-sm" placeholder="Full Name" value={form.contactPerson} onChange={(e) => update("contactPerson", e.target.value)} />
            </div>
             <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Preferred Contact</Label>
               <Select value={form.preferredContact} onValueChange={(v) => update("preferredContact", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {contactChannels.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Email</Label>
              <Input className="h-9 text-sm" placeholder="user@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Phone</Label>
              <Input className="h-9 text-sm" placeholder="+1..." value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
          </div>

          {/* Deal Details */}
          <div className="grid grid-cols-3 gap-4">
             <div className="space-y-3">
               <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Budget</Label>
               <Input className="h-9 text-sm" type="number" placeholder="0.00" value={form.budget} onChange={(e) => update("budget", e.target.value)} />
             </div>
             <div className="space-y-3">
               <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Stage</Label>
               <Select value={form.stage} onValueChange={(v) => update("stage", v)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
               </Select>
             </div>
             <div className="space-y-3">
               <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Rating</Label>
               <Select value={form.rating} onValueChange={(v) => update("rating", v as any)}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{ratings.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
               </Select>
             </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Tags</Label>
            <div className="flex gap-2">
              <Input className="h-9 text-sm flex-1" placeholder="Add custom tag..." value={newTagText} onChange={(e) => setNewTagText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNewTag()} />
              <Button variant="outline" size="sm" onClick={addNewTag} className="h-9">Add</Button>
            </div>
            <div className="mt-1">
                <MultiSelect
                    className="h-9 text-sm"
                    label="Select Tags"
                    options={tagsList}
                    value={selectedTags}
                    onChange={setSelectedTags}
                    placeholder="Choose tags..."
                />
            </div>
          </div>
          
          {/* Notes */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Notes</Label>
            <Textarea className="min-h-[80px] text-sm resize-none" placeholder="Additional details..." value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>

        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} size="sm" className="h-9 text-sm">Cancel</Button>
          <Button onClick={handleSubmit} size="sm" className="h-9 text-sm px-6 bg-green-600 hover:bg-green-700 text-white">Create Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadModal;
