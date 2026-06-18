import { FacultyLayout } from "@/components/faculty-layout";
import { 
  useListCourseContexts, 
  useCreateCourseContext, 
  useDeleteCourseContext,
  getListCourseContextsQueryKey
} from "@workspace/api-client-react";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function FacultyCourseContextPage() {
  const { data: contexts, isLoading } = useListCourseContexts();
  const createMutation = useCreateCourseContext();
  const deleteMutation = useDeleteCourseContext();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    week: "",
    topic: "",
    learningObjective: "",
    assignment: "",
    reading: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        week: parseInt(formData.week, 10),
        topic: formData.topic,
        learningObjective: formData.learningObjective,
        assignment: formData.assignment,
        reading: formData.reading
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCourseContextsQueryKey() });
        setIsOpen(false);
        setFormData({ week: "", topic: "", learningObjective: "", assignment: "", reading: "" });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListCourseContextsQueryKey() });
      }
    });
  };

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary">Course Context</h1>
            <p className="text-muted-foreground mt-1">Manage topics and learning objectives mapped to the course schedule.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Context
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Course Context</DialogTitle>
                <DialogDescription>
                  Define topics and learning objectives to contextualize student reflections.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Week</label>
                  <Input 
                    type="number" 
                    min="1" 
                    required 
                    value={formData.week} 
                    onChange={e => setFormData({...formData, week: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topic</label>
                  <Input 
                    required 
                    value={formData.topic} 
                    onChange={e => setFormData({...formData, topic: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Learning Objective</label>
                  <Input 
                    required 
                    value={formData.learningObjective} 
                    onChange={e => setFormData({...formData, learningObjective: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignment (optional)</label>
                  <Input 
                    value={formData.assignment} 
                    onChange={e => setFormData({...formData, assignment: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reading (optional)</label>
                  <Input 
                    value={formData.reading} 
                    onChange={e => setFormData({...formData, reading: e.target.value})} 
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Adding..." : "Add Context"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="sr-only">
            <CardTitle>Context List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Week</th>
                    <th className="px-4 py-3 font-medium">Topic</th>
                    <th className="px-4 py-3 font-medium">Learning Objective</th>
                    <th className="px-4 py-3 font-medium w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {!isLoading && contexts?.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3">W{item.week}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{item.topic}</td>
                      <td className="px-4 py-3">{item.learningObjective}</td>
                      <td className="px-4 py-3 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          title="Delete context"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && contexts?.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No contexts defined yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </FacultyLayout>
  );
}
