"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";

interface SettingsProps {
  lists: any;
  onUpdate: (lists: any) => void;
}

export function JournalSettings({ lists, onUpdate }: SettingsProps) {
  const [newItem, setNewItem] = useState("");
  const [type, setType] = useState("strategies");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newItem.trim();
    if (!val || lists[type].includes(val)) return;
    onUpdate({ ...lists, [type]: [...lists[type], val] });
    setNewItem("");
  };

  const handleDelete = (t: string, tType: string) => {
    onUpdate({ ...lists, [tType]: lists[tType].filter((i: string) => i !== t) });
  };

  const sections = [
    { key: "strategies", label: "Strategy Playbooks", placeholder: "e.g. ICT Silver Bullet" },
    { key: "pairs", label: "Instrument Pairs", placeholder: "e.g. NASDAQ100" },
    { key: "signals", label: "Confluence Tags", placeholder: "e.g. FVG Tap" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Journal Configuration</h2>
        <p className="text-sm text-muted-foreground">Manage dropdown lists used when logging trades.</p>
      </div>

      {sections.map((sec) => (
        <div key={sec.key} className="rounded-xl border border-border bg-background p-5">
          <div className="mb-4">
            <h3 className="font-semibold">{sec.label}</h3>
            <p className="text-xs text-muted-foreground mt-1">Items appear in trade-log dropdowns.</p>
          </div>
          <form onSubmit={handleAdd} className="flex gap-2 mb-4" onChange={(e) => { if (e.target.name === "item") setNewItem(e.target.value); }}>
            <input
              name="item"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={type === sec.key ? newItem : ""}
              placeholder={sec.placeholder}
            />
            <Button type="submit">Add</Button>
          </form>
          <div className="flex flex-wrap gap-2">
            {lists[sec.key].map((item: string) => (
              <span key={item} className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium border border-input bg-background">
                {item}
                <button type="button" onClick={() => handleDelete(item, sec.key)} className="ml-1 p-0.5 text-muted-foreground hover:text-red">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl border border-border bg-background p-5">
        <div className="mb-4">
          <h3 className="font-semibold">Reset to Defaults</h3>
          <p className="text-xs text-muted-foreground mt-1">Restore factory strategy, pair, and signal lists.</p>
        </div>
        <Button variant="outline" size="sm">Reset Defaults</Button>
      </div>
    </div>
  );
}
