"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  DollarSign,
  Tag,
  Trash2,
  CheckCircle,
  XCircle,
  HelpCircle,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Hourglass,
  Plus,
  RefreshCw,
  Sliders,
  Check,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
  id: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string | null;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PricingOption {
  id: string;
  duration: string;
  price: number;
  label: string;
  description: string | null;
}

interface OperatingHour {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

interface Settings {
  id: string;
  studioName: string;
  hourlyRate: number;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  instagram?: string | null;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string | null;
  category: string | null;
}

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  comment: string;
  rating: number;
}

interface DashboardClientProps {
  bookings: Booking[];
  pricing: PricingOption[];
  settings: Settings;
  operatingHours: OperatingHour[];
  gallery: GalleryImage[];
  testimonials: Testimonial[];
}

export default function DashboardClient({
  bookings: initialBookings,
  pricing: initialPricing,
  settings: initialSettings,
  operatingHours: initialOperatingHours,
  gallery: initialGallery,
  testimonials,
}: DashboardClientProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState("overview");

  // Local Dataset States
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [pricingList, setPricingList] = useState<PricingOption[]>(initialPricing);
  const [operatingHoursList, setOperatingHoursList] = useState<OperatingHour[]>(initialOperatingHours);
  const [galleryList, setGalleryList] = useState<GalleryImage[]>(initialGallery);
  const [settingsData, setSettingsData] = useState<Settings>(initialSettings);

  // Form states
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageTitle, setNewImageTitle] = useState("");
  const [newImageCategory, setNewImageCategory] = useState("Studio");

  // Notifications
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Statistics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedCount = bookings.filter((b) => b.status === "CONFIRMED").length;
  const completedCount = bookings.filter((b) => b.status === "COMPLETED").length;
  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((sum, b) => sum + b.price, 0);

  const triggerNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(null), 3000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const formatDisplayDate = (value: string) => {
    const date = new Date(value);
    return new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatPrice = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

  // 1. UPDATE BOOKING STATUS
  const updateBookingStatus = async (id: string, nextStatus: string) => {
    setLoadingAction(id);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b))
        );
        triggerNotification(`Booking status updated to ${nextStatus}`);
      } else {
        triggerNotification("Failed to update booking status", true);
      }
    } catch (err) {
      triggerNotification("Network error occurred", true);
    } finally {
      setLoadingAction(null);
    }
  };

  // 2. DELETE BOOKING
  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this booking?")) return;
    setLoadingAction(id);

    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        triggerNotification("Booking deleted successfully");
      } else {
        triggerNotification("Failed to delete booking", true);
      }
    } catch (err) {
      triggerNotification("Network error occurred", true);
    } finally {
      setLoadingAction(null);
    }
  };

  // 3. SAVE OPERATING HOURS
  const saveOperatingHours = async () => {
    setLoadingAction("operating-hours");
    try {
      const res = await fetch("/api/operating-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: operatingHoursList }),
      });

      if (res.ok) {
        triggerNotification("Operating hours saved successfully");
      } else {
        triggerNotification("Failed to save operating hours", true);
      }
    } catch (err) {
      triggerNotification("Network error occurred", true);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleHourChange = (id: string, field: string, value: any) => {
    setOperatingHoursList((prev) =>
      prev.map((h) => (h.id === id ? { ...h, [field]: value } : h))
    );
  };

  // 4. SAVE PRICING
  const savePricing = async () => {
    setLoadingAction("pricing");
    try {
      const res = await fetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricingOptions: pricingList }),
      });

      if (res.ok) {
        triggerNotification("Pricing packages updated successfully");
      } else {
        triggerNotification("Failed to update pricing packages", true);
      }
    } catch (err) {
      triggerNotification("Network error occurred", true);
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePriceChange = (id: string, field: string, value: any) => {
    setPricingList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // 5. SAVE SETTINGS
  const saveSettings = async () => {
    setLoadingAction("settings");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsData),
      });

      if (res.ok) {
        triggerNotification("Studio settings updated successfully");
      } else {
        triggerNotification("Failed to update settings", true);
      }
    } catch (err) {
      triggerNotification("Network error occurred", true);
    } finally {
      setLoadingAction(null);
    }
  };

  // 6. ADD GALLERY ITEM
  const addGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl) return;

    setLoadingAction("gallery-add");
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newImageUrl,
          title: newImageTitle,
          category: newImageCategory,
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setGalleryList((prev) => [added, ...prev]);
        setNewImageUrl("");
        setNewImageTitle("");
        triggerNotification("Image added to gallery");
      } else {
        triggerNotification("Failed to add gallery image", true);
      }
    } catch (err) {
      triggerNotification("Network error occurred", true);
    } finally {
      setLoadingAction(null);
    }
  };

  // 7. DELETE GALLERY ITEM
  const deleteGalleryImage = async (id: string) => {
    if (!confirm("Remove this image from the gallery?")) return;
    setLoadingAction(`gallery-del-${id}`);

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        setGalleryList((prev) => prev.filter((img) => img.id !== id));
        triggerNotification("Image removed from gallery");
      } else {
        triggerNotification("Failed to remove gallery image", true);
      }
    } catch (err) {
      triggerNotification("Network error occurred", true);
    } finally {
      setLoadingAction(null);
    }
  };

  const getDayName = (dayOfWeekNum: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeekNum];
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-green-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-semibold shadow flex items-center space-x-2"
          >
            <Check size={14} />
            <span>{successMsg}</span>
          </motion.div>
        )}

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-red-655 text-white dark:bg-red-950 dark:text-red-400 rounded-xl text-xs font-semibold shadow flex items-center space-x-2"
          >
            <XCircle size={14} />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-150 dark:border-neutral-850 pb-4">
        {[
          { id: "overview", label: "Overview", icon: <Sliders size={14} /> },
          { id: "bookings", label: `Bookings (${pendingCount})`, icon: <Calendar size={14} /> },
          { id: "operating-hours", label: "Hours", icon: <Hourglass size={14} /> },
          { id: "pricing", label: "Pricing Packages", icon: <DollarSign size={14} /> },
          { id: "gallery", label: "Gallery", icon: <ImageIcon size={14} /> },
          { id: "settings", label: "Studio Info", icon: <SettingsIcon size={14} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition flex items-center space-x-1.5 ${
              activeTab === tab.id
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm"
                : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TABS CONTENT CONTAINER */}
      <div className="pt-4">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-neutral-450 block mb-1">Total Revenue</span>
                <strong className="text-2xl font-bold font-serif text-neutral-900 dark:text-white">{formatPrice(totalRevenue)}</strong>
              </div>
              <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-neutral-450 block mb-1">Pending Review</span>
                <strong className="text-2xl font-bold font-serif text-amber-500">{pendingCount}</strong>
              </div>
              <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-neutral-450 block mb-1">Confirmed Sessions</span>
                <strong className="text-2xl font-bold font-serif text-green-500">{confirmedCount}</strong>
              </div>
              <div className="bg-white dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-900 shadow-sm">
                <span className="text-[10px] uppercase tracking-wider text-neutral-450 block mb-1">Total Bookings</span>
                <strong className="text-2xl font-bold font-serif text-neutral-900 dark:text-white">{totalBookings}</strong>
              </div>
            </div>

            {/* Recent Pending Table */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-4 flex items-center space-x-2">
                <Hourglass size={16} />
                <span>Pending Booking Requests</span>
              </h3>

              {bookings.filter((b) => b.status === "PENDING").length === 0 ? (
                <p className="text-xs text-neutral-400 font-light py-4 text-center">No pending requests at the moment.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-100 dark:border-neutral-900 pb-3 text-neutral-400 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Ref</th>
                        <th>Client</th>
                        <th>Date & Time</th>
                        <th>Cost</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings
                        .filter((b) => b.status === "PENDING")
                        .slice(0, 5)
                        .map((b) => (
                          <tr key={b.id} className="border-b border-neutral-100 dark:border-neutral-900/50">
                            <td className="py-3 font-mono font-bold uppercase">{b.id.substring(0, 6)}</td>
                            <td>
                              <p className="font-semibold">{b.customerName}</p>
                              <p className="text-[10px] text-neutral-400 font-light">{b.customerEmail}</p>
                            </td>
                            <td>
                              <p>{formatDisplayDate(b.date)}</p>
                              <p className="text-[10px] text-neutral-400">{b.startTime} ({b.duration})</p>
                            </td>
                            <td>{formatPrice(b.price)}</td>
                            <td className="text-right space-x-1.5">
                              <button
                                disabled={loadingAction === b.id}
                                onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
                                className="px-2.5 py-1 bg-green-500 text-white rounded-md text-[10px] font-semibold hover:bg-green-600 transition"
                              >
                                Approve
                              </button>
                              <button
                                disabled={loadingAction === b.id}
                                onClick={() => updateBookingStatus(b.id, "CANCELLED")}
                                className="px-2.5 py-1 border border-neutral-250 text-neutral-500 rounded-md text-[10px] hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS LEDGER */}
        {activeTab === "bookings" && (
          <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Bookings Ledger</h3>
              <span className="text-[10px] text-neutral-400 font-light">Count: {bookings.length}</span>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-neutral-400 font-light py-8 text-center">No bookings registered in database.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-neutral-100 dark:border-neutral-900 pb-3 text-neutral-400 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5">Ref</th>
                      <th>Client Details</th>
                      <th>Reservation Window</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-neutral-100 dark:border-neutral-900/50">
                        <td className="py-3 font-mono font-bold uppercase">{b.id.substring(0, 8)}</td>
                        <td>
                          <p className="font-semibold">{b.customerName}</p>
                          <p className="text-[10px] text-neutral-400 font-light">{b.customerEmail} | {b.customerPhone}</p>
                        </td>
                        <td>
                          <p className="font-semibold">{formatDisplayDate(b.date)}</p>
                          <p className="text-[10px] text-neutral-450 dark:text-neutral-500">
                            {b.startTime} - {b.endTime} ({b.duration})
                          </p>
                        </td>
                        <td className="font-medium">{formatPrice(b.price)}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider inline-block ${
                            b.status === "PENDING"
                              ? "border-amber-400 text-amber-500 bg-amber-50/10"
                              : b.status === "CONFIRMED"
                              ? "border-green-400 text-green-500 bg-green-50/10"
                              : b.status === "COMPLETED"
                              ? "border-blue-400 text-blue-500 bg-blue-50/10"
                              : "border-neutral-300 text-neutral-500 bg-neutral-100/10"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="text-right space-x-1">
                          {b.status === "PENDING" && (
                            <button
                              disabled={loadingAction === b.id}
                              onClick={() => updateBookingStatus(b.id, "CONFIRMED")}
                              className="p-1 text-green-550 hover:bg-green-50 dark:hover:bg-green-950/20 rounded"
                              title="Approve Booking"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {b.status === "CONFIRMED" && (
                            <button
                              disabled={loadingAction === b.id}
                              onClick={() => updateBookingStatus(b.id, "COMPLETED")}
                              className="p-1 text-blue-550 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded"
                              title="Mark Completed"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {b.status !== "CANCELLED" && b.status !== "COMPLETED" && (
                            <button
                              disabled={loadingAction === b.id}
                              onClick={() => updateBookingStatus(b.id, "CANCELLED")}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded"
                              title="Cancel Session"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                          <button
                            disabled={loadingAction === b.id}
                            onClick={() => deleteBooking(b.id)}
                            className="p-1 text-neutral-400 hover:text-red-550 rounded"
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OPERATING HOURS */}
        {activeTab === "operating-hours" && (
          <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Manage Weekly Hours</h3>
              <p className="text-[10px] text-neutral-450 font-light">Set availability blocks per day</p>
            </div>

            <div className="space-y-4 max-w-xl">
              {operatingHoursList.map((hour) => (
                <div key={hour.id} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 text-xs">
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                    {getDayName(hour.dayOfWeek)}
                  </span>
                  
                  {/* Open Time */}
                  <div>
                    <input
                      type="text"
                      disabled={!hour.isOpen}
                      value={hour.openTime}
                      onChange={(e) => handleHourChange(hour.id, "openTime", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 disabled:opacity-50 transition"
                      placeholder="10:00"
                    />
                  </div>

                  {/* Close Time */}
                  <div>
                    <input
                      type="text"
                      disabled={!hour.isOpen}
                      value={hour.closeTime}
                      onChange={(e) => handleHourChange(hour.id, "closeTime", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 disabled:opacity-50 transition"
                      placeholder="22:00"
                    />
                  </div>

                  {/* Is Open Toggle */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={hour.isOpen}
                      onChange={(e) => handleHourChange(hour.id, "isOpen", e.target.checked)}
                      className="rounded text-neutral-900 focus:ring-neutral-900 h-4 w-4 dark:border-neutral-800"
                    />
                    <span className="text-[10px] text-neutral-500 font-light">Open for bookings</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-105 dark:border-neutral-800">
              <button
                disabled={loadingAction === "operating-hours"}
                onClick={saveOperatingHours}
                className="px-6 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-semibold tracking-wider uppercase transition shadow-sm"
              >
                {loadingAction === "operating-hours" ? "Saving..." : "Save Operating Hours"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PRICING PACKAGES */}
        {activeTab === "pricing" && (
          <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Manage Pricing Plans</h3>
              <p className="text-[10px] text-neutral-450 font-light">Adjust pricing models dynamically</p>
            </div>

            <div className="space-y-6 max-w-2xl">
              {pricingList.map((opt) => (
                <div key={opt.id} className="border-b border-neutral-100 dark:border-neutral-900/50 pb-4 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Package Name</label>
                      <input
                        type="text"
                        value={opt.label}
                        onChange={(e) => handlePriceChange(opt.id, "label", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Duration Tag</label>
                      <input
                        type="text"
                        disabled
                        value={opt.duration}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 text-sm dark:border-neutral-850 dark:bg-neutral-900 transition opacity-80"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Rate Price ($)</label>
                      <input
                        type="number"
                        value={opt.price}
                        onChange={(e) => handlePriceChange(opt.id, "price", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Short Description</label>
                    <input
                      type="text"
                      value={opt.description || ""}
                      onChange={(e) => handlePriceChange(opt.id, "description", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                      placeholder="Included features list"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                disabled={loadingAction === "pricing"}
                onClick={savePricing}
                className="px-6 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-semibold tracking-wider uppercase transition shadow-sm"
              >
                {loadingAction === "pricing" ? "Saving..." : "Save Pricing Options"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: GALLERY MANAGEMENT */}
        {activeTab === "gallery" && (
          <div className="space-y-8">
            {/* Add Image Form */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Add Image to Gallery</h3>
              
              <form onSubmit={addGalleryImage} className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs items-end">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Unsplash URL</label>
                  <input
                    type="url"
                    required
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Image Title</label>
                  <input
                    type="text"
                    value={newImageTitle}
                    onChange={(e) => setNewImageTitle(e.target.value)}
                    placeholder="Loft daylight setting"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Category</label>
                    <select
                      value={newImageCategory}
                      onChange={(e) => setNewImageCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                    >
                      <option value="Studio">Studio</option>
                      <option value="Portrait">Portrait</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Product">Product</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={loadingAction === "gallery-add"}
                    className="p-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl hover:opacity-90 shrink-0 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </form>
            </div>

            {/* Images list */}
            <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Current Gallery Photos</h3>

              {galleryList.length === 0 ? (
                <p className="text-xs text-neutral-400 font-light text-center py-6">No images in gallery.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {galleryList.map((img) => (
                    <div key={img.id} className="relative aspect-[4/3] rounded-xl overflow-hidden group border border-neutral-100 dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-900">
                      <Image
                        src={img.url}
                        alt={img.title || "Gallery thumbnail"}
                        fill
                        sizes="(max-width: 768px) 50vw, 150px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          disabled={loadingAction === `gallery-del-${img.id}`}
                          onClick={() => deleteGalleryImage(img.id)}
                          className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                          title="Remove image"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-neutral-950/60 p-1 text-[8px] text-white truncate font-light">
                        {img.title || "No Title"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: GENERAL SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">Manage Studio Contact details</h3>
              <p className="text-[10px] text-neutral-450 font-light">Customize footer and billing coordinates</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1.5">Studio Brand Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={settingsData.studioName}
                    onChange={(e) => setSettingsData({ ...settingsData, studioName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1.5">Studio Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    value={settingsData.email || ""}
                    onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1.5">Studio Phone Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <Phone size={14} />
                  </span>
                  <input
                    type="tel"
                    value={settingsData.phone || ""}
                    onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1.5">Studio Address Location</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-neutral-400">
                    <MapPin size={14} />
                  </span>
                  <input
                    type="text"
                    value={settingsData.address || ""}
                    onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none dark:border-neutral-850 dark:bg-neutral-950 transition"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                disabled={loadingAction === "settings"}
                onClick={saveSettings}
                className="px-6 py-2.5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-xl text-xs font-semibold tracking-wider uppercase transition shadow-sm"
              >
                {loadingAction === "settings" ? "Saving..." : "Save Settings Info"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
