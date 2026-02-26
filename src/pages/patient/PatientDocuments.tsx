import { useApp } from '@/store/AppContext';
import { Card } from '@/components/ui/card';
import { FileText, Image, File, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PatientDocuments() {
  const { state } = useApp();
  const documents = state.documents;

  const getDocumentIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <Image className="w-8 h-8 text-warm-bronze" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="w-8 h-8 text-gentle-coral" />;
    } else {
      return <File className="w-8 h-8 text-deep-slate" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      medical: 'Medical',
      legal: 'Legal',
      insurance: 'Insurance',
      care_plan: 'Care Plan',
      other: 'Other',
    };
    return labels[category] || 'Other';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const documentsByCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-charcoal mb-2">My Documents</h2>
        <p className="text-medium-gray">Important papers and photos</p>
      </div>

      {/* Document Categories */}
      {Object.entries(documentsByCategory).length === 0 ? (
        <Card className="p-8 text-center border-dashed border-2 border-soft-taupe">
          <FileText className="w-12 h-12 text-soft-taupe mx-auto mb-3" />
          <p className="text-medium-gray mb-2">No documents yet</p>
          <p className="text-sm text-medium-gray">Your caregiver will add important documents here</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(documentsByCategory).map(([category, docs], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-charcoal mb-3">
                {getCategoryLabel(category)}
              </h3>
              <div className="space-y-3">
                {docs.map((doc, docIndex) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIndex * 0.1 + docIndex * 0.05 }}
                  >
                    <Card className="p-4 bg-white border-0 shadow-soft hover:shadow-card transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-warm-ivory rounded-xl flex items-center justify-center flex-shrink-0">
                          {getDocumentIcon(doc.fileType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-charcoal truncate">{doc.title}</h4>
                          {doc.description && (
                            <p className="text-sm text-medium-gray line-clamp-1">{doc.description}</p>
                          )}
                          <p className="text-xs text-medium-gray mt-1">
                            {formatFileSize(doc.fileSize)} • {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-warm-bronze/10 rounded-xl flex items-center justify-center text-warm-bronze hover:bg-warm-bronze hover:text-white transition-colors flex-shrink-0"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <Card className="p-4 bg-soft-sage/20 border-0">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-soft-sage/30 rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-soft-sage" />
          </div>
          <div>
            <h4 className="font-semibold text-charcoal mb-1">Need Help?</h4>
            <p className="text-sm text-medium-gray">
              Ask your caregiver if you need to see a specific document. They can add or remove documents from the caregiver portal.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
