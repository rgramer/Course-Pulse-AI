import { useState } from "wouter";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LockKeyhole, ArrowRight } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mx-auto mb-2">
            <LockKeyhole className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Faculty Access</CardTitle>
          <CardDescription>
            Enter your institutional access code to view the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="accessCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Access Code</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter code..." {...field} />
                    </FormControl>
                    <FormDescription>
                      For this demo, use: <strong className="text-foreground">faculty-demo</strong>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? "Verifying..." : "Access Dashboard"}
                {!verifyMutation.isPending && <ArrowRight className="ml-2 w-4 h-4" />}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
