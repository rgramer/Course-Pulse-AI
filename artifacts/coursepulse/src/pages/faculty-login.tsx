import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ArrowRight } from "lucide-react";
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
import { CoursePulseLogo } from "@/components/logo";
import { useVerifyFacultyAccess } from "@workspace/api-client-react";

const formSchema = z.object({
  accessCode: z.string().min(1, "Access code is required"),
});

export default function FacultyLoginPage() {
  const [, setLocation] = useLocation();
  const verifyMutation = useVerifyFacultyAccess();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accessCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    verifyMutation.mutate({ data: { accessCode: values.accessCode } }, {
      onSuccess: (res) => {
        if (res.success) {
          localStorage.setItem("facultyAuthenticated", "true");
          setLocation("/faculty/dashboard");
        } else {
          form.setError("accessCode", { message: "Invalid access code. Try 'faculty-demo'." });
        }
      },
      onError: () => {
        form.setError("accessCode", { message: "Invalid access code. Try 'faculty-demo'." });
      }
    });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-10">
      <CoursePulseLogo size="md" showTagline />

      <div className="w-full max-w-sm bg-card border shadow-sm rounded-2xl p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-serif text-primary">Faculty Access</h1>
          <p className="text-sm text-muted-foreground">Enter your institutional access code to view the dashboard.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="accessCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Code</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter code..." className="h-11" {...field} />
                  </FormControl>
                  <FormDescription>
                    For this demo, use: <strong className="text-foreground">faculty-demo</strong>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-11" disabled={verifyMutation.isPending}>
              {verifyMutation.isPending ? "Verifying..." : "Access Dashboard"}
              {!verifyMutation.isPending && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>
        </Form>
      </div>

      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to home
      </Link>
    </div>
  );
}
