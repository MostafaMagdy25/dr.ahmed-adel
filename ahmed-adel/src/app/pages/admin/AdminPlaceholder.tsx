export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 lg:p-12 text-center">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">{title} Management</h2>
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        This section is ready to be connected to your backend database. Once connected, 
        you'll be able to create, read, update, and delete {title.toLowerCase()} directly from this panel.
      </p>
    </div>
  );
}
