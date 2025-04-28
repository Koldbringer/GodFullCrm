import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface AddEventFormProps {
  onSubmit?: (data: EventFormData) => void;
}

interface EventFormData {
  type: string;
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  client: string;
  technician: string;
  location: string;
  device: string;
  status: string;
  notes?: string;
}

const eventTypes = [
  { value: "service", label: "Serwis" },
  { value: "installation", label: "Montaż" },
  { value: "inspection", label: "Oględziny" },
];

const statusOptions = [
  { value: "planned", label: "Zaplanowane" },
  { value: "in-progress", label: "W trakcie" },
  { value: "completed", label: "Zakończone" },
  { value: "cancelled", label: "Anulowane" },
];

const technicians = [
  { value: "tech1", label: "Jan Kowalski" },
  { value: "tech2", label: "Anna Nowak" },
  { value: "tech3", label: "Piotr Wiśniewski" },
];

function AddEventForm({ onSubmit }: AddEventFormProps) {
  const [formData, setFormData] = React.useState<EventFormData>({
    type: "",
    title: "",
    startDate: undefined,
    endDate: undefined,
    client: "",
    technician: "",
    location: "",
    device: "",
    status: "planned",
    notes: "",
  });

  const handleChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="type">Typ zdarzenia</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz typ zdarzenia" />
            </SelectTrigger>
            <SelectContent>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Tytuł</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Wprowadź tytuł zdarzenia"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Data rozpoczęcia</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP", { locale: pl })
                ) : (
                  <span>Wybierz datę</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.startDate}
                onSelect={(date) => handleChange("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-2">
          <Label>Data zakończenia</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP", { locale: pl })
                ) : (
                  <span>Wybierz datę</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.endDate}
                onSelect={(date) => handleChange("endDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="client">Klient</Label>
          <Input
            id="client"
            value={formData.client}
            onChange={(e) => handleChange("client", e.target.value)}
            placeholder="Nazwa klienta"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="technician">Technik</Label>
          <Select
            value={formData.technician}
            onValueChange={(value) => handleChange("technician", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Wybierz technika" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((tech) => (
                <SelectItem key={tech.value} value={tech.value}>
                  {tech.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="location">Lokalizacja</Label>
        <div className="flex items-center space-x-2">
          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="Adres"
            className="flex-1"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="device">Urządzenie</Label>
        <Input
          id="device"
          value={formData.device}
          onChange={(e) => handleChange("device", e.target.value)}
          placeholder="Model i numer seryjny urządzenia"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Uwagi</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Dodatkowe informacje"
          className="min-h-[80px]"
        />
      </div>
    </form>
  );
}

function AddEventDialog() {
  const handleSubmit = (data: EventFormData) => {
    console.log("Submitted event data:", data);
    // Here you would typically send the data to your API
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Dodaj zdarzenie</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowe zdarzenie</DialogTitle>
          <DialogDescription>
            Wypełnij formularz, aby dodać nowe zdarzenie do kalendarza.
          </DialogDescription>
        </DialogHeader>
        <AddEventForm onSubmit={handleSubmit} />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Anuluj
            </Button>
          </DialogClose>
          <Button type="submit" form="event-form">
            Dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddEventDialog;
