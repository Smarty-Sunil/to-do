
import React, { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/components/TaskItem";
import { toast } from "sonner";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initialization
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => {
    setTasks((prevTasks) => [task, ...prevTasks]);
  };

  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const activeTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-secondary/30 flex flex-col items-center justify-start px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-block px-3 py-1 mb-2 text-xs font-medium text-primary-foreground bg-primary/90 rounded-full">
            Task Manager
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-foreground tracking-tight">
            Your Tasks
          </h1>
          <p className="text-muted-foreground">
            {activeTasksCount === 0 && completedTasksCount === 0 
              ? "Start by adding your first task"
              : activeTasksCount === 0
              ? "All tasks completed! Well done!"
              : `You have ${activeTasksCount} active task${activeTasksCount !== 1 ? 's' : ''} remaining`}
          </p>
        </div>

        <div className="w-full space-y-6">
          <TaskForm onAddTask={addTask} />
          
          <TaskList
            tasks={tasks}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </div>

        {completedTasksCount > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {completedTasksCount} task{completedTasksCount !== 1 ? 's' : ''} completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
