import React, { useRef, useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../../components/ui/Select";
import { Icon } from "../../../components/icons/Icon";
import { Label } from "../../../components/ui/Label";

// ----------------------------------------------
// FIX: ADD THIS INTERFACE
// ----------------------------------------------
interface ToolbarProps {
  assignees: string[];
  stages: string[];
  priorities: string[];

  searchValue: string;
  assignedValue: string;
  stageValue: string;
  priorityValue: string;

  dateFrom: string;
  dateTo: string;

  onChange: (payload: Partial<{
    searchValue: string;
    assignedValue: string;
    stageValue: string;
    priorityValue: string;
    dateFrom: string;
    dateTo: string;
  }>) => void;

  onRefresh: () => void;
  onExport: () => void;
  onImportFile: (file: File) => void;

  onToggleView: () => void;
  view: "kanban" | "table";

  onNewLead: () => void;
}
// ----------------------------------------------

const Toolbar: React.FC<ToolbarProps> = ({
  assignees,
  stages,
  priorities,
  searchValue,
  assignedValue,
  stageValue,
  priorityValue,
  dateFrom,
  dateTo,
  onChange,
  onRefresh,
  onExport,
  onImportFile,
  onToggleView,
  view,
  onNewLead,
}) => {

  const fileRef = useRef<HTMLInputElement | null>(null);
  const datePopupRef = useRef<HTMLDivElement>(null);

  const [showDatePopup, setShowDatePopup] = useState(false);
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  const [localDateTo, setLocalDateTo] = useState(dateTo);

  // Sync local state when external filters change
  useEffect(() => {
    setLocalDateFrom(dateFrom);
    setLocalDateTo(dateTo);
  }, [dateFrom, dateTo]);

  // Close the date popup when clicking outside
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (datePopupRef.current && !datePopupRef.current.contains(e.target as Node)) {
        setShowDatePopup(false);
      }
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);

  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 flex-wrap">

        {/* Search */}
        <div className="relative">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          />
          <Input
            value={searchValue}
            onChange={(e) => onChange({ searchValue: e.target.value })}
            placeholder="Search company or contact..."
            className="pl-9 w-56 h-9"
          />
        </div>

        {/* ASSIGNEE */}
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-600 dark:text-gray-400">Assignee</Label>

          <Select value={assignedValue} onValueChange={(v) => onChange({ assignedValue: v })}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="All">All Assignees</SelectItem>
              {assignees.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* STAGE */}
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-600 dark:text-gray-400">Stage</Label>

          <Select value={stageValue} onValueChange={(v) => onChange({ stageValue: v })}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="All Stages" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="All">All Stages</SelectItem>
              {stages
                .filter((s) => s !== "All")
                .map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* PRIORITY */}
        <div className="flex items-center gap-2">
          <Label className="text-sm text-gray-600 dark:text-gray-400">Priority</Label>

          <Select value={priorityValue} onValueChange={(v) => onChange({ priorityValue: v })}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="All">All Priorities</SelectItem>
              {priorities
                .filter((p) => p !== "All")
                .map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* DATE SELECTOR */}
        <div className="relative" ref={datePopupRef}>
          <Button
            variant="outline"
            size="sm"
            className="h-9"
            onClick={() => setShowDatePopup(!showDatePopup)}
          >
            <Icon name="calendar" className="mr-2 h-4 w-4" />
            {dateFrom && dateTo ? `${dateFrom} → ${dateTo}` : "Select date"}
          </Button>

          {showDatePopup && (
            <div className="absolute left-0 mt-2 z-50 w-80 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg space-y-3">
              <h4 className="font-semibold text-sm">Filter by Due Date</h4>

              <div className="space-y-2">
                <div>
                  <Label>From</Label>
                  <Input
                    type="date"
                    value={localDateFrom}
                    onChange={(e) => setLocalDateFrom(e.target.value)}
                  />
                </div>

                <div>
                  <Label>To</Label>
                  <Input
                    type="date"
                    value={localDateTo}
                    onChange={(e) => setLocalDateTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setLocalDateFrom("");
                    setLocalDateTo("");
                    onChange({ dateFrom: "", dateTo: "" });
                    setShowDatePopup(false);
                  }}
                >
                  Clear
                </Button>

                <Button
                  size="sm"
                  onClick={() => {
                    onChange({ dateFrom: localDateFrom, dateTo: localDateTo });
                    setShowDatePopup(false);
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDE TOOLS */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExport}>
            <Icon name="download" className="mr-2 h-4 w-4" />
            Export
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onImportFile(e.target.files[0])}
          />

          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="arrowUp" className="mr-2 h-4 w-4" />
            Import
          </Button>

          <Button variant="outline" size="sm" onClick={onRefresh}>
            <Icon name="refreshCw" className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <div className="h-6 border-l border-gray-300 dark:border-gray-600 mx-3"></div>

          <Button variant="outline" size="sm" onClick={onToggleView}>
            <Icon name={view === "kanban" ? "table" : "pipeline"} className="mr-2 h-4 w-4" />
            {view === "kanban" ? "Table View" : "Kanban View"}
          </Button>

          <Button size="sm" onClick={onNewLead}>
            + New Lead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
