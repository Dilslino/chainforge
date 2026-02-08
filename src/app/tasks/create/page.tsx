import { CreateTaskForm } from "@/components/CreateTaskForm";

export default function CreateTaskPage() {
  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create a Task</h1>
          <p className="text-muted-foreground mt-1">
            Post a task and lock ETH in escrow for the worker
          </p>
        </div>
        <CreateTaskForm />
      </div>
    </div>
  );
}
