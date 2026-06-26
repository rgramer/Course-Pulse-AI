import { useState } from "react";
import { Link, useLocation } from "wouter";
import { FacultyLayout } from "@/components/faculty-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, Trash2, Plus, ShieldCheck, RefreshCw, ArrowRight } from "lucide-react";

interface ParsedRow {
  week: number;
  topic: string;
  learningObjective: string;
  reading: string;
  assignment: string;
}

export default function FacultySyllabusUploadPage() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<'upload' | 'review' | 'imported'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!file) return;
    setIsExtracting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/faculty/syllabus/extract', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Extraction failed');
      setRows(data.rows);
      setPhase('review');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    try {
      const res = await fetch('/api/faculty/syllabus/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      setImportedCount(data.imported);
      setPhase('imported');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsImporting(false);
    }
  };

  const updateRow = (i: number, field: keyof ParsedRow, value: string | number) => {
    setRows(rows.map((r, idx) => idx === i ? { ...r, [field]: value } : r));
  };
  
  const deleteRow = (i: number) => setRows(rows.filter((_, idx) => idx !== i));
  
  const addRow = () => setRows([...rows, { week: 0, topic: '', learningObjective: '', reading: '', assignment: '' }]);
  
  const resetToUpload = () => { 
    setPhase('upload'); 
    setFile(null); 
    setRows([]); 
    setError(null); 
  };

  return (
    <FacultyLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {phase === 'upload' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Syllabus Upload</h1>
              <p className="text-muted-foreground mt-2">
                Upload your .docx syllabus to generate a draft course context. You'll review and edit before anything is saved.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardContent className="p-6 sm:p-8 space-y-8">
                <div className="bg-muted/50 rounded-lg p-4 flex gap-3 text-sm text-muted-foreground border">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-primary" />
                  <p>Uploaded syllabus content is used only to help create course context. Faculty must review and approve extracted items before import.</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">How this works</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-1">
                    <li>Upload your <span className="font-medium">.docx</span> or <span className="font-medium">.txt</span> syllabus</li>
                    <li>Review the extracted course context rows (edit, delete, add)</li>
                    <li>Click <span className="font-medium">"Import to Course Context"</span> to save approved rows</li>
                  </ol>
                </div>

                <div className="pt-4 space-y-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <label className="cursor-pointer flex flex-col items-center space-y-2 text-center">
                      <span className="text-sm font-medium hover:underline text-primary">Choose a file to upload</span>
                      <span className="text-xs text-muted-foreground">Supported formats: .docx, .txt</span>
                      <input 
                        type="file" 
                        accept=".docx,.txt" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                            setError(null);
                          }
                        }} 
                      />
                    </label>
                  </div>
                  
                  {file && (
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                      <Badge variant="secondary">{Math.round(file.size / 1024)} KB</Badge>
                    </div>
                  )}

                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={handleExtract} 
                      disabled={!file || isExtracting}
                      className="gap-2"
                    >
                      {isExtracting ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Extracting...</>
                      ) : (
                        <><FileText className="w-4 h-4" /> Extract Course Context</>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {phase === 'review' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Review Extracted Course Context</h1>
                <p className="text-muted-foreground mt-2">
                  {rows.length} rows extracted — edit before importing.
                </p>
              </div>
              <Button variant="ghost" onClick={resetToUpload}>Start Over</Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                    <tr>
                      <th className="px-4 py-3 font-medium w-16">Week</th>
                      <th className="px-4 py-3 font-medium w-48">Topic</th>
                      <th className="px-4 py-3 font-medium w-64">Learning Objective</th>
                      <th className="px-4 py-3 font-medium w-48">Reading</th>
                      <th className="px-4 py-3 font-medium w-48">Assignment</th>
                      <th className="px-4 py-3 font-medium w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {rows.map((row, i) => (
                      <tr key={i} className="bg-card hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-2">
                          <input 
                            type="number"
                            className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-1"
                            value={row.week} 
                            onChange={e => updateRow(i, 'week', parseInt(e.target.value) || 0)} 
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-1"
                            value={row.topic} 
                            onChange={e => updateRow(i, 'topic', e.target.value)} 
                            placeholder="Topic..."
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-1"
                            value={row.learningObjective} 
                            onChange={e => updateRow(i, 'learningObjective', e.target.value)} 
                            placeholder="Objective..."
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-1"
                            value={row.reading} 
                            onChange={e => updateRow(i, 'reading', e.target.value)} 
                            placeholder="Reading..."
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input 
                            className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none py-1"
                            value={row.assignment} 
                            onChange={e => updateRow(i, 'assignment', e.target.value)} 
                            placeholder="Assignment..."
                          />
                        </td>
                        <td className="px-4 py-2 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteRow(i)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    No rows extracted or all rows deleted.
                  </div>
                )}
              </div>
              <div className="p-4 border-t bg-muted/10">
                <Button variant="outline" size="sm" onClick={addRow} className="gap-1">
                  <Plus className="w-4 h-4" /> Add Row
                </Button>
              </div>
            </Card>

            <div className="flex flex-col items-end gap-2 pt-4">
              <Button 
                size="lg" 
                onClick={handleImport} 
                disabled={isImporting || rows.length === 0}
                className="gap-2"
              >
                {isImporting ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Importing...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Import to Course Context</>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">Only rows with a week number and topic will be imported.</p>
              <p className="text-[10px] text-muted-foreground mt-2 max-w-sm text-right">
                CoursePulse uses syllabus content only to map student reflections to course topics and learning objectives.
              </p>
            </div>
          </div>
        )}

        {phase === 'imported' && (
          <Card className="max-w-md mx-auto mt-12 border-primary/20 bg-primary/5">
            <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
              <div className="p-4 bg-primary/10 rounded-full text-primary">
                <CheckCircle className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Import Successful</h2>
                <p className="text-muted-foreground">
                  {importedCount} course context rows imported successfully.
                </p>
                <p className="text-muted-foreground text-sm">
                  Your course context has been updated.
                </p>
              </div>
              <div className="flex flex-col w-full gap-3 pt-4">
                <Button onClick={() => setLocation('/faculty/course-context')} className="w-full">
                  View Course Context <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" onClick={resetToUpload} className="w-full">
                  Upload Another Syllabus
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
      </div>
    </FacultyLayout>
  );
}