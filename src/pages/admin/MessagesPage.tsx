import { useState, useEffect } from "react";
import { Mail, MailOpen, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load messages");
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (msg: Message) => {
    const { error } = await supabase
      .from("messages")
      .update({ is_read: !msg.is_read })
      .eq("id", msg.id);
    if (error) {
      toast.error("Failed to update");
    } else {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete message");
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
      toast.success("Message deleted");
    }
  };

  const markAsRead = async (msg: Message) => {
    if (msg.is_read) return;
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("id", msg.id);
    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
    }
  };

  const selected = messages.find((m) => m.id === selectedId);
  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : messages.length === 0 ? (
        <div className="border border-border bg-card p-12 text-center">
          <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No messages yet. They'll appear here when someone uses the contact form.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-6">
          {/* Message List */}
          <div className="border border-border bg-card divide-y divide-border max-h-[600px] overflow-y-auto">
            {messages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => {
                  setSelectedId(msg.id);
                  markAsRead(msg);
                }}
                className={`w-full text-left px-5 py-4 transition-colors ${
                  selectedId === msg.id
                    ? "bg-accent/10"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                      )}
                      <p className={`text-sm truncate ${msg.is_read ? "text-muted-foreground" : "text-foreground font-semibold"}`}>
                        {msg.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {msg.subject || msg.message.slice(0, 60)}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Message Detail */}
          {selected ? (
            <div className="border border-border bg-card p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selected.name}</h3>
                  <p className="text-sm text-muted-foreground">{selected.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRead(selected)}
                    className="p-2 border border-border text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                    title={selected.is_read ? "Mark as unread" : "Mark as read"}
                  >
                    {selected.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="p-2 border border-border text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {selected.subject && (
                <p className="text-sm font-medium text-foreground mb-3">
                  Subject: {selected.subject}
                </p>
              )}
              <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </p>
            </div>
          ) : (
            <div className="border border-border bg-card p-12 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Select a message to view</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
