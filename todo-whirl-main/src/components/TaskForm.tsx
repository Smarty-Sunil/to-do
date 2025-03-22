
import React, { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PlusCircle, Bell, X } from "lucide-react";
import { Task } from "./TaskItem";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [reminderTime, setReminderTime] = useState("12:00");

  // Generate time options for select dropdown (30-minute intervals)
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const time = `${formattedHour}:${formattedMinute}`;
      const displayTime = format(new Date().setHours(hour, minute), 'h:mm a');
      timeOptions.push({ value: time, label: displayTime });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      toast.error("Task cannot be empty", {
        description: "Please enter a task description",
      });
      return;
    }
    
    let reminderDateTime: Date | undefined = undefined;
    
    if (reminderDate) {
      const [hours, minutes] = reminderTime.split(":").map(Number);
      reminderDateTime = new Date(reminderDate);
      reminderDateTime.setHours(hours, minutes);
      
      // Check if reminder time is in the past
      if (reminderDateTime < new Date()) {
        toast.error("Reminder time is in the past", {
          description: "Please select a future time",
        });
        return;
      }
    }
    
    const newTask: Task = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      reminder: reminderDateTime,
    };
    
    onAddTask(newTask);
    setText("");
    setReminderDate(undefined);
    setReminderTime("12:00");
    setShowReminderPicker(false);
    
    toast.success("Task added", {
      description: reminderDateTime 
        ? `Task has been added with a reminder for ${format(reminderDateTime, "MMM d, h:mm a")}`
        : "New task has been added to your list",
    });
  };

  const clearReminder = () => {
    setReminderDate(undefined);
    setShowReminderPicker(false);
  };

  // Format a date object to get a display string for the time
  const formatTimeDisplay = (timeString: string): string => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return format(date, 'h:mm a'); // Format as "1:30 PM"
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-6">
      <div
        className={cn(
          "relative flex items-center w-full p-1 overflow-hidden rounded-xl task-glass transition-all duration-300",
          isFocused ? "shadow-md ring-2 ring-primary/20" : "shadow-sm"
        )}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Add a new task..."
          className="w-full px-4 py-3 bg-transparent border-none text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          aria-label="Add a new task"
        />
        
        <div className="flex gap-1">
          <Popover open={showReminderPicker} onOpenChange={setShowReminderPicker}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center rounded-lg text-muted-foreground p-2 transition-all duration-300 hover:text-primary",
                  reminderDate && "text-primary"
                )}
                aria-label="Set reminder"
              >
                <Bell className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-4 space-y-4">
                <h3 className="font-medium text-sm">Set Reminder</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <ScrollArea className="h-[240px] rounded-md border">
                    <Calendar
                      mode="single"
                      selected={reminderDate}
                      onSelect={setReminderDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="rounded-md pointer-events-auto"
                    />
                  </ScrollArea>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <Select
                    value={reminderTime}
                    onValueChange={setReminderTime}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time">
                        {reminderTime ? formatTimeDisplay(reminderTime) : "Select time"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      <ScrollArea className="h-[180px]">
                        <div className="p-1">
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </div>
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearReminder}
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setShowReminderPicker(false)}
                  >
                    Set Reminder
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <button
            type="submit"
            className={cn(
              "flex items-center justify-center rounded-lg text-white bg-primary p-2 transition-all duration-300 custom-focus",
              text.trim() ? "opacity-100" : "opacity-70"
            )}
            aria-label="Add task"
          >
            <PlusCircle className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {reminderDate && !showReminderPicker && (
        <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-xs text-primary">
          <Bell className="h-3 w-3" />
          {format(reminderDate, "MMM d")} at {formatTimeDisplay(reminderTime)}
          <button
            type="button"
            onClick={clearReminder}
            className="ml-1 text-muted-foreground hover:text-primary"
            aria-label="Clear reminder"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
    </form>
  );
};

export default TaskForm;
