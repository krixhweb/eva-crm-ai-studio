import React, { useMemo, useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import Toolbar from "./Toolbar";
import PipelineAndTable from "./PipelineAndTable";
import { useToast } from "../../../hooks/use-toast";
import CreateLeadModal from "../../../components/modals/CreateLeadModal";

import type { Deal, LeadFormData } from '../../../types';
import { 
  loadDeals,
  saveDeals,
  createDeal,
  updateDeal,
  replaceDeals
} from "../../../services/dealServices";

const STAGES = ["Lead Gen","Qualification","Proposal","Demo","Negotiation","Closed Won","Closed Lost"];
const PRIORITIES = ["low","medium","high"];

const SalesPipelinePage: React.FC = () => {
  const { toast } = useToast();

  // ✅ Load deals from localStorage on first render
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    const data = loadDeals();
    setDeals(data);
  }, []);

  // View toggle
  const [view, setView] = useState<"kanban" | "table">("kanban");

  // Filters
  const [searchValue, setSearchValue] = useState("");
  const [assignedValue, setAssignedValue] = useState("All");
  const [stageValue, setStageValue] = useState("All");
  const [priorityValue, setPriorityValue] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // sorting + pagination
  const [sortConfig, setSortConfig] = useState<{ key: keyof Deal; direction: "asc" | "desc" } | null>({
    key: "value",
    direction: "desc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  // FILTER + SORT
  const filteredDeals = useMemo(() => {
    const result = deals.filter(d => {
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
    });

    // sort
    result.sort((a,b) => {
      if (!sortConfig) return 0;
      const aV = a[sortConfig.key];
      const bV = b[sortConfig.key];
      if (typeof aV === "number" && typeof bV === "number")
        return sortConfig.direction === "asc" ? aV - bV : bV - aV;
      return sortConfig.direction === "asc"
        ? String(aV).localeCompare(String(bV))
        : String(bV).localeCompare(String(aV));
    });

    return result;
  }, [deals, searchValue, assignedValue, stageValue, priorityValue, dateFrom, dateTo, sortConfig]);

  // pagination
  const totalPages = Math.max(1, Math.ceil(filteredDeals.length / ITEMS_PER_PAGE));
  const paginatedDeals = filteredDeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  // Toolbar changes
  const handleToolbarChange = (payload: any) => {
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

  // Export CSV
  const handleExport = () => {
    if (filteredDeals.length === 0) {
      toast({ title: "No data", description: "Nothing to export", variant: "destructive" });
      return;
    }
    const header = ["Company","Description","Value","Stage","Priority","Probability"];
    const rows = filteredDeals.map(d => [
      `"${d.company.replace(/"/g,'""')}"`,
      `"${(d.description||"").replace(/"/g,'""')}"`,
      d.value,
      d.stage,
      d.priority,
      d.probability
    ]);

    const csv = [header.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `export_${Date.now()}.csv`;
    link.click();
  };

  // Import CSV
  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = String(e.target?.result);
      const lines = text.split(/\r?\n/).filter(Boolean);
      const required = ["Company","Description","Value","Stage","Priority","Probability"];

      const header = lines[0].split(",");
      const okHeader = required.every((r, i) => header[i]?.toLowerCase() === r.toLowerCase());

      if (!okHeader) {
        toast({ title: "Invalid CSV", variant: "destructive" });
        return;
      }

      const imported: Deal[] = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",").map(c => c.replace(/^"|"$/g,""));
        imported.push({
          id: `imp-${Date.now()}-${i}`,
          company: cols[0],
          contactPerson: "",
          description: cols[1],
          value: Number(cols[2]) || 0,
          stage: cols[3],
          priority: cols[4] as any,
          probability: Number(cols[5]) || 0,
          assignees: [{ name: "Unassigned", avatar: "UA" }],
          dueDate: new Date().toISOString().split("T")[0],
          daysInStage: 0,
          comments: 0,
          attachments: 0
        });
      }

      if (confirm(`Import ${imported.length} rows?\nOK = append, Cancel = replace`)) {
        const newDeals = [...imported, ...deals];
        setDeals(newDeals);
        saveDeals(newDeals);
      } else {
        setDeals(imported);
        replaceDeals(imported);
      }

      toast({ title: "Import complete" });
    };

    reader.readAsText(file);
  };

  // Kanban move
  const handleMoveDeal = (dealId: string, newStage: string) => {
    const updated = updateDeal(dealId, { stage: newStage, daysInStage: 0 });
    setDeals(updated);
    toast({ title: "Deal moved" });
  };

  const handleMarkLost = (dealId: string) => {
    const updated = updateDeal(dealId, { stage: "Closed Lost" });
    setDeals(updated);
    toast({ title: "Deal marked lost" });
  };

  const handleSort = (key: keyof Deal) => {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: "desc" });
    } else {
      setSortConfig({ key, direction: sortConfig.direction === "asc" ? "desc" : "asc" });
    }
  };

  const [createOpen, setCreateOpen] = useState(false);

  // Creating new lead → save in localStorage
  const handleCreateLead = (data: LeadFormData) => {
    const ownerInitials = data.leadOwner ? data.leadOwner.split(" ").map(n => n[0]).join("") : "UA";
    const due = new Date();
    due.setDate(due.getDate() + 30);

    const newDeal: Deal = {
      id: `lead-${Date.now()}`,
      company: data.templateType === "company" ? data.companyName : `${data.firstName} ${data.lastName}`,
      contactPerson: data.contactPerson,
      description: data.description || "",
      value: Number(data.budget) || 0,
      probability: data.rating === "Hot" ? 80 : data.rating === "Warm" ? 50 : 20,
      assignees: [{ name: data.leadOwner || "Unassigned", avatar: ownerInitials }],
      daysInStage: 0,
      priority: (data.rating === "Hot" ? "high" : data.rating === "Warm" ? "medium" : "low") as any,
      stage: data.stage,
      comments: 0,
      attachments: 0,
      dueDate: due.toISOString().split("T")[0]
    };

    const updated = createDeal(newDeal);
    setDeals(updated);

    toast({ title: "Lead created", description: `${newDeal.company} added to pipeline.` });
    setCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Pipeline</h1>
        <p className="text-gray-500">Visualize and manage your deals</p>
      </div>

      <Dashboard deals={filteredDeals} />

      <Toolbar
        assignees={Array.from(new Set(deals.flatMap(d => d.assignees.map(a => a.name))))}
        stages={["All", ...STAGES]}
        priorities={["All", ...PRIORITIES]}
        searchValue={searchValue}
        assignedValue={assignedValue}
        stageValue={stageValue}
        priorityValue={priorityValue}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChange={handleToolbarChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
        onImportFile={handleImportFile}
        onToggleView={() => setView(v => v === "kanban" ? "table" : "kanban")}
        view={view}
        onNewLead={() => setCreateOpen(true)}
      />

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

      <CreateLeadModal 
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreateLead}
      />
    </div>
  );
};

export default SalesPipelinePage;
