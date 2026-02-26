import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { useSelectedPatient } from '@/hooks/useSelectedPatient';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, FileText, Upload, Download, File, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function CaregiverDocuments() {
  const { state } = useApp();
  const selectedPatient = useSelectedPatient();
  const documents = selectedPatient?.documents || state.documents;
  const patient = selectedPatient?.patient || state.patient;
  const [showAddDialog, setShowAddDialog] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      medical: 'bg-calm-blue/20 text-blue-600',
      legal: 'bg-warm-bronze/20 text-warm-bronze',
      insurance: 'bg-soft-sage/20 text-green-600',
      care_plan: 'bg-gentle-coral/20 text-gentle-coral',
      other: 'bg-gray-200 text-gray-600',
    };
    return colors[category] || colors.other;
  };

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-soft-taupe/30 rounded-full flex items-center justify-center mb-4">
          <User className="w-10 h-10 text-medium-gray" />
        </div>
        <h2 className="text-xl font-semibold text-charcoal mb-2">No Patient Selected</h2>
        <p className="text-medium-gray text-center max-w-md">
          Please select a patient from the dropdown above to view their documents.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-charcoal mb-1">Documents</h2>
          <p className="text-medium-gray">Store and manage important documents for {patient.firstName}</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </motion.div>

      {/* Document Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {['All', 'Medical', 'Legal', 'Insurance', 'Care Plan'].map((cat) => (
          <Button
            key={cat}
            variant={cat === 'All' ? 'default' : 'outline'}
            size="sm"
            className={cat === 'All' ? 'bg-warm-bronze' : 'border-soft-taupe'}
          >
            {cat}
          </Button>
        ))}
      </motion.div>

      {/* Document List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid gap-4"
      >
        {documents.length === 0 ? (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-soft-taupe rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-10 h-10 text-medium-gray" />
              </div>
              <p className="text-charcoal font-medium mb-2">No documents yet</p>
              <p className="text-sm text-medium-gray">Upload important documents to keep them organized</p>
            </CardContent>
          </Card>
        ) : (
          documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="border-0 shadow-soft hover:shadow-card transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-warm-bronze/20 rounded-xl flex items-center justify-center">
                      <File className="w-6 h-6 text-warm-bronze" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-charcoal">{doc.title}</p>
                        <Badge className={getCategoryColor(doc.category)}>
                          {doc.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-medium-gray">
                        Uploaded {new Date(doc.createdAt).toLocaleDateString()} • {(doc.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="w-5 h-5 text-medium-gray" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Upload Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-charcoal">Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-soft-taupe rounded-xl p-8 text-center">
              <Upload className="w-10 h-10 text-medium-gray mx-auto mb-3" />
              <p className="text-medium-gray">Drag and drop or click to browse</p>
            </div>
            <div>
              <Label>Document Name</Label>
              <Input placeholder="e.g., Medical Records" className="rounded-xl" />
            </div>
            <div>
              <Label>Category</Label>
              <select className="w-full px-4 py-2 rounded-xl border border-soft-taupe">
                <option>Medical</option>
                <option>Legal</option>
                <option>Insurance</option>
                <option>Care Plan</option>
                <option>Other</option>
              </select>
            </div>
            <Button
              onClick={() => {
                setShowAddDialog(false);
                toast.success('Document uploaded');
              }}
              className="w-full bg-warm-bronze hover:bg-deep-bronze text-white rounded-xl"
            >
              Upload Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
