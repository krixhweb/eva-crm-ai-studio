// /pages/sales/Leads/PipelineAndTable.tsx

import React, { useMemo } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Icon } from "../../../components/icons/Icon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/DropdownMenu";
import { formatCurrency } from "../../../lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/Table";
import type { Deal } from "../../../types";

type Props = {
  deals: Deal[];
  stages: string[];
  view: "kanban" | "table";
  onMoveDeal: (dealId: string, newStage: string) => void;
  onMarkLost: (dealId: string) => void;
  onRequestSort: (key: keyof Deal) => void;
  sortConfig?: { key: keyof Deal; direction: "asc" | "desc" } | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// Priority chip colors
const getPriorityStyles = (priority: string) => {
  switch (priority) {
    case "high":
      return { dot: "bg-red-500" };
    case "medium":
      return { dot: "bg-yellow-500" };
    default:
      return { dot: "bg-blue-500" };
  }
};

const PipelineAndTable: React.FC<Props> = ({
  deals,
  stages,
  view,
  onMoveDeal,
  onMarkLost,
  onRequestSort,
  sortConfig,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Group deals by stage
  const byStage = useMemo(() => {
    const map: Record<string, Deal[]> = {};
    stages.forEach((s) => (map[s] = []));
    deals.forEach((d) => {
      if (!map[d.stage]) map[d.stage] = [];
      map[d.stage].push(d);
    });
    return map;
  }, [deals, stages]);

  // Kanban drag
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("deal-id", id);
  };

  const handleDrop = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("deal-id");
    if (id) onMoveDeal(id, stage);
  };

  // -----------------------------
  // ⭐ KANBAN VIEW
  // -----------------------------
  if (view === "kanban") {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageDeals = byStage[stage] || [];

          return (
            <div
              key={stage}
              className="w-[340px] flex-shrink-0"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg border-t-4 p-3 flex flex-col border-gray-300 dark:border-gray-700 h-full">

                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {stage}
                  </h4>

                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {stageDeals.length}
                  </span>
                </div>

                {/* Deals */}
                <div className="space-y-3 overflow-auto max-h-[65vh] pr-1">

                  {stageDeals.map((d) => (
                    <div
                      key={d.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, d.id)}
                      className="cursor-grab active:cursor-grabbing bg-white dark:bg-gray-700 rounded-md p-3 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                            {d.company}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {d.contactPerson}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(d.value)}
                          </div>
                          <div className="text-xs text-gray-400">{d.probability}%</div>
                        </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-300">

                        {/* Priority */}
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              getPriorityStyles(d.priority).dot
                            }`}
                          />
                          <span className="capitalize">{d.priority}</span>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0 border-none hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              <Icon name="moreVertical" className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onMarkLost(d.id)}>
                              Mark Lost
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="text-center py-8 text-sm text-gray-400 border border-dashed rounded">
                      No deals
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // -----------------------------
  // ⭐ TABLE VIEW
  // -----------------------------
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company & Contact</TableHead>

              {/* VALUE SORT */}
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => onRequestSort("value")}
              >
                <div className="flex items-center gap-1">
                  Value
                  {sortConfig?.key === "value" && (
                    <Icon
                      name={sortConfig.direction === "asc" ? "arrowUp" : "arrowDown"}
                      className="w-3 h-3"
                    />
                  )}
                </div>
              </TableHead>

              <TableHead>Probability</TableHead>

              {/* STAGE SORT */}
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => onRequestSort("stage")}
              >
                <div className="flex items-center gap-1">
                  Stage
                  {sortConfig?.key === "stage" && (
                    <Icon
                      name={sortConfig.direction === "asc" ? "arrowUp" : "arrowDown"}
                      className="w-3 h-3"
                    />
                  )}
                </div>
              </TableHead>

              <TableHead>Priority</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {deals.map((d) => (
              <TableRow key={d.id}>
                {/* Company */}
                <TableCell>
                  <div className="font-medium">{d.company}</div>
                  <div className="text-xs text-gray-500">{d.contactPerson}</div>
                </TableCell>

                {/* Value */}
                <TableCell className="font-semibold text-green-600">
                  {formatCurrency(d.value)}
                </TableCell>

                {/* Probability */}
                <TableCell>{d.probability}%</TableCell>

                {/* Stage */}
                <TableCell>{d.stage}</TableCell>

                {/* Priority */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        getPriorityStyles(d.priority).dot
                      }`}
                    />
                    <span className="capitalize">{d.priority}</span>
                  </div>
                </TableCell>

                {/* Owner */}
                <TableCell>{d.assignees?.[0]?.name ?? "N/A"}</TableCell>

                {/* Actions */}
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0 border-none"
                      >
                        <Icon name="moreVertical" className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onMarkLost(d.id)}>
                        Mark Lost
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 flex items-center justify-between border-t dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PipelineAndTable;
