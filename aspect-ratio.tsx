import { FacultyLayout } from "@/components/faculty-layout";
import { 
  useListFacultyActions, 
  useCreateFacultyAction, 
  getListFacultyActionsQueryKey,
  useListTopics
} from "@workspace/api-client-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Calendar, Target, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";

export default function FacultyImpactTrackerPage() {
  const { data: actions, isLoading } = useListFacultyActions();
  const { data: topics } = useListTopics();
  const createMutation = useCreateFacultyAction();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    week: "",
    topic: "",
    actionTaken: "",
    reason: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      data: {
        week: parseInt(formData.week, 10),
        topic: formData.topic,
        actionTaken: formData.actionTaken,
        reason: formData.reason || undefined
      }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListFacultyActionsQueryKey() });
        setIsOpen(false);
        setFormData({ week: "", topic: "", actionTaken: "", reason: "" });
      }
    });
  };

  const totalActions = actions?.length || 0;

  return (
    <FacultyLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-primary">Impact Tracker</h1>
            <p className="text-muted-foreground mt-1">Record instructional adjustments made based on learning intelligence.</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Record Action
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl">Record Instructional Action</DialogTitle>
                <DialogDescription>
                  Document the changes you made based on course intelligence to track their impact.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                <div className="grid grid-cols-2 gap-4">
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
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Action Taken</label>
                  <Textarea 
                    placeholder="e.g. Added a supplemental reading on recursion and spent 15mins reviewing it in lecture."
                    required 
                    className="min-h-[100px] resize-y"
                    value={formData.actionTaken} 
                    onChange={e => setFormData({...formData, actionTaken: e.target.value})} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Reason for this action (optional)</label>
                  <Textarea 
                    placeholder="e.g. Dashboard showed high confusion severity and multiple support requests for this topic."
                    className="min-h-[80px] resize-y"
                    value={formData.reason} 
                    onChange={e => setFormData({...formData, reason: e.target.value})} 
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

        {/* Impact Score Summary */}
        <Card className="bg-primary/5 border-primary/20 shadow-sm">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Instructional Adjustments This Term</h2>
              <p className="text-muted-foreground">
                You have recorded <strong className="text-primary">{totalActions}</strong> adjustments based on course learning intelligence. Each one appears in the Intelligence Report.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-5">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading actions...</div>
          ) : actions?.length === 0 ? (
            <Card className="border-dashed bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <PenTool className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground">No Actions Recorded</h3>
                <p className="text-muted-foreground max-w-md mt-2">
                  Track the interventions you make in response to student learning patterns. These will appear in the intelligence report.
                </p>
              </CardContent>
            </Card>
          ) : (
            actions?.map((action) => (
              <Card key={action.id} className="overflow-hidden border-border/60 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="bg-muted/50 p-6 flex flex-col justify-center items-center md:w-32 border-b md:border-b-0 md:border-r">
                    <Calendar className="w-6 h-6 text-muted-foreground mb-2" />
                    <span className="font-semibold text-lg">Week {action.week}</span>
                  </div>
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary-foreground">
                        {action.topic}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Recorded {new Date(action.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Action Taken:</p>
                      <p className="text-foreground leading-relaxed">
                        {action.actionTaken}
                      </p>
                    </div>

                    {action.reason && (
                      <div className="bg-muted/30 p-4 rounded-lg border border-muted/50">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Reason:</p>
                        <p className="text-sm text-foreground/80 italic">
                          "{action.reason}"
                        </p>
                      </div>
                    )}
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
