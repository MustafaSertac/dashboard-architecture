"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { useCreateNote } from "@/modules/notes/hooks/useNotes";
import type { NoteCategory } from "@/modules/notes/types/note.types";

interface NoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
}

const noteCategories: { value: NoteCategory; label: string }[] = [
  { value: "feedback", label: "Genel Geri Bildirim" },
  { value: "performance", label: "Performans Notu" },
  { value: "improvement", label: "Gelisim Onerisi" },
  { value: "praise", label: "Takdir / Tesvik" },
];

export function NoteModal({ open, onOpenChange, studentId }: NoteModalProps) {
  const { user } = useAuth();
  const createNote = useCreateNote(studentId, user?.id ?? "");

  const [category, setCategory] = useState<NoteCategory>("feedback");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (!note.trim()) {
      toast.error("Lutfen bir not girin");
      return;
    }

    createNote.mutate(
      { category, note },
      {
        onSuccess: () => {
          toast.success("Not basariyla eklendi");
          setNote("");
          setCategory("feedback");
          onOpenChange(false);
        },
        onError: (err: unknown) => {
          const msg = err instanceof Error ? err.message : "Not eklenemedi";
          toast.error(msg);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ogrenciye Not Ekle</DialogTitle>
          <DialogDescription>
            Ogrenciye geri bildirim veya not ekleyebilirsiniz.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as NoteCategory)}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Kategori sec" />
              </SelectTrigger>
              <SelectContent>
                {noteCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Not</Label>
            <Textarea
              id="note"
              placeholder="Notunuzu buraya yazin..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Iptal
          </Button>
          <Button onClick={handleSubmit} disabled={createNote.isPending}>
            {createNote.isPending ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
