import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const typeColors = {
  text: "bg-green-50 text-green-700 border-green-200",
  nested: "bg-blue-50 text-blue-700 border-blue-200",
  tabular: "bg-purple-50 text-purple-700 border-purple-200"
};

export default function FieldCard({ 
  field, 
  onUpdate, 
  onDelete, 
  onAddChild,
  depth = 0,
  index 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const hasChildren = field.type === "nested" || field.type === "tabular";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      className={cn("relative group", depth > 0 && "ml-8")}
    >
      {depth > 0 && (
        <div className="absolute left-[-24px] top-0 bottom-0 w-px bg-slate-200" />
      )}
      {depth > 0 && (
        <div className="absolute left-[-24px] top-[18px] w-6 h-px bg-slate-200" />
      )}
      
      <div className="flex items-center gap-3 py-1.5 hover:bg-slate-50 px-2 -mx-2 rounded">
        {hasChildren && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        )}
        {!hasChildren && <div className="w-3.5" />}
        
        <div className="min-w-[180px] flex-shrink-0">
          {isEditingName ? (
            <Input
              value={field.name}
              onChange={(e) => onUpdate({ ...field, name: e.target.value })}
              onBlur={() => setIsEditingName(false)}
              autoFocus
              className="h-7 text-sm font-mono border-slate-300"
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="text-sm font-mono text-slate-800 hover:text-indigo-600 text-left w-full"
            >
              {field.name || "field_name"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={field.type}
            onChange={(e) => onUpdate({ ...field, type: e.target.value })}
            className={cn(
              "text-xs font-medium px-2 py-1 rounded border cursor-pointer transition-colors",
              typeColors[field.type]
            )}
          >
            <option value="text">String</option>
            <option value="nested">Object</option>
            <option value="tabular">Array/Object</option>
          </select>
        </div>

        <div className="flex-1">
          {isEditingDesc ? (
            <Input
              value={field.description}
              onChange={(e) => onUpdate({ ...field, description: e.target.value })}
              onBlur={() => setIsEditingDesc(false)}
              autoFocus
              placeholder="Add description..."
              className="h-7 text-sm border-slate-300"
            />
          ) : (
            <button
              onClick={() => setIsEditingDesc(true)}
              className="text-sm text-slate-600 hover:text-slate-800 text-left w-full"
            >
              {field.description || "Add description..."}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="h-6 w-6 text-slate-400 hover:text-rose-600"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {hasChildren && (
        <div className={cn("ml-3.5", !isExpanded && "hidden")}>
          <AnimatePresence>
            {field.children && field.children.map((child, idx) => (
              <FieldCard
                key={child.id}
                field={child}
                onUpdate={(updated) => {
                  const newChildren = [...field.children];
                  newChildren[idx] = updated;
                  onUpdate({ ...field, children: newChildren });
                }}
                onDelete={() => {
                  const newChildren = field.children.filter((_, i) => i !== idx);
                  onUpdate({ ...field, children: newChildren });
                }}
                onAddChild={onAddChild}
                depth={depth + 1}
                index={idx}
              />
            ))}
          </AnimatePresence>
          
          <button
            onClick={() => onAddChild(field.id)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 py-1.5 ml-2"
          >
            <Plus className="w-3 h-3" />
            Children
          </button>
        </div>
      )}
    </motion.div>
  );
}