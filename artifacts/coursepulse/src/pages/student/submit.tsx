import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Send, Info } from "lucide-react";
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
      <div className="max-w-3xl mx-auto space-y-8 pb-12 pt-8">
        <Link href="/student" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Link>

        <div>
          <h1 className="text-4xl font-bold font-serif text-primary">Weekly Reflection</h1>
          <p className="text-lg text-muted-foreground mt-3">
            Your reflection helps adjust the course for everyone.
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="week"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Week</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
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
                      <FormLabel className="text-base">Topic</FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("learningObjective", "");
                        }} 
                        defaultValue={field.value}
                        disabled={loadingContexts || uniqueTopics.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
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
                    <FormLabel className="text-base">Learning Objective</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedTopic || availableObjectives.length === 0}>
                      <FormControl>
                        <SelectTrigger className="h-12">
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
                  <FormItem className="bg-muted/30 p-6 rounded-xl border border-muted">
                    <FormLabel className="text-base block mb-6">Confidence Score (1-5)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-muted-foreground w-20 text-right">Confused</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          className="flex-1 accent-primary h-2 bg-secondary/20 rounded-lg appearance-none cursor-pointer"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                        <span className="text-sm font-medium text-muted-foreground w-20 text-left">Confident</span>
                      </div>
                    </FormControl>
                    <div className="flex flex-col items-center mt-6 space-y-2">
                      <div className="text-2xl font-bold text-primary bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                        {field.value}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                        <Info className="w-4 h-4" />
                        <span>1 = very uncertain, 5 = very confident. This does not affect your grade.</span>
                      </div>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reflectionText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Reflection</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g. I understand the concept of diffusion of innovation but I'm struggling to connect it to the AI governance readings. I'd benefit from a worked example..." 
                        className="min-h-[180px] resize-y text-base p-4"
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
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-6 bg-card shadow-sm">
                    <div className="space-y-1">
                      <FormLabel className="text-base font-semibold">
                        Request Additional Resources
                      </FormLabel>
                      <FormDescription className="text-sm">
                        Flag that the class might need more reading or practice on this topic.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="scale-125 ml-4"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consentGiven"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-4 p-6 bg-primary/5 border border-primary/20 rounded-xl">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-1 w-6 h-6 border-primary/50 data-[state=checked]:bg-primary"
                      />
                    </FormControl>
                    <div className="space-y-2 leading-none">
                      <FormLabel className="text-base font-semibold text-foreground">
                        I consent to submit this reflection for course improvement.
                      </FormLabel>
                      <FormDescription className="text-sm leading-relaxed text-foreground/80">
                        This submission will be aggregated anonymously. It is not used for grading or individual evaluation.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={submitMutation.isPending} data-testid="submit-btn">
                {submitMutation.isPending ? "Submitting..." : "Submit Reflection"}
                {!submitMutation.isPending && <Send className="ml-2 w-5 h-5" />}
              </Button>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
