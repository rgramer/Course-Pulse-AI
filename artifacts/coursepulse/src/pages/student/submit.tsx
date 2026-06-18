import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Send } from "lucide-react";
import { Link } from "wouter";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListCourseContexts, useSubmitReflection } from "@workspace/api-client-react";

const formSchema = z.object({
  week: z.string().min(1, "Week is required"),
  topic: z.string().min(1, "Topic is required"),
  learningObjective: z.string().min(1, "Learning objective is required"),
  confidenceScore: z.coerce.number().min(1).max(5),
  reflectionText: z.string().min(10, "Please provide a more detailed reflection"),
  supportRequested: z.boolean().default(false),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "You must consent to submit your reflection.",
  }),
});

export default function StudentSubmitPage() {
  const [, setLocation] = useLocation();
  const { data: courseContexts, isLoading: loadingContexts } = useListCourseContexts();
  const submitMutation = useSubmitReflection();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      week: "",
      topic: "",
      learningObjective: "",
      confidenceScore: 3,
      reflectionText: "",
      supportRequested: false,
      consentGiven: false,
    },
  });

  const selectedTopic = form.watch("topic");

  const uniqueTopics = Array.from(new Set((courseContexts || []).map((c) => c.topic)));
  const availableObjectives = (courseContexts || [])
    .filter((c) => c.topic === selectedTopic)
    .map((c) => c.learningObjective);

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitMutation.mutate(
      {
        data: {
          week: parseInt(values.week, 10),
          topic: values.topic,
          learningObjective: values.learningObjective,
          confidenceScore: values.confidenceScore,
          reflectionText: values.reflectionText,
          supportRequested: values.supportRequested,
          consentGiven: values.consentGiven,
        },
      },
      {
        onSuccess: () => {
          setLocation("/student/thank-you");
        },
      }
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-8 pb-12">
        <Link href="/student" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-primary">Weekly Reflection</h1>
          <p className="text-muted-foreground mt-2">
            Your reflection helps adjust the course for everyone.
          </p>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Week</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select week" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 1).map((week) => (
                            <SelectItem key={week} value={week.toString()}>
                              Week {week}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic</FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("learningObjective", "");
                        }} 
                        defaultValue={field.value}
                        disabled={loadingContexts || uniqueTopics.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uniqueTopics.map((topic) => (
                            <SelectItem key={topic} value={topic}>
                              {topic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="learningObjective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Learning Objective</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedTopic || availableObjectives.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specific objective" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableObjectives.map((obj, i) => (
                          <SelectItem key={`${i}-${obj}`} value={obj}>
                            {obj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confidenceScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confidence Score (1-5)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">Confused</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          className="w-full accent-primary"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                        <span className="text-sm text-muted-foreground">Confident</span>
                      </div>
                    </FormControl>
                    <FormDescription className="text-center font-medium text-foreground">
                      Current rating: {field.value}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reflectionText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reflection</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What was most confusing? What part was clear? How are you connecting this to previous topics?" 
                        className="min-h-[150px] resize-y"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supportRequested"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Request Additional Resources
                      </FormLabel>
                      <FormDescription>
                        Flag that the class might need more reading or practice on this topic.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t">
                <FormField
                  control={form.control}
                  name="consentGiven"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I consent to submit this reflection for course improvement.
                        </FormLabel>
                        <FormDescription>
                          This submission will be aggregated anonymously. It is not used for grading or individual evaluation.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? "Submitting..." : "Submit Reflection"}
                {!submitMutation.isPending && <Send className="ml-2 w-4 h-4" />}
              </Button>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
