import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Plus, Edit, Upload, Image as ImageIcon, File as FileIcon, Loader2 } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useUserRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Payal Education Society Computers" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate({ to: "/auth", search: { next: "/admin" } });
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || roleLoading) {
    return (<><Header /><main className="mx-auto max-w-6xl px-6 pt-40 pb-32 min-h-screen"><p className="text-sm text-muted-foreground">Checking permissions…</p></main></>);
  }
  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-md px-6 pt-40 pb-32 min-h-screen text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Restricted</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tighter">Admins only</h1>
          <Link to="/dashboard" className="mt-6 inline-flex text-sm underline">Back to dashboard</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-6 pt-32 pb-24 min-h-screen">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Admin</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tighter">Console</h1>

        <Tabs defaultValue="resources" className="mt-10">
          <TabsList className="rounded-full">
            <TabsTrigger value="resources" className="rounded-full">Resources</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-full">Categories</TabsTrigger>
            <TabsTrigger value="blog" className="rounded-full">Blog</TabsTrigger>
            <TabsTrigger value="purchases" className="rounded-full">Purchases</TabsTrigger>
            <TabsTrigger value="contact" className="rounded-full">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="mt-6"><ResourcesAdmin /></TabsContent>
          <TabsContent value="categories" className="mt-6"><CategoriesAdmin /></TabsContent>
          <TabsContent value="blog" className="mt-6"><BlogAdmin /></TabsContent>
          <TabsContent value="purchases" className="mt-6"><PurchasesAdmin /></TabsContent>
          <TabsContent value="contact" className="mt-6"><ContactAdmin /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </>
  );
}

