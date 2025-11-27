
import React, { useMemo, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import Dashboard from "./components/leads/Dashboard";
import Toolbar from "./components/leads/Toolbar";
import PipelineAndTable from "./components/leads/PipelineAndTable";
import { useToast } from "../../hooks/use-toast";
import CreateLeadModal from "../../components/modals/CreateLeadModal";
import type { Deal, LeadFormData } from '../../types';
import { mockDeals } from '../../data/mockData';
import type { RootState } from '../../store/store';

const STAGES = ["Lead Gen","Qualification","Proposal","Demo","Negotiation","Closed Won","Closed Lost"];
const PRIORITIES = ["low","medium","high"];

const SalesPipelinePage: React.FC = () => {
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [view, setView] = useState<"kanban" | "table">("kanban");
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // Filters - controlled by parent, passed to Toolbar
  const [searchValue, setSearchValue] = useState("");
  const [assignedValue, setAssignedValue] = useState("All");
  const [stageValue, setStageValue] = useState("All");
  const [priorityValue, setPriorityValue] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // table sorting + pagination
  const [sortConfig, setSortConfig] = useState<{ key: keyof Deal; direction: "asc" | "desc" } | null>({ key: "value", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // Apply filters to deals (global)
  const filteredDeals = useMemo(() => {
    return deals.filter(d => {
      if (searchValue.trim() && !(`${d.company} ${d.contactPerson}`.toLowerCase().includes(searchValue.toLowerCase()))) return false;
      if (assignedValue !== "All" && !d.assignees.some(a => a.name === assignedValue)) return false;
      if (stageValue !== "All" && d.stage !== stageValue) return false;
      if (priorityValue !== "All" && d.priority !== priorityValue) return false;
      if (dateFrom) {
        const f = new Date(dateFrom); f.setHours(0,0,0,0);
        const due = new Date(d.dueDate);
        if (due < f) return false;
      }
      if (dateTo) {
        const t = new Date(dateTo); t.setHours(23,59,59,999);
        const due = new Date(d.dueDate);
        if (due > t) return false;
      }
      return true;
    }).sort((a,b) => {
      if (!sortConfig) return 0;
      const aV = a[sortConfig.key];
      const bV = b[sortConfig.key];
      if (typeof aV === "number" && typeof bV === "number") return sortConfig.direction === "asc" ? aV - bV : bV - aV;
      return sortConfig.direction === "asc" ? String(aV).localeCompare(String(bV)) : String(bV).localeCompare(String(aV));
    });
  }, [deals, searchValue, assignedValue, stageValue, priorityValue, dateFrom, dateTo, sortConfig]);

  // pagination info for table
  const totalPages = Math.max(1, Math.ceil(filteredDeals.length / ITEMS_PER_PAGE));
  const paginatedDeals = useMemo(() => {
    return filteredDeals.slice((currentPage - 1) * ITEMS_PER_PAGE, (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE);
  }, [filteredDeals, currentPage]);

  // callbacks for Toolbar changes
  const handleToolbarChange = (payload: Partial<{ searchValue: string; assignedValue: string; stageValue: string; priorityValue: string; dateFrom: string; dateTo: string; }>) => {
    if (payload.searchValue !== undefined) setSearchValue(payload.searchValue);
    if (payload.assignedValue !== undefined) setAssignedValue(payload.assignedValue);
    if (payload.stageValue !== undefined) setStageValue(payload.stageValue);
    if (payload.priorityValue !== undefined) setPriorityValue(payload.priorityValue);
    if (payload.dateFrom !== undefined) setDateFrom(payload.dateFrom);
    if (payload.dateTo !== undefined) setDateTo(payload.dateTo);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    toast({ title: "Filters applied", description: "Data refreshed" });
  };

  const handleExport = () => {
    if (filteredDeals.length === 0) { toast({ title: "No data", description: "No rows to export", variant: "destructive" }); return; }
    const header = ["Company","Description","Value","Stage","Priority","Probability"];
    const rows = filteredDeals.map(d => [
      `"${d.company.replace(/"/g,'""')}"`,
      `"${(d.description||"").replace(/"/g,'""')}"`,
      d.value?.toString() ?? "0",
      d.stage,
      d.priority,
      d.probability?.toString() ?? "0"
    ]);
    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Export complete", description: `${filteredDeals.length} rows exported.` });
  };

  // simple CSV parse: parent handles strict validation & append/replace flow if needed
  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result || "");
      // Basic parse + minimal validation here; open a confirm to append (simple)
      // For now do a lightweight parse and append — if you want strict rules reuse previous parser
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length <= 1) { toast({ title: "Empty CSV", variant: "destructive" }); return; }
      const header = lines[0].split(",").map(h => h.trim());
      const required = ["Company","Description","Value","Stage","Priority","Probability"];
      const okHeader = required.every((r, idx) => header[idx] && header[idx].toLowerCase() === r.toLowerCase());
      if (!okHeader) { toast({ title: "CSV invalid", description: `Required header: ${required.join(", ")}`, variant: "destructive" }); return; }
      const parsed: Deal[] = [];
      for (let i = 1; i < lines.length; i++) {
        try {
          const cols = lines[i].split(",").map(c => c.trim().replace(/^"|"$/g,""));
          if (cols.length < 6) continue;
          const [company, description, valueStr, stage, priority, probStr] = cols;
          const value = Number(valueStr) || 0;
          const probability = Number(probStr) || 0;
          parsed.push({
            id: `imp-${Date.now()}-${i}`,
            company,
            contactPerson: "",
            description,
            value,
            probability,
            assignees: [{ name: "Unassigned", avatar: "UA" }],
            daysInStage: 0,
            priority: priority as Deal["priority"],
            stage,
            comments: 0,
            attachments: 0,
            dueDate: new Date().toISOString().split("T")[0],
            // Auditing for imported items
            createdBy: currentUser.id,
            createdByName: currentUser.name,
            createdAt: new Date().toISOString()
          });
        } catch (err) { /* skip bad rows */ }
      }

      if (parsed.length === 0) { toast({ title: "No rows parsed", variant: "destructive" }); return; }

      // show simple confirm: Append or Replace
      if (confirm(`Import ${parsed.length} rows. Press OK to append, Cancel to replace.`)) {
        setDeals(prev => [...parsed, ...prev]);
        toast({ title: "Import appended", description: `${parsed.length} deals appended.` });
      } else {
        setDeals(parsed);
        toast({ title: "Import replaced", description: `${parsed.length} deals imported.` });
      }
    };
    reader.readAsText(file, "utf-8");
  };

  // kanban move call
  const handleMoveDeal = (dealId: string, newStage: string) => {
    const d = deals.find(x => x.id === dealId);
    if (!d) return;
    if (d.stage === "Closed Won" || d.stage === "Closed Lost") { toast({ title: "Move not allowed", description: "Final stages cannot be moved", variant: "destructive" }); return; }
    if (newStage === d.stage) return;
    // if moving to closed won/lost we should confirm
    if (newStage === "Closed Won") {
      if (!confirm(`Mark "${d.company}" as Won?`)) return;
    }
    setDeals(prev => prev.map(x => x.id === dealId ? { 
      ...x, 
      stage: newStage, 
      daysInStage: 0,
      updatedBy: currentUser.id,
      updatedByName: currentUser.name,
      updatedAt: new Date().toISOString() 
    } : x));
    toast({ title: "Deal moved", description: `${d.company} → ${newStage}` });
  };

  const handleMarkLost = (dealId: string) => {
    const d = deals.find(x => x.id === dealId);
    if (!d) return;
    if (!confirm(`Mark "${d.company}" as Lost?`)) return;
    setDeals(prev => prev.map(x => x.id === dealId ? { 
      ...x, 
      stage: "Closed Lost",
      updatedBy: currentUser.id,
      updatedByName: currentUser.name,
      updatedAt: new Date().toISOString()
    } : x));
    toast({ title: "Marked lost", description: `${d.company} marked as Closed Lost` });
  };

  const handleSort = (key: keyof Deal) => {
    if (!sortConfig || sortConfig.key !== key) setSortConfig({ key, direction: "desc" });
    else setSortConfig({ key, direction: sortConfig.direction === "asc" ? "desc" : "asc" });
  };

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Pipeline</h1>
        <p className="text-muted-foreground mt-1 text-gray-500">Visualize and manage your deals</p>
      </div>

      <Dashboard deals={filteredDeals} />

      <div>
        <Toolbar
          assignees={Array.from(new Set(deals.flatMap(d => d.assignees.map(a => a.name)))) || ["All"]}
          stages={["All", ...STAGES]}
          priorities={["All", ...PRIORITIES]}
          searchValue={searchValue}
          assignedValue={assignedValue}
          stageValue={stageValue}
          priorityValue={priorityValue}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onChange={(p) => handleToolbarChange(p)}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onImportFile={handleImportFile}
          onToggleView={() => setView(v => v === "kanban" ? "table" : "kanban")}
          view={view}
          onNewLead={() => setCreateOpen(true)}
        />

        <div className="mt-4">
          <PipelineAndTable
            deals={view === "kanban" ? filteredDeals : paginatedDeals}
            stages={STAGES}
            view={view}
            onMoveDeal={handleMoveDeal}
            onMarkLost={handleMarkLost}
            onRequestSort={handleSort}
            sortConfig={sortConfig}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <CreateLeadModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreate={(data: LeadFormData) => {
        // Convert LeadFormData into Deal
        const owner = { name: data.leadOwner || "Unassigned", avatar: data.leadOwner ? data.leadOwner.split(" ").map(n=>n[0]).join("") : "UA" };
        const due = new Date(); due.setDate(due.getDate() + 30);
        const newDeal: Deal = {
          id: `lead-${Date.now()}`,
          company: data.templateType === "company" ? data.companyName : `${data.firstName} ${data.lastName}`,
          contactPerson: data.contactPerson,
          description: data.description || "",
          value: Number(data.budget) || 0,
          probability: data.rating === "Hot" ? 80 : data.rating === "Warm" ? 50 : 20,
          assignees: [{ name: owner.name, avatar: owner.avatar }],
          daysInStage: 0,
          priority: (data.rating === "Hot" ? "high" : data.rating === "Warm" ? "medium" : "low") as Deal["priority"],
          stage: data.stage,
          comments: 0,
          attachments: 0,
          dueDate: due.toISOString().split("T")[0],
          // Audit
          createdBy: currentUser.id,
          createdByName: currentUser.name,
          createdAt: new Date().toISOString()
        };
        setDeals(prev => [newDeal, ...prev]);
        setCreateOpen(false);
        toast({ title: "Lead created", description: `${newDeal.company} added to pipeline.` });
      }} />
    </div>
  );
};

export default SalesPipelinePage;
