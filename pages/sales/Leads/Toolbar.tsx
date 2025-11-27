
// /sales/Leads/Toolbar.tsx
import React, { useRef } from "react";
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
import { DatePicker } from "../../../components/ui/DatePicker";
import { DateRange } from "../../../components/ui/Calendar";

const Toolbar = ({
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
  const fileRef = useRef(null);

  // Convert string dates back to DateRange object for the component
  const currentDateRange: DateRange | undefined = (dateFrom || dateTo) ? {
      from: dateFrom ? new Date(dateFrom) : undefined,
      to: dateTo ? new Date(dateTo) : undefined
  } : undefined;

  const handleDateChange = (range: DateRange | undefined) => {
      onChange({
          dateFrom: range?.from ? range.from.toISOString().split('T')[0] : "",
          dateTo: range?.to ? range.to.toISOString().split('T')[0] : ""
      });
  };

  return (
    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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

        {/* Filters */}
        <div className="flex items-center gap-2">
            <Label htmlFor="assignee-filter" className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignee</Label>
            <Select value={assignedValue} onValueChange={(v) => onChange({ assignedValue: v })}>
              <SelectTrigger id="assignee-filter" className="w-40 h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {assignees.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        
        <div className="flex items-center gap-2">
            <Label htmlFor="stage-filter" className="text-sm font-medium text-gray-600 dark:text-gray-400">Stage</Label>
            <Select value={stageValue} onValueChange={(v) => onChange({ stageValue: v })}>
              <SelectTrigger id="stage-filter" className="w-40 h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {stages.filter(s => s !== "All").map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        
        <div className="flex items-center gap-2">
            <Label htmlFor="priority-filter" className="text-sm font-medium text-gray-600 dark:text-gray-400">Priority</Label>
            <Select value={priorityValue} onValueChange={(v) => onChange({ priorityValue: v })}>
              <SelectTrigger id="priority-filter" className="w-36 h-9">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {priorities.filter(p => p !== "All").map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>
        
        {/* Date selector */}
        <div className="w-64">
            <DatePicker 
                mode="range"
                value={currentDateRange}
                onChange={handleDateChange}
                placeholder="Filter by Due Date"
                className="h-9"
            />
        </div>

        {/* Tools */}
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
            onChange={(e) => e.target.files[0] && onImportFile(e.target.files[0])}
          />

          <Button variant="outline" size="sm" onClick={() => fileRef.current.click()}>
            <Icon name="arrowUp" className="mr-2 h-4 w-4" />
            Import
          </Button>

          <Button variant="outline" size="sm" onClick={onRefresh}>
            <Icon name="refreshCw" className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <div className="h-8 border-l border-gray-300 mx-2"></div>

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
