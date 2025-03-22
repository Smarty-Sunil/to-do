
import React from "react";
import { ClipboardList } from "lucide-react";

const EmptyState: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="p-6 rounded-full bg-secondary/50 mb-4">
        <ClipboardList className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium text-foreground mb-2">No tasks yet</h3>
      <p className="text-muted-foreground text-center max-w-xs">
        Add your first task using the form above and set reminders to stay on track.
      </p>
    </div>
  );
};

export default EmptyState;