/* ---------------- Resources ---------------- */
function ResourcesAdmin() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: async () => (await supabase.from("resources").select("*, categories(name)").order("created_at", { ascending: false })).data ?? [],
  });
  const { data: categories } = useQuery({
    queryKey: ["admin-cats"],
    queryFn: async () => (await supabase.from("categories").select("id, name").order("sort_order")).data ?? [],
  });

  async function remove(id: string) {
    if (!confirm("Delete this resource?")) return;
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-resources"] });
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Resources ({rows?.length ?? 0})</h2>
        <ResourceDialog categories={categories ?? []} onDone={() => qc.invalidateQueries({ queryKey: ["admin-resources"] })} />
      </div>
      <div className="mt-4 rounded-2xl border border-border overflow-hidden">
        {rows?.map((r) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
            <div>
              <div className="text-sm font-medium">{r.title}</div>
              <div className="text-xs text-muted-foreground font-mono">
                {r.is_published ? "Published" : "Draft"} · ₹{r.price_inr} · {(r.categories as { name?: string } | null)?.name ?? "—"}
              </div>
            </div>
            <div className="flex gap-2">
              <ResourceDialog categories={categories ?? []} row={r} onDone={() => qc.invalidateQueries({ queryKey: ["admin-resources"] })} />
              <Button variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        {rows?.length === 0 && <p className="p-6 text-sm text-muted-foreground">No resources yet.</p>}
      </div>
    </div>
  );
}

function ResourceDialog({ row, categories, onDone }: { row?: Record<string, unknown>; categories: { id: string; name: string }[]; onDone: () => void }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [f, setF] = useState({
    title: (row?.title as string) ?? "",
    slug: (row?.slug as string) ?? "",
    description: (row?.description as string) ?? "",
    long_description: (row?.long_description as string) ?? "",
    price_inr: (row?.price_inr as number) ?? 0,
    is_free: (row?.is_free as boolean) ?? false,
    is_published: (row?.is_published as boolean) ?? true,
    is_featured: (row?.is_featured as boolean) ?? false,
    category_id: (row?.category_id as string) ?? "",
    thumbnail_url: (row?.thumbnail_url as string) ?? "",
    external_url: (row?.external_url as string) ?? "",
    file_path: (row?.file_path as string) ?? "",
    file_name: (row?.file_name as string) ?? "",
  });

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  // Uploads the actual resource file (PDF, zip, etc.) into the private
  // "resource-files" bucket. Only admins can write there per RLS, and
  // downloads are only ever served back out through a signed URL from the
  // getResourceDownloadUrl server function — the file itself is never
  // publicly linkable.
  async function handleFileUpload(file: File) {
    setUploadingFile(true);
    const path = `${row?.id ?? (slugify(f.title) || "resource")}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("resource-files").upload(path, file, {
      upsert: true,
    });
    setUploadingFile(false);
    if (error) return toast.error(`Upload failed: ${error.message}`);
    setF((prev) => ({ ...prev, file_path: path, file_name: file.name }));
    toast.success("File uploaded");
  }

  // Uploads a cover image into the public "resource-thumbnails" bucket and
  // stores its public URL.
  async function handleThumbUpload(file: File) {
    setUploadingThumb(true);
    const path = `${row?.id ?? (slugify(f.title) || "resource")}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("resource-thumbnails").upload(path, file, {
      upsert: true,
    });
    if (error) {
      setUploadingThumb(false);
      return toast.error(`Upload failed: ${error.message}`);
    }
    const { data } = supabase.storage.from("resource-thumbnails").getPublicUrl(path);
    setUploadingThumb(false);
    setF((prev) => ({ ...prev, thumbnail_url: data.publicUrl }));
    toast.success("Thumbnail uploaded");
  }

  async function save() {
    setBusy(true);
    const { file_name: _fileName, ...rest } = f;
    const payload = {
      ...rest,
      slug: f.slug || slugify(f.title),
      category_id: f.category_id || null,
      thumbnail_url: f.thumbnail_url || null,
      external_url: f.external_url || null,
      file_path: f.file_path || null,
    };
    const q = row?.id
      ? supabase.from("resources").update(payload).eq("id", row.id as string)
      : supabase.from("resources").insert(payload);
    const { error } = await q;
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false);
    onDone();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {row ? <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button> : <Button size="sm" className="rounded-full"><Plus className="h-4 w-4 mr-1" />New</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{row ? "Edit resource" : "New resource"}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
          <div><Label>Slug</Label><Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="auto from title" /></div>
          <div>
            <Label>Category</Label>
            <select value={f.category_id} onChange={(e) => setF({ ...f, category_id: e.target.value })} className="w-full h-10 mt-1.5 rounded-md border border-input bg-background px-3 text-sm">
              <option value="">— none —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div><Label>Short description</Label><Textarea value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></div>
          <div><Label>Long description</Label><Textarea rows={5} value={f.long_description} onChange={(e) => setF({ ...f, long_description: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Price (INR)</Label><Input type="number" value={f.price_inr} onChange={(e) => setF({ ...f, price_inr: Number(e.target.value) })} /></div>
            <div className="flex items-end gap-4 pb-2">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_free} onChange={(e) => setF({ ...f, is_free: e.target.checked })} /> Free</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_published} onChange={(e) => setF({ ...f, is_published: e.target.checked })} /> Published</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_featured} onChange={(e) => setF({ ...f, is_featured: e.target.checked })} /> Featured</label>
            </div>
          </div>

          <div>
            <Label>Thumbnail image</Label>
            <div className="mt-2">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploadingThumb ? 'bg-muted/50 border-muted' : 'border-border bg-background hover:bg-muted/50'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {uploadingThumb ? (
                    <Loader2 className="w-8 h-8 mb-3 text-muted-foreground animate-spin" />
                  ) : f.thumbnail_url ? (
                    <img src={f.thumbnail_url} alt="" className="h-16 w-24 rounded object-cover mb-2 border border-border shadow-sm" />
                  ) : (
                    <ImageIcon className="w-8 h-8 mb-3 text-muted-foreground opacity-50" />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {uploadingThumb ? "Uploading..." : f.thumbnail_url ? "Click to change thumbnail" : <><span className="font-semibold">Click to upload</span> thumbnail</>}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingThumb}
                  onChange={(e) => e.target.files?.[0] && handleThumbUpload(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div><Label>External URL (optional — e.g. a YouTube link instead of a file)</Label><Input value={f.external_url} onChange={(e) => setF({ ...f, external_url: e.target.value })} /></div>

          <div>
            <Label>Resource file (PDF, ZIP, etc. — stored privately)</Label>
            <div className="mt-2">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploadingFile ? 'bg-muted/50 border-muted' : 'border-border bg-background hover:bg-muted/50'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  {uploadingFile ? (
                    <Loader2 className="w-8 h-8 mb-3 text-muted-foreground animate-spin" />
                  ) : f.file_path ? (
                    <FileIcon className="w-8 h-8 mb-3 text-primary" />
                  ) : (
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground opacity-50" />
                  )}
                  
                  {uploadingFile ? (
                    <p className="text-sm text-muted-foreground">Uploading file...</p>
                  ) : f.file_path ? (
                    <>
                      <p className="text-sm font-medium text-foreground truncate max-w-full">{f.file_name || "Resource file attached"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Click to replace file</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  disabled={uploadingFile}
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </div>
        <DialogFooter><Button onClick={save} disabled={busy || uploadingFile || uploadingThumb}>{busy ? "Saving…" : "Save"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Categories ---------------- */
function CategoriesAdmin() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => (await supabase.from("categories").select("*").order("sort_order")).data ?? [],
  });
  const [name, setName] = useState("");

  async function add() {
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("categories").insert({ name, slug });
    if (error) return toast.error(error.message);
    setName("");
    toast.success("Added");
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-categories"] });
  }

  return (
    <div>
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" />
        <Button onClick={add} className="rounded-full"><Plus className="h-4 w-4 mr-1" />Add</Button>
      </div>
      <div className="mt-4 rounded-2xl border border-border overflow-hidden">
        {rows?.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
            <div><div className="text-sm font-medium">{c.name}</div><div className="text-xs text-muted-foreground font-mono">/{c.slug}</div></div>
            <Button variant="ghost" size="icon" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Blog ---------------- */
function BlogAdmin() {
  const qc = useQueryClient();
  const { data: rows } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => (await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", slug: "", excerpt: "", content: "", cover_url: "", is_published: true });

  async function save() {
    const payload = {
      ...f,
      slug: f.slug || f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      cover_url: f.cover_url || null,
      published_at: f.is_published ? new Date().toISOString() : null,
    };
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("blog_posts").insert({ ...payload, author_id: u.user?.id ?? null });
    if (error) return toast.error(error.message);
    toast.success("Post created");
    setOpen(false);
    setF({ title: "", slug: "", excerpt: "", content: "", cover_url: "", is_published: true });
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  }

  async function remove(id: string) {
    if (!confirm("Delete post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-blog"] });
  }

  return (
    <div>
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full"><Plus className="h-4 w-4 mr-1" />New post</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New blog post</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></div>
              <div><Label>Slug</Label><Input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} /></div>
              <div><Label>Cover URL</Label><Input value={f.cover_url} onChange={(e) => setF({ ...f, cover_url: e.target.value })} /></div>
              <div><Label>Excerpt</Label><Textarea value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} /></div>
              <div><Label>Content</Label><Textarea rows={10} value={f.content} onChange={(e) => setF({ ...f, content: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.is_published} onChange={(e) => setF({ ...f, is_published: e.target.checked })} /> Publish now</label>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 rounded-2xl border border-border overflow-hidden">
        {rows?.map((p) => (
          <div key={p.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
            <div><div className="text-sm font-medium">{p.title}</div><div className="text-xs text-muted-foreground font-mono">/{p.slug} · {p.is_published ? "Published" : "Draft"}</div></div>
            <Button variant="ghost" size="icon" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        {rows?.length === 0 && <p className="p-6 text-sm text-muted-foreground">No posts.</p>}
      </div>
    </div>
  );
}

/* ---------------- Purchases ---------------- */
function PurchasesAdmin() {
  const { data } = useQuery({
    queryKey: ["admin-purchases"],
    queryFn: async () => (await supabase.from("purchases").select("*, resources(title), profiles!purchases_user_id_fkey(full_name)").order("created_at", { ascending: false })).data ?? [],
  });
  return (
    <div className="rounded-2xl border border-border overflow-hidden">
      {data?.map((p) => (
        <div key={p.id} className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0">
          <div>
            <div className="text-sm font-medium">{(p.resources as { title?: string } | null)?.title ?? "—"}</div>
            <div className="text-xs text-muted-foreground font-mono">{p.status} · ₹{p.amount_inr} · {new Date(p.created_at).toLocaleDateString()}</div>
          </div>
        </div>
      ))}
      {(!data || data.length === 0) && <p className="p-6 text-sm text-muted-foreground">No purchases yet.</p>}
    </div>
  );
}

/* ---------------- Contact ---------------- */
function ContactAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-contact"],
    queryFn: async () => (await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  async function markRead(id: string) {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-contact"] });
  }
  return (
    <div className="space-y-3">
      {data?.map((m) => (
        <div key={m.id} className={`rounded-2xl border border-border p-4 ${m.is_read ? "opacity-60" : ""}`}>
          <div className="flex justify-between">
            <div><div className="text-sm font-medium">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}{m.phone ? ` · ${m.phone}` : ""}</div></div>
            {!m.is_read && <Button size="sm" variant="ghost" onClick={() => markRead(m.id)}>Mark read</Button>}
          </div>
          {m.subject && <div className="mt-2 text-sm font-medium">{m.subject}</div>}
          <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line">{m.message}</p>
        </div>
      ))}
      {(!data || data.length === 0) && <p className="text-sm text-muted-foreground">No messages.</p>}
    </div>
  );
}
