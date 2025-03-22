
import React, { useState, useEffect } from "react";
import { Check, Trash2, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  reminder?: Date; // Optional reminder date
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if there's an active reminder
  useEffect(() => {
    if (task.reminder && !task.completed) {
      const now = new Date();
      const reminderTime = new Date(task.reminder);
      
      if (reminderTime > now) {
        const timeoutId = setTimeout(() => {
          toast("Task Reminder", {
            description: `Reminder for task: ${task.text}`,
            icon: <Bell className="h-4 w-4" />,
          });
        }, reminderTime.getTime() - now.getTime());
        
        return () => clearTimeout(timeoutId);
      }
    }
  }, [task]);

  const handleToggle = () => {
    onToggle(task.id);
    if (!task.completed) {
      toast.success("Task completed", {
        description: "Well done!",
        duration: 2000,
      });
    }
  };

  const handleDelete = () => {
    setIsDeleting(true);
    // Delay actual deletion to allow animation to complete
    setTimeout(() => {
      onDelete(task.id);
      toast("Task deleted", {
        description: "Task has been removed",
      });
    }, 300);
  };

  return (
    <div
      className={cn(
        "group relative w-full p-4 mb-3 rounded-xl task-glass shadow-sm transition-all duration-300 ease-in-out",
        "hover:shadow-md animate-scale-in",
        task.completed && "opacity-70",
        isDeleting && "animate-slide-out pointer-events-none"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className={cn(
            "custom-checkbox custom-focus",
            task.completed && "checked"
          )}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <div className="custom-checkbox-inner">
            {task.completed && <Check className="h-3 w-3 text-white" />}
          </div>
        </button>

        <div className="flex-1 flex flex-col">
          <span
            className={cn(
              "text-base transition-all duration-300",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.text}
          </span>
          
          {task.reminder && !task.completed && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <Bell className="h-3 w-3" /> 
              {format(new Date(task.reminder), "MMM d, h:mm a")}
            </span>
          )}
        </div>

        <button
          onClick={handleDelete}
          className={cn(
            "text-muted-foreground/60 hover:text-destructive custom-focus p-1.5 rounded-full transition-all duration-200",
            "opacity-0 group-hover:opacity-100",
            isHovering && "opacity-100"
          )}
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
