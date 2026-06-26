import { FacultyLayout } from "@/components/faculty-layout";
import { 
  useListCourseContexts, 
  useCreateCourseContext, 
  useDeleteCourseContext,
  getListCourseContextsQueryKey
} from "@workspace/api-client-react";
import { useState } from "react";
import { Plus, Trash2, PenLine, Upload, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
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
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-serif text-primary">Course Context</h1>
          <p className="text-muted-foreground mt-1">Map your course schedule to topics and learning objectives so CoursePulse can connect student reflections to the right content.</p>
        </div>

        {/* Setup options */}
        <div className="grid md:grid-cols-2 gap-5">
          <Card className="border-2 border-primary/20 bg-primary/5 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                <PenLine className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-lg text-primary mb-1">Manage Manually</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Add, edit, or remove individual course context rows. Best for making targeted updates.
                </p>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Context Row
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
            </CardContent>
          </Card>

          <Card className="border-2 border-secondary/20 bg-secondary/5 hover:border-secondary/40 transition-colors">
            <CardContent className="p-6 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-secondary/10 shrink-0">
                <Upload className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-lg text-secondary-foreground mb-1">
                  Upload Syllabus <span className="text-xs font-sans font-normal text-muted-foreground ml-1">(faster)</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a .docx syllabus to generate a draft course context. You'll review and approve every row before anything is saved.
                </p>
                <Link href="/faculty/syllabus-upload">
                  <Button size="sm" variant="outline" className="gap-2 border-secondary/30 text-secondary hover:bg-secondary/10">
                    <Upload className="w-4 h-4" />
                    Go to Syllabus Upload
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Context table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Current Course Context</CardTitle>
            <CardDescription>
              {contexts?.length ?? 0} {(contexts?.length ?? 0) === 1 ? "row" : "rows"} defined
            </CardDescription>
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
                      <td className="px-4 py-3 font-medium text-muted-foreground">W{item.week}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{item.topic}</td>
                      <td className="px-4 py-3 text-muted-foreground">{item.learningObjective}</td>
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
                  {!isLoading && (contexts?.length ?? 0) === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                        No contexts defined yet. Add one manually or upload a syllabus above.
                      </td>
                    </tr>
                  )}
                  {isLoading && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading...</td>
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
