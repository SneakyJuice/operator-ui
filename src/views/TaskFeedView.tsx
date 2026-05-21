import { useState, useEffect } from 'react';

type ColumnKey = 'delegated' | 'inProgress' | 'review' | 'complete'

type Task = {
  name: string;
  priority: string;
  assignee: string;
  age: string;
};

type Columns = Record<ColumnKey, Task[]>

export default function TaskFeedView() {
  const [tasks, setTasks] = useState<Columns>({
    delegated: [],
    inProgress: [],
    review: [],
    complete: []
  });

  const mockTasks = {
    delegated: [
      { name: "Wire ClickUp env token", priority: "high", assignee: "Z", age: "2d ago" },
      { name: "Set up Vercel cron", priority: "normal", assignee: "A", age: "1d ago" }
    ],
    inProgress: [
      { name: "P2 Full Sprint", priority: "urgent", assignee: "Z", age: "4h ago" },
      { name: "Live data integration", priority: "high", assignee: "A", age: "2d ago" }
    ],
    review: [
      { name: "Integration map 33 nodes", priority: "normal", assignee: "Z", age: "1d ago" }
    ],
    complete: [
      { name: "P0 skeleton", priority: "normal", assignee: "Z", age: "3d ago" },
      { name: "Sun Life theme", priority: "normal", assignee: "Z", age: "2d ago" },
      { name: "Mobile nav", priority: "low", assignee: "A", age: "2d ago" },
      { name: "P1 live data", priority: "high", assignee: "Z", age: "1d ago" }
    ]
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/clickup?endpoint=tasks&list=901711268618');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        const columns: Columns = { delegated: [], inProgress: [], review: [], complete: [] };
        const taskList: Task[] = Array.isArray(data) ? data : (data.tasks || []);

        taskList.forEach((task: Task) => {
          const status = (task as unknown as { status?: { status?: string } }).status?.status?.toLowerCase() ||
                         (task as unknown as { status?: string }).status?.toLowerCase() || ''
          if (["to do", "open", "delegated"].includes(status)) {
            columns.delegated.push(task);
          } else if (["in progress", "active", "working"].includes(status)) {
            columns.inProgress.push(task);
          } else if (["review", "testing", "blocked"].includes(status)) {
            columns.review.push(task);
          } else if (["complete", "done", "closed"].includes(status)) {
            columns.complete.push(task);
          }
        });

        setTasks(columns);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks(mockTasks);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-[#0a2535] p-3 mb-2 rounded border border-[#1a4a62]">
      <h4 className="font-medium text-white text-sm mb-1">{task.name}</h4>
      <div className="flex items-center mb-2">
        <span className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} mr-2`}></span>
        <span className="text-xs text-[#8aacbc]">{task.assignee}</span>
        <span className="text-xs text-[#4a7a94] ml-auto">{task.age}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex gap-6 overflow-x-auto">
        {(Object.entries({
          delegated: 'Delegated',
          inProgress: 'In Progress',
          review: 'Review',
          complete: 'Complete'
        }) as [ColumnKey, string][]).map(([key, title]) => (
          <div key={key} className="flex-shrink-0 w-64">
            <h3 className="text-white font-bold mb-3 flex items-center">
              {title}
              <span className="ml-2 bg-[#1a4a62] text-[#8aacbc] text-xs rounded-full px-2 py-0.5">{tasks[key].length}</span>
            </h3>
            <div className="space-y-2 min-h-96">
              {tasks[key].map((task: Task, index: number) => (
                <TaskCard key={index} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}