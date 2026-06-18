import { FacultyLayout } from "@/components/faculty-layout";
import { 
  useListFacultyActions, 
  useCreateFacultyAction, 
  getListFacultyActionsQueryKey,
  useListTopics
} from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FacultyImpactTrackerPage() {
  const { data: actions, isLoading } = useListFacultyActions();
  const { data: topics } = useListTopics();
  const createMutation = useCreateFacultyAction();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    week: "",
    topic: "",
    actionTaken: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        week: parseInt(formData.week, 10),
        topic: formData.topic,
        actionTaken: formData.actionTaken
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListFacultyActionsQueryKey() });
        setIsOpen(false);
        setFormData({ week: "", topic: "", actionTaken: "" });
      }
    });
  };

  return (
    <FacultyLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary">Impact Tracker</h1>
            <p className="text-muted-foreground mt-1">Record instructional adjustments made based on learning intelligence.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Action
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Instructional Action</DialogTitle>
                <DialogDescription>
                  Document the changes you made based on course intelligence to track their impact.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Intervention Week</label>
                  <Select onValueChange={v => setFormData({...formData, week: v})} value={formData.week}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select week" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((week) => (
                        <SelectItem key={week} value={week.toString()}>
                          Week {week}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Related Topic</label>
                  <Select onValueChange={v => setFormData({...formData, topic: v})} value={formData.topic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {(topics || []).map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Action Taken</label>
                  <Textarea 
                    placeholder="e.g. Added a supplemental reading on recursion and spent 15mins reviewing it in lecture."
                    required 
                    className="min-h-[100px]"
                    value={formData.actionTaken} 
                    onChange={e => setFormData({...formData, actionTaken: e.target.value})} 
                  />
                </div>
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={createMutation.isPending || !formData.week || !formData.topic}>
                    {createMutation.isPending ? "Recording..." : "Save Record"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading actions...</div>
          ) : actions?.length === 0 ? (
            <Card className="border-dashed bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground">No Actions Recorded</h3>
                <p className="text-muted-foreground max-w-sm mt-2">
                  Track the interventions you make in response to student learning patterns here.
                </p>
              </CardContent>
            </Card>
          ) : (
            actions?.map((action) => (
              <Card key={action.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-muted p-6 flex flex-col justify-center items-center md:w-32 border-b md:border-b-0 md:border-r">
                    <Calendar className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="font-semibold text-lg">Week {action.week}</span>
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {action.topic}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Recorded {new Date(action.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                      {action.actionTaken}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </FacultyLayout>
  );
}
