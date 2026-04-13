import { useState, useEffect } from "react";
import { Search, Mail, MailOpen, Trash2, ChevronLeft, ChevronRight, RefreshCw, X } from "lucide-react";
import { messagesAPI } from "../../services/api";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const isReadParam = selectedStatus === "all" ? undefined : selectedStatus === "read";
      const res = await messagesAPI.getAll(page, 10, search, isReadParam);
      setMessages(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalMessages(res.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and dependency fetch
  useEffect(() => {
    fetchMessages(true);
  }, [page, search, selectedStatus]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(false); // Fetch without showing the visual loading state to avoid jitter
    }, 30000);
    return () => clearInterval(interval);
  }, [page, search, selectedStatus]);

  const handleToggleRead = async (e: React.MouseEvent, msg: Message) => {
    e.stopPropagation();
    try {
      await messagesAPI.markAsRead(msg._id, !msg.isRead);
      setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: !m.isRead } : m));
      // Update selected message if it's currently open
      if (selectedMessage && selectedMessage._id === msg._id) {
        setSelectedMessage({ ...selectedMessage, isRead: !msg.isRead });
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await messagesAPI.delete(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const openMessage = async (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await messagesAPI.markAsRead(msg._id, true);
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
        setSelectedMessage({ ...msg, isRead: true });
      } catch (err) {
         console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            Messages
            {totalMessages > 0 && (
              <span className="text-sm px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-medium">
                {totalMessages}
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage contact form submissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchMessages(true)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-500' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row h-[700px]">
        
        {/* Left Side: Message List */}
        <div className={`flex flex-col border-r border-slate-200 dark:border-slate-800 transition-all ${selectedMessage ? 'hidden md:flex md:w-1/3 lg:w-2/5' : 'w-full'}`}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-4">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'unread', 'read'].map(status => (
                <button
                  key={status}
                  onClick={() => { setSelectedStatus(status); setPage(1); }}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                    selectedStatus === status 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50 dark:bg-slate-950/50 p-2 space-y-1">
            {loading && messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500 animate-pulse">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No messages found.</div>
            ) : (
              messages.map(msg => (
                <div 
                  key={msg._id} 
                  onClick={() => openMessage(msg)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedMessage?._id === msg._id
                      ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-blue-800 shadow-sm'
                      : msg.isRead 
                        ? 'bg-transparent border-transparent hover:bg-white dark:hover:bg-slate-800' 
                        : 'bg-white dark:bg-slate-900 border-transparent shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className={`text-sm truncate ${!msg.isRead ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                      {msg.name}
                    </h4>
                    <span className="text-xs text-slate-500 shrink-0">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-xs truncate mb-2 ${!msg.isRead ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                    {msg.subject}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-slate-500">Page {page} of {totalPages}</span>
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)}
                className="p-1 rounded bg-slate-100 dark:bg-slate-800 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Message Details */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${!selectedMessage ? 'hidden md:flex' : 'flex'}`}>
          {selectedMessage ? (
            <>
              <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <button 
                    className="md:hidden mb-4 flex items-center text-sm text-blue-600 dark:text-blue-400"
                    onClick={() => setSelectedMessage(null)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to inbox
                  </button>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 flex items-center justify-center font-bold">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{selectedMessage.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        <a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-600 transition-colors">{selectedMessage.email}</a>
                        <span className="mx-2">•</span>
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={(e) => handleToggleRead(e, selectedMessage)}
                    title={selectedMessage.isRead ? "Mark as unread" : "Mark as read"}
                    className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    {selectedMessage.isRead ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, selectedMessage._id)}
                    title="Delete message"
                    className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 sm:p-8 flex-1 overflow-y-auto">
                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-sm sm:text-base">
                  {selectedMessage.message}
                </div>
                
                <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <a 
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="inline-flex py-2 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/30 dark:bg-slate-900/30">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No Message Selected</h3>
              <p className="text-slate-500 max-w-sm mt-2">Select a message from the list to read its contents and reply.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
