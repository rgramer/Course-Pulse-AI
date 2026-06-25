import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowLeft, Send, Info, AlertCircle } from "lucide-react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  const selectedWeek = form.watch("week");
  const selectedTopic = form.watch("topic");

  const availableWeeks = Array.from(
    new Set((courseContexts || []).map((c) => c.week))
  ).sort((a, b) => a - b);

  const uniqueTopics = Array.from(
    new Set(
      (courseContexts || [])
        .filter((c) => !selectedWeek || c.week === parseInt(selectedWeek, 10))
        .map((c) => c.topic)
    )
  );

  const availableObjectives = (courseContexts || [])
    .filter((c) => c.topic === selectedTopic && (!selectedWeek || c.week === parseInt(selectedWeek, 10)))
    .map((c) => c.learningObjective);

  const noTopicsReady = !loadingContexts && availableWeeks.length === 0;

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
        onSuccess: (result) => {
          if (result?.signal) {
            sessionStorage.setItem("cp_last_signal", JSON.stringify(result.signal));
          }
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

        {noTopicsReady && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Your instructor hasn't set up the course topics yet — the topic and learning objective dropdowns will be empty. Ask them to add course context before you submit.
            </AlertDescription>
          </Alert>
        )}

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
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("topic", "");
                          form.setValue("learningObjective", "");
                        }}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select week" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableWeeks.map((week) => (
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
                            <SelectValue placeholder={noTopicsReady ? "No topics set up yet" : "Select topic"} />
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
                    <FormLabel className="text-base block mb-4">How confident do you feel about this week's material?</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-5 gap-2">
                        {[
                          { value: 1, label: "Very uncertain" },
                          { value: 2, label: "Somewhat uncertain" },
                          { value: 3, label: "Neutral" },
                          { value: 4, label: "Fairly confident" },
                          { value: 5, label: "Very confident" },
                        ].map(({ value, label }) => {
                          const selected = field.value === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => field.onChange(value)}
                              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                selected
                                  ? "border-primary bg-primary text-primary-foreground shadow-md scale-105"
                                  : "border-border bg-background hover:border-primary/40 hover:bg-primary/5 text-muted-foreground"
                              }`}
                            >
                              <span className={`text-xl font-bold ${selected ? "text-primary-foreground" : "text-foreground"}`}>{value}</span>
                              <span className={`text-[11px] leading-tight text-center font-medium ${selected ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </FormControl>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-3">
                      <Info className="w-4 h-4 shrink-0" />
                      <span>This does not affect your grade.</span>
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
                        className="scale-125 ml-4 shrink-0"
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
                        className="mt-1 w-6 h-6 border-primary/50 data-[state=checked]:bg-primary shrink-0"
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

              <Button type="submit" size="lg" className="w-full text-lg h-14" disabled={submitMutation.isPending || noTopicsReady} data-testid="submit-btn">
                {submitMutation.isPending ? "Submitting..." : noTopicsReady ? "Topics not set up yet" : "Submit Reflection"}
                {!submitMutation.isPending && !noTopicsReady && <Send className="ml-2 w-5 h-5" />}
              </Button>

            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
