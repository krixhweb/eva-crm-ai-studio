import React, { useState, useEffect, useMemo } from "react";
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

// ⭐ Predefined + user-added tags
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

  // The actual selected tags
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

  // ⭐ Auto-fill contact person for individual leads
  useEffect(() => {
    if (form.templateType === "individual") {
      update("contactPerson", `${form.firstName} ${form.lastName}`.trim());
    }
  }, [form.templateType, form.firstName, form.lastName]);

  // ⭐ When modal closes → reset
  useEffect(() => {
    if (!isOpen) {
      setSelectedTags([]);
      setForm((prev) => ({ ...prev, tags: [] }));
    }
  }, [isOpen]);

  // ⭐ Better validation
  const validate = (): string | null => {
    if (form.templateType === "company" && !form.companyName.trim())
      return "Company name is required.";

    if (form.templateType === "individual") {
      if (!form.firstName.trim() || !form.lastName.trim())
        return "First & Last name required for individual lead.";
    }

    if (!form.contactPerson.trim()) return "Contact person required.";

    if (!/^\+?\d{10,15}$/.test(form.phone))
      return "Enter a valid phone number (10–15 digits).";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) return "Enter a valid email address.";

    if (!form.budget || Number(form.budget) <= 0)
      return "Budget must be a positive number.";

    return null;
  };

  const addNewTag = () => {
    const t = newTagText.trim();
    if (!t) return;

    if (!tagsList.includes(t)) {
      setTagsList((prev) => [...prev, t]);
    }

    if (!selectedTags.includes(t)) {
      setSelectedTags((prev) => [...prev, t]);
    }

    setNewTagText("");
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      toast({ title: "Validation Error", description: err, variant: "destructive" });
      return;
    }

    const finalData = {
      ...form,
      tags: selectedTags,
    };

    onCreate(finalData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Icon name="plus" className="h-5 w-5" />
            Create New Lead
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Fill out detailed information to create a new high-quality lead.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 max-h-[70vh] overflow-y-auto">

          {/* Lead Type */}
          <section className="space-y-1">
            <Label>Lead Type</Label>
            <Select
              value={form.templateType}
              onValueChange={(v) => update("templateType", v as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lead type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </section>

          {/* Company / Individual */}
          {form.templateType === "company" ? (
            <section className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Name *</Label>
                <Input
                  placeholder="Future Inc"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                />
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  placeholder="https://example.com"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                />
              </div>
            </section>
          ) : (
            <section className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  placeholder="John"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                />
              </div>

              <div>
                <Label>Last Name *</Label>
                <Input
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                />
              </div>
            </section>
          )}

          {/* Contact Section */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <Label>Contact Person *</Label>
              <Input
                placeholder="Raj Patel"
                value={form.contactPerson}
                onChange={(e) => update("contactPerson", e.target.value)}
              />
            </div>

            <div>
              <Label>Phone *</Label>
              <Input
                placeholder="+919876543210"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="contact@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div>
              <Label>Preferred Contact</Label>
              <Select
                value={form.preferredContact}
                onValueChange={(v) => update("preferredContact", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  {contactChannels.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Address */}
          <section>
            <Label>Address</Label>
            <Textarea
              placeholder="Street, City, State, Zip"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </section>

          {/* Deal Qualification */}
          <section className="grid grid-cols-3 gap-4">
            <div>
              <Label>Lead Owner</Label>
              <Select
                value={form.leadOwner}
                onValueChange={(v) => update("leadOwner", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Budget (INR) *</Label>
              <Input
                type="number"
                placeholder="50000"
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
              />
            </div>

            <div>
              <Label>Stage</Label>
              <Select
                value={form.stage}
                onValueChange={(v) => update("stage", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Rating</Label>
              <Select
                value={form.rating}
                onValueChange={(v) => update("rating", v as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ratings.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lead Source</Label>
              <Select
                value={form.leadSource}
                onValueChange={(v) => update("leadSource", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Tags Section */}
          <section className="space-y-2">
            <Label>Tags</Label>

            {/* Input for new tag */}
            <div className="flex gap-2">
              <Input
                placeholder="Add new tag"
                value={newTagText}
                onChange={(e) => setNewTagText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNewTag()}
              />
              <Button variant="outline" onClick={addNewTag}>
                Add
              </Button>
            </div>

            {/* MultiSelect for tags */}
            <MultiSelect
              label="Tags"
              options={tagsList}
              value={selectedTags}
              onChange={setSelectedTags}
            />
          </section>

          {/* Notes */}
          <section>
            <Label>Notes</Label>
            <Textarea
              placeholder="Any additional notes..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="px-6">
            Create Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadModal;
